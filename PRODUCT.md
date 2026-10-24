StreetPulse

A location-intelligence platform that helps entrepreneurs decide where to open a business in Georgia.

Core question

"Is this specific location a good place to open my business, and what evidence supports that decision?"

Today, entrepreneurs research Google Maps, competitor websites, neighborhood information, and rental listings separately. StreetPulse combines this information into one interactive map and a decision-ready report.

Market context

The category already exists internationally (e.g. Galigeo, GeoTrend). The opportunity is not the concept itself. It is building the best location-decision product specifically for Georgian businesses, with local data, Georgian-language support, and insights tailored to the Georgian market.

1. Product overview
A. Interactive business map

Users explore Tbilisi, select a neighborhood or drop a pin on a specific storefront, and see nearby:

Businesses and competitors
Transport stops
Schools and offices
Residential areas
Other relevant places
B. Location score and explanation

Each location gets a transparent, category-specific score. Different businesses value different factors:

Business	Key factors
Coffee shop	Offices, pedestrian access
Neighborhood gym	Nearby residents, competing gyms
C. Decision-ready report

A report showing the location's:

Advantages and disadvantages
Competing businesses
Missing information
What to verify before signing a lease
2. Example use case: opening a café in Tbilisi

A customer has two candidate storefronts and can't decide.

⚠️ Illustrative data only. These are fictional scores, not measurements of real locations.

	Location A	Location B
Score	82/100	68/100
Potential advantage	Nearby offices and transit	Residential surroundings
Risk	Several direct competitors (check saturation)	Less visible pedestrian access (verify on-site)

What StreetPulse explains:

Location A may suit takeaway coffee and morning customers.
Location B may suit a neighborhood café serving local residents.
Neither is automatically the better investment. Rent, demand, competition, and actual pedestrian traffic could change the conclusion.

The explanation is the real product. A map alone isn't enough; users need to understand what the data means for their business.

3. Features
Tier 1 — Location Explorer (build first)
 Search by address or map pin
 Select a business category
 Display nearby competitors and relevant places
 Filter competitors by category and distance
 Save potential locations
 Compare two or three locations side by side
Tier 2 — Intelligence Engine
 Category-specific location scores
 Identify competitor concentrations and potentially underserved areas
 Analyze nearby residential, commercial, and transport features
 Incorporate rental prices when reliable data is available
 Plain-language explanation of strengths and risks
Tier 3 — Business Reports
 Branded PDF reports
 Maps, competitor tables, score breakdowns, and source links
 Manual observations from site visits
 Track changes in the competitive landscape
 Shareable reports for partners or investors
4. Scoring system

The scoring model must be transparent and deterministic. An AI model must never invent numbers or assign arbitrary scores.

Weighted model (example: café)
Factor	Example weight
Relevant nearby businesses and activity	25%
Competitor pressure	20%
Residential and workplace surroundings	20%
Accessibility and transport	15%
Rent relative to the business's budget	10%
On-site observations	10%

These weights are starting hypotheses, not proven predictors. They should be tested and refined using real business outcomes and expert feedback.

Formula
S = Σ(wᵢ · sᵢ) / Σ(wᵢ)
sᵢ — normalized score for factor i
wᵢ — weight for factor i
Interface requirements
Show why a location scored well or poorly
Show the source behind each observation
Flag which factors lack reliable data

Important: A location score measures how well a site matches the chosen criteria. It does not mean there is an 82% chance of business success.

5. Data sources

Data is the biggest challenge and the potential competitive advantage.

Data	Source	Notes
Nearby places and competitors	OpenStreetMap, other authorized business-listing sources	Categories, coordinates, names, distances. Coverage may be incomplete; never claim every competitor is included.
Population and neighborhood characteristics	Geostat, published public datasets	Use at the geographic level provided. Broad statistics don't reveal street-level demand.
Transport and accessibility	Mapped roads, pedestrian routes, public transport data	Calculate walking distances and proximity to destinations.
User observations	Site visits	Pedestrian counts, opening hours, rent, visibility. Especially valuable where public data is missing.
Free-first data rule

The MVP uses only free and open data (OpenStreetMap, Geostat, user observations). Paid datasets such as commercial foot-traffic or rent feeds are deferred until paying customers need them.

Risks to manage
Licensing and usage permissions (OpenStreetMap data requires ODbL attribution)
API costs
Data freshness
Privacy
Real foot-traffic and accurate commercial rent data may be difficult or expensive to obtain
6. Tech stack (₾0 to run)

Buildable by a solo developer, no custom AI model training required. Every component is open source or has a free tier sufficient for the MVP.

Component	Technology	Cost	Purpose
Frontend	Next.js + TypeScript	Free (open source)	Website and application
Styling	Tailwind CSS + shadcn/ui	Free (open source)	Dashboard interface
Interactive map	MapLibre GL JS	Free (open source)	Maps and location markers
Map tiles	OpenFreeMap or self-hosted Protomaps (PMTiles)	Free	Base map imagery, no API key
Database	MongoDB Atlas (M0 free cluster)	Free	Users, places, saved locations, reports
ODM	Mongoose	Free (open source)	Schemas and queries from Next.js
Geospatial queries	MongoDB 2dsphere indexes ($near, $geoWithin, $geoNear)	Included	Nearby businesses, radius search, distances
Authentication	Auth.js (NextAuth) + MongoDB adapter	Free (open source)	Email / Google sign-in
Geocoding	Nominatim or Photon (OpenStreetMap)	Free (respect usage policy)	Address → coordinates
Places data	OpenStreetMap via Overpass API	Free	Competitors, transport, schools, offices
Walking distances	openrouteservice free tier, or self-hosted OSRM	Free	Isochrones and walking routes
Data ingestion	GitHub Actions scheduled workflows	Free	Periodically refresh OSM data into MongoDB
AI explanations	Template-based text first; optionally Gemini or Groq free tier	Free	Explain sourced findings in plain language
Charts	Recharts	Free (open source)	Score breakdowns and comparisons
PDF generation	@react-pdf/renderer	Free (open source)	Downloadable reports
File storage	MongoDB GridFS or Cloudflare R2 free tier	Free	Site-visit photos, generated PDFs
Hosting	Cloudflare Pages/Workers or Netlify free tier	Free	Deploy the Next.js app
Analytics	Umami (self-hosted) or Cloudflare Web Analytics	Free	Usage tracking
Payments	Dodo Payments (merchant of record)	No monthly fee; per-transaction fee only	Single reports (one-time) and Pro subscriptions
Example MongoDB collections
js
// places — imported from OpenStreetMap
{
  _id, osmId, name, nameKa, category,      // e.g. "cafe", "gym", "bus_stop"
  location: { type: "Point", coordinates: [44.7930, 41.7151] }, // [lng, lat]
  tags: { ... }, source: "osm", updatedAt
}
// index: db.places.createIndex({ location: "2dsphere", category: 1 })

// candidateLocations — saved by users
{
  _id, userId, label, address, businessCategory,
  location: { type: "Point", coordinates: [lng, lat] },
  rentGel, observations: [{ type, value, notedAt }],
  score: { total, factors: [{ name, weight, value, source, confidence }] }
}

// reports
{ _id, userId, locationIds: [...], pdfFileId, createdAt }
Example nearby-competitor query
js
db.places.find({
  category: "cafe",
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: 500 // metres
    }
  }
})
Free-tier caveats
MongoDB Atlas M0 has limited storage (512 MB) and shared resources. That is plenty for one city's OSM places plus early users; upgrade only when revenue justifies it.
Vercel Hobby is free but restricted to non-commercial use, so prefer Cloudflare or Netlify once StreetPulse charges money.
Nominatim and Overpass public servers have fair-use limits (e.g. ~1 request/second for Nominatim). Cache results in MongoDB and import data in bulk rather than querying per user request.
LLM free tiers change often and have rate limits. Start with template-generated explanations from the score breakdown; add an LLM later only to rephrase, never to produce numbers.
Payments can't be fully free, but there's no fixed cost until you make sales. Dodo Payments charges about 4% + $0.40 per transaction, plus ~0.5% on subscriptions.
Verify current free-tier limits before launch, as providers change them.
Payments with Dodo

Dodo Payments acts as the merchant of record: it is the legal seller, so it handles tax (VAT/GST), fraud checks, chargebacks and card compliance. StreetPulse is a SaaS/digital product, which is the type of business Dodo supports.

Product	Dodo setup
Single report (₾29–59)	One-time payment product
Pro subscription (₾79–149/mo)	Subscription product (monthly)
Business / Enterprise	Custom invoice or subscription created per customer

Integration flow (Next.js):

Create products in the Dodo dashboard and store their product IDs in env variables.
A server route creates a Dodo checkout session for the logged-in user and redirects them to Dodo's hosted checkout.
A webhook route (/api/webhooks/dodo) verifies the signature and, on payment or subscription events, updates the user's plan in MongoDB.
Gate Pro features and report generation by reading the plan from MongoDB, never from the client.
js
// users collection — billing fields
{
  _id, email, plan: "free" | "pro" | "business",
  dodoCustomerId, dodoSubscriptionId,
  subscriptionStatus: "active" | "cancelled" | "past_due",
  reportCredits: 0,          // incremented by one-time report purchases
  currentPeriodEnd
}

Check before launch:

 Whether Dodo supports pricing in GEL; if not, list prices in USD or EUR and show approximate lari amounts on the pricing page.
 Payout options and fees to a Georgian bank account (Dodo charges a small fee on payouts under $1,000).
 Dodo's test mode for building and testing checkout without real charges.

Start with: the map, competitor search, saved locations, and a transparent scoring system.

7. Monetization

Proposed prices to test, not validated Georgian market prices.

Plan	Price	Includes
Free Explorer	₾0	Basic map, limited competitor searches, one sample report
Single report	₾29–59	Detailed analysis of one proposed location
Pro subscription	₾79–149/mo	For entrepreneurs and consultants comparing multiple locations
Business / Enterprise	Custom	For chains, brokers, and companies evaluating many locations
Target recurring customers
Franchise operators
Real estate consultants
Commercial property owners
Companies planning multiple branches

Someone opening a single café may only need the service once, so don't rely exclusively on individual report sales.

8. Launch plan (4 weeks)
Week	Goal	Activities
1	Validate the problem	Interview 10–15 café owners, salon owners, and entrepreneurs who recently searched for commercial space. Ask how they chose locations and what information they couldn't find.
2	Build one neighborhood	Pick one area of Tbilisi and one business category. Build the map, competitor database, and a basic location report.
3	Test real locations	Analyze actual candidate storefronts, verify listings, and compare results with on-site observations. Clearly label missing and estimated information.
4	Try to sell it	Offer reports to prospective customers. Learn whether they'll pay and what they need before making a real decision.
9. Differentiators
Georgian-market coverage — Local-language data and category-specific insights for Georgian cities.
Rent economics — Users input rent and operating costs; model the business volume needed to cover them.
Evidence-based recommendations — Sources, confidence levels, and missing data shown, not a mysterious AI score.
Real-world validation — Help customers collect pedestrian counts and observations when digital estimates fall short.
Opportunity discovery — Eventually identify areas where business types appear underrepresented, clearly distinguishing a market gap from proven demand.

Long-term moat: a trusted local dataset, improved over time by learning which indicators actually matter.

10. MVP scope

Build first: a site comparison and research tool for entrepreneurs opening cafés, salons, and small retail businesses in Tbilisi.

Don't start with: exact revenue prediction or coverage of all of Georgia.

The first version must answer three questions exceptionally well:

Who and what is around this location?
How does it compare with my other options?
What should I verify before committing money?

If customers will pay for those answers, StreetPulse has a foundation to expand into a more sophisticated location-intelligence platform.