import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const queries = Array.isArray(input.queries) && input.queries.length
  ? input.queries
  : ['restaurants in Luanda'];
const maxLeads = Math.min(Math.max(Number(input.maxLeads ?? 25), 1), 500);
const language = input.language ?? 'en';
const country = input.country ?? 'ao';

const seen = new Set();
let produced = 0;

function clean(value) {
  return String(value ?? '').replace(/\\s+/g, ' ').trim();
}

function scoreLead(lead) {
  let score = 50;
  const reasons = [];
  if (!lead.website) { score += 25; reasons.push('No website found'); }
  else { score += 5; reasons.push('Website found'); }
  if (lead.phone) { score += 8; reasons.push('Phone available'); }
  if (lead.rating && Number(lead.rating) >= 4.2) { score += 5; reasons.push('Strong rating'); }
  if (lead.reviews && Number(lead.reviews) >= 30) { score += 4; reasons.push('Established review volume'); }
  if (!lead.address) { score -= 5; }
  return {
    score: Math.max(0, Math.min(100, score)),
    opportunity: score >= 85 ? 'HIGH' : score >= 70 ? 'MEDIUM' : 'LOW',
    reasons
  };
}

const startUrls = queries.map((q) => ({
  url: `https://www.google.com/maps/search/${encodeURIComponent(q)}?hl=${encodeURIComponent(language)}`,
  userData: { query: q }
}));

const crawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: queries.length + maxLeads * 2,
  maxConcurrency: 3,
  requestHandlerTimeoutSecs: 45,
  async requestHandler({ page, request, log }) {
    if (produced >= maxLeads) return;

    const query = request.userData?.query ?? '';

    if (!request.userData?.detail) {
      await page.waitForTimeout(2500);

      const links = await page.locator('a[href*="/maps/place/"]').evaluateAll((els) =>
        els.map((a) => ({ href: a.href, text: a.innerText })).filter((x) => x.href)
      );

      const unique = [];
      for (const item of links) {
        if (!seen.has(item.href)) {
          seen.add(item.href);
          unique.push(item);
        }
      }

      for (const item of unique.slice(0, maxLeads - produced)) {
        await crawler.addRequests([{
          url: item.href,
          userData: { detail: true, query, seedText: item.text }
        }]);
      }
      return;
    }

    const text = clean(await page.locator('body').innerText().catch(() => ''));
    const title = clean(await page.locator('h1').first().innerText().catch(() => request.userData?.seedText || ''));

    const phoneMatch = text.match(/(?:\\+?\\d[\\d ()-]{7,}\\d)/);
    const website = await page.locator('a[data-item-id="authority"]').first().getAttribute('href').catch(() => null);

    const ratingMatch = text.match(/\\b([0-5]\\.[0-9])\\b/);
    const reviewsMatch = text.match(/([\\d,.]+)\\s*(?:reviews|avaliações|avis)/i);

    const lead = {
      name: title || clean(request.userData?.seedText),
      query,
      website: website || null,
      phone: phoneMatch ? clean(phoneMatch[0]) : null,
      rating: ratingMatch ? Number(ratingMatch[1]) : null,
      reviews: reviewsMatch ? Number(reviewsMatch[1].replace(/[,\.]/g, '')) : null,
      sourceUrl: request.url,
      country,
      collectedAt: new Date().toISOString()
    };

    const qualification = scoreLead(lead);
    await Actor.pushData({
      ...lead,
      leadScore: qualification.score,
      opportunity: qualification.opportunity,
      qualificationReasons: qualification.reasons,
      recommendedAction: qualification.score >= 85
        ? 'Contact first: strong sales opportunity.'
        : qualification.score >= 70
          ? 'Review and contact if the offer matches.'
          : 'Lower priority.'
    });

    produced++;
    log.info(`Lead ${produced}/${maxLeads}: ${lead.name} (${qualification.score})`);
  }
});

await crawler.run(startUrls);
await Actor.setValue('RUN_SUMMARY', {
  queries,
  leadsProduced: produced,
  maxLeads,
  version: '0.1.0'
});

await Actor.exit();