/** Score factors and their explanations — split from the app dictionary to keep files short. */
export const EN_SCORE_DICTIONARY = {
  score: {
    title: 'Location score',
    backedByData: 'has data',
    noData: 'no data',
    valueOf: '{label}: {value} of 100',
    disclaimer: 'Shows how well the site fits. Not a chance of success.',
    confidence: { high: 'reliable', medium: 'fairly reliable', low: 'rough', none: 'no data' },
    factors: {
      activity: 'Busy street',
      competition: 'Shops like yours',
      surroundings: 'People living & working nearby',
      transport: 'Bus & metro',
      rent: 'Rent vs budget',
      on_site: 'Your own visit',
    },
    /** One plain question per factor; the verdict word answers it. */
    questions: {
      activity: 'Do people already come to this street?',
      competition: 'Are there few shops selling the same thing?',
      surroundings: 'Do lots of people live or work close by?',
      transport: 'Is it easy to get here by bus or metro?',
      rent: 'Can you afford the rent?',
      on_site: 'Did it look good when you visited?',
    },
    verdict: { good: 'Good', okay: 'OK', weak: 'Weak', none: 'Not known yet' },
    sources: { osm: 'OpenStreetMap', user: 'You', siteVisit: 'Site visit' },
    evidence: {
      activity: '{count} useful places nearby ({categories}).',
      competition: '{count} shops like yours within {radius} m.',
      surroundings: '{residential} homes and {workplaces} offices within {radius} m.',
      surroundingsMissing: 'No homes or offices are on the map here.',
      transport: '{busStops} bus stops and {metro} metro entrances.',
      rent: 'Rent ₾{rent} is {ratio}% of your ₾{budget} budget.',
      rentMissing: 'Save the place with rent and budget to answer this.',
      onSite: 'From your site visit.',
      onSiteMissing: 'Go there and count the people walking past.',
    },
    /** Real estate wording, used instead of the lines above where they differ. */
    property: {
      factors: {
        activity: 'Everyday places',
        competition: 'Other office buildings',
        rent: 'Price vs budget',
      },
      questions: {
        activity: 'Are shops, schools and pharmacies close?',
        competition: 'Are there few other offices to compete with?',
        surroundings: 'Do people live and work close by?',
        rent: 'Can you afford the price?',
        on_site: 'Did it look good when you visited (noise, view, road)?',
      },
      evidence: {
        competition: '{count} office buildings within {radius} m.',
        rent: 'Price ₾{rent} is {ratio}% of your ₾{budget} budget.',
        rentMissing: 'Save the place with price and budget to answer this.',
        onSiteMissing: 'Go there and check noise, light and the road.',
      },
    },
  },
  explain: {
    advantagesTitle: 'Good',
    risksTitle: 'Watch out',
    missingTitle: 'Missing',
    verifyTitle: 'Check before signing',
    source: '({source})',
    missingItem: '{label}: no data.',
    advantages: {
      activity: 'Busy street with useful businesses nearby.',
      competition: 'Few competitors nearby.',
      surroundings: 'Plenty of homes and offices around.',
      transport: 'Easy to reach by bus or metro.',
      rent: 'Rent fits your budget.',
      on_site: 'Good foot traffic and visibility.',
    },
    risks: {
      activity: 'Quiet area — few businesses nearby.',
      competition: 'Many competitors nearby.',
      surroundings: 'Few homes or offices around.',
      transport: 'Hard to reach by public transport.',
      rent: 'Rent is above your budget.',
      on_site: 'Low foot traffic or hard to see.',
    },
    missingVerify: {
      activity: 'Walk the street and note open businesses.',
      competition: 'Count competitors on-site.',
      surroundings: 'Check who lives and works nearby.',
      transport: 'Find the nearest bus and metro stops.',
      rent: 'Get the rent and lease terms in writing.',
      on_site: 'Count passers-by at peak hours.',
    },
    baseline: {
      footTraffic: 'Count passers-by when you plan to open.',
      competitors: 'Visit the nearest competitors.',
      lease: 'Check lease length, deposit and rent increases.',
      permits: 'Check permits and utilities.',
      zoning: 'Ask the city what you are allowed to build here — we don’t have zoning data.',
      ownership: 'Check who owns the land in the public registry.',
      prices: 'Compare flat or office prices nearby — we don’t have price data.',
      utilities: 'Check water, power, gas and road access.',
    },
    /** Real estate wording, used instead of the lines above where they differ. */
    property: {
      advantages: {
        activity: 'Shops, schools and pharmacies are close.',
        competition: 'Few other office buildings nearby.',
        rent: 'The price fits your budget.',
        on_site: 'The site looked good on your visit.',
      },
      risks: {
        activity: 'Few shops, schools or pharmacies close by.',
        competition: 'Many other office buildings nearby.',
        rent: 'The price is above your budget.',
        on_site: 'The site had problems on your visit.',
      },
      missingVerify: {
        rent: 'Get the price and terms in writing.',
        on_site: 'Visit the site: noise, light, road access.',
      },
    },
  },
};

export type ScoreDictionary = typeof EN_SCORE_DICTIONARY;
