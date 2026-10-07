FROM apify/actor-node-playwright-chrome:24

COPY --chown=myuser:myuser package*.json ./

RUN npm --quiet set progress=false \
    && npm install --omit=dev --omit=optional \
    && node --version \
    && npm --version \
    && rm -rf ~/.npm

COPY --chown=myuser:myuser . ./

CMD ["npm", "start", "--silent"]
