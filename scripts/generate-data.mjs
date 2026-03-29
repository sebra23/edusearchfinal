/**
 * Generates us-cities.ts with all 50 states and top 10 cities each (500 total).
 * Run: node scripts/generate-data.mjs
 */
import fs from 'fs';
import { states1 } from './data/states-1.mjs';
import { states2 } from './data/states-2.mjs';

const states = [...states1, ...states2];

function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// More varied templates
function generateIntro(city, state, biz, attractions) {
    const intros = [
        `${city}, a premier destination in ${state}, serves as a vital hub for ${biz} and private aviation. With its strategic location and world-class infrastructure, the city attracts business leaders and leisure travelers seeking seamless connectivity. Whether arriving for meetings in the ${biz} district or exploring ${attractions[0]}, private jet charter offers the ultimate travel experience.`,
        `Experience the convenience of flying private to ${city}, ${state}. Known for its thriving ${biz} sector and cultural landmarks like ${attractions[0]}, ${city} offers discerning travelers exceptional access through its dedicated private aviation facilities. Avoid commercial congestion and arrive minutes from your final destination.`,
        `As a key ${biz} center in ${state}, ${city} demands the efficiency of private jet travel. Our charter services connect you directly to ${city}'s executive airports, bypassing the hassles of commercial terminals. From the moment you land, you're just a short drive from ${attractions[0]} and the city's business core.`,
        `For those traveling to ${city}, ${state}, private jet charter provides unmatched flexibility and comfort. This dynamic city, anchored by its ${biz} industry, offers numerous private terminals for discrete arrivals. Enjoy personalized service and direct access to ${attractions[0]} and luxury accommodations.`,
    ];
    return intros[city.length % intros.length];
}

function generateWhyChoose(city, state, airports) {
    const mainAirport = airports[0] ? airports[0].n : 'local private airports';
    return [
        `Direct access to ${mainAirport} eliminates commercial airport hassles`,
        `Skip long security lines and arrive just 15 minutes before departure`,
        `Flexible scheduling that adapts to ${city}'s dynamic business environment`,
        `Privacy and comfort for confidential business discussions`,
        `Access to smaller airports closer to your final destination in ${state}`,
    ];
}

function generateAirportInfo(airports, city) {
    if (airports.length === 0) return `${city} is served by nearby regional airports with dedicated private aviation facilities.`;

    const airportDescs = airports.map(a => `${a.n} (${a.c})`).join(', ');
    const mainAirport = airports[0];

    return `${city} is primarily served by ${mainAirport.n} (${mainAirport.c}), offering specialized FBO services for private aircraft. The area also provides access through ${airportDescs}. These facilities feature private lounges, hangarage, and rapid ground handling, ensuring a seamless transition from air to ground transportation.`;
}

function generateBestAircraft(regionType, city) {
    const recs = {
        coastal: `For flights to or from ${city}, light jets like the Phenom 300 are popular for regional coastal hops. For coast-to-coast travel, super-midsize jets such as the Challenger 350 offer the perfect balance of range and cabin comfort.`,
        inland: `Regional travel from ${city} is efficiently served by light jets like the Citation CJ4. For longer missions to the coasts, midsize jets like the Hawker 900XP provide excellent range and stand-up cabin comfort.`,
        mountain: `Operations in ${city}'s high-altitude environment require performance aircraft. The Pilatus PC-12 turboprop is a rugged favorite, while the Citation Latitude offers jet speed with excellent climb performance for mountain airports.`,
        desert: `High-temperature operations in ${city} call for capable aircraft. The Citation CJ3+ performs exceptionally well in hot and high conditions. For transcontinental reach, the Gulfstream G280 is a top choice.`,
        tropical: `For travel to and from ${city}, the Phenom 300 is ideal for reaching island destinations with shorter runways. For longer hauls to the mainland, the Bombardier Challenger 350 offers class-leading comfort and range.`,
    };
    return recs[regionType] || recs.inland;
}

function generateLocalInsights(city, state, biz, attractions) {
    return `The ${city} private aviation market is driven by its strong ${biz} sector and status as a key destination in ${state}. Peak charter demand often coincides with major industry conferences and seasonal events at ${attractions[0]}. The region boasts a robust network of FBOs and support services, catering to the specific needs of executive and VIP travelers.`;
}

function generateFaqs(city, state, airports) {
    const mainAirport = airports[0];
    const airportRef = mainAirport ? `${mainAirport.n} (${mainAirport.c})` : 'local airports';
    return [
        { question: `How much does a private jet charter cost from ${city}?`, answer: `Private jet charter costs from ${city} vary based on aircraft type, destination, and flight duration. Light jets typically range from $4,000-$5,500 per hour, midsize jets from $5,500-$9,500 per hour, and heavy jets from $10,000-$16,000 per hour. Popular routes like ${city} to major business hubs start from approximately $8,500.` },
        { question: `Which airports serve private jets near ${city}?`, answer: `${city} is served by ${airportRef}, along with other regional options. These airports offer dedicated FBO conveniences, including private terminals, concierge services, and direct tarmac access for limousines.` },
        { question: `How far in advance should I book a private jet from ${city}?`, answer: `While we can accommodate last-minute requests, we recommend booking your private jet charter from ${city} at least 24-48 hours in advance for optimal aircraft availability and pricing. For peak travel periods and major events in ${state}, booking 1-2 weeks ahead ensures the best selection of aircraft.` },
        { question: `What aircraft types are available for charter from ${city}?`, answer: `We offer a comprehensive fleet from ${city} including light jets (Citation CJ4, Phenom 300) for short regional flights, midsize jets (Citation Latitude, Challenger 350) for coast-to-coast travel, and heavy jets (Gulfstream G650, Global 7500) for international journeys. Our team will recommend the optimal aircraft based on your passenger count, luggage requirements, and destination.` },
    ];
}

// Major hubs with roughly correct coordinates for distance calculation (simplified)
const hubs = [
    { n: 'New York', s: 'NY', lat: 40.7, lon: -74.0, p: 20000 },
    { n: 'Los Angeles', s: 'CA', lat: 34.0, lon: -118.2, p: 22000 },
    { n: 'Miami', s: 'FL', lat: 25.7, lon: -80.2, p: 15000 },
    { n: 'Las Vegas', s: 'NV', lat: 36.1, lon: -115.1, p: 12000 },
    { n: 'Chicago', s: 'IL', lat: 41.8, lon: -87.6, p: 14000 },
    { n: 'Dallas', s: 'TX', lat: 32.7, lon: -96.7, p: 13000 },
    { n: 'Aspen', s: 'CO', lat: 39.1, lon: -106.8, p: 16000 },
    { n: 'Washington DC', s: 'DC', lat: 38.9, lon: -77.0, p: 11000 },
    { n: 'Teterboro', s: 'NJ', lat: 40.8, lon: -74.0, p: 9000 },
    { n: 'Van Nuys', s: 'CA', lat: 34.2, lon: -118.4, p: 8500 },
    { n: 'Palm Beach', s: 'FL', lat: 26.7, lon: -80.0, p: 14500 },
    { n: 'Atlanta', s: 'GA', lat: 33.7, lon: -84.3, p: 10500 },
];

function generateDests(city, state) {
    // Determine rough location of current city based on state (very simplified)
    // We'll just pick 4 diverse hubs that aren't the current city/state

    // Shuffle hubs
    const shuffled = hubs.filter(h => h.n !== city && h.s !== state).sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    return selected.map(hub => {
        // Mock travel time and price based on "random" distance factor
        const isCrossCountry = (state === 'CA' && ['NY', 'NJ', 'FL', 'DC'].includes(hub.s)) ||
            (state === 'NY' && ['CA', 'NV'].includes(hub.s));

        let time, price;
        if (isCrossCountry) {
            time = '5h 30m';
            price = `$${(25000 + Math.floor(Math.random() * 5000)).toLocaleString()}`;
        } else {
            // Regional/Mid-range
            const baseTime = 1.5 + Math.random() * 2.5; // 1.5 to 4 hours
            const hours = Math.floor(baseTime);
            const mins = Math.floor((baseTime - hours) * 60);
            time = `${hours}h ${mins}m`;

            const basePrice = 6000 + (baseTime * 3500);
            price = `$${Math.floor(basePrice).toLocaleString()}`;
        }

        return {
            city: hub.n,
            state: hub.s !== 'DC' ? hub.s : undefined, // Don't show state for DC usually or handle it
            time,
            price
        };
    });
}

function assignAirports(cityName, stateAirports, cityIndex) {
    if (stateAirports.length === 0) return [];

    // If exact match name (roughly)
    const exact = stateAirports.filter(a => a.n.includes(cityName));
    if (exact.length > 0) return exact.map(a => ({ code: a.c, name: a.n, distance: '5 miles' }));

    // Otherwise distribute
    if (cityIndex < stateAirports.length) {
        // Assign major airports to top cities
        const a = stateAirports[cityIndex];
        return [{ code: a.c, name: a.n, distance: '12 miles' }];
    }

    // Cycle through for others
    const a = stateAirports[cityIndex % stateAirports.length];
    return [{ code: a.c, name: a.n, distance: '20 miles' }];
}

let output = `// AUTO-GENERATED - Do not edit manually
// Generated by scripts/generate-data.mjs

export interface City {
  name: string;
  slug: string;
  population: string;
  airports: { code: string; name: string; distance: string }[];
  nearbyDestinations: { city: string; state?: string; time: string; price: string }[];
  regionType: 'coastal' | 'inland' | 'mountain' | 'desert' | 'tropical';
  businessType: string;
  attractions: string[];
  uniqueContent: {
    intro: string;
    whyChoose: string[];
    airportInfo: string;
    bestAircraft: string;
    localInsights: string;
    faqs: { question: string; answer: string }[];
  };
}

export interface StateData {
  name: string;
  code: string;
  cities: City[];
}

export const usStates: Record<string, StateData> = {\n`;

for (const st of states) {
    output += `  '${st.slug}': {\n    name: '${st.name}',\n    code: '${st.code}',\n    cities: [\n`;

    for (let i = 0; i < st.cities.length; i++) {
        const city = st.cities[i];
        const citySlug = slugify(city);
        const airports = assignAirports(city, st.airports, i);
        const biz = st.biz[i] || st.biz[0];
        const region = st.region;
        const pop = st.pop[i] || 50000;
        const attract = st.attract[i] || ['Downtown'];
        const dests = generateDests(city, st.code);
        const intro = generateIntro(city, st.name, biz, attract);
        const whyChoose = generateWhyChoose(city, st.name, airports);
        const airportInfo = generateAirportInfo(airports, city);
        const bestAircraft = generateBestAircraft(region, city);
        const localInsights = generateLocalInsights(city, st.name, biz, attract);
        const faqs = generateFaqs(city, st.name, airports);

        output += `      {\n`;
        output += `        name: ${JSON.stringify(city)},\n`;
        output += `        slug: '${citySlug}',\n`;
        output += `        population: '${pop.toLocaleString()}',\n`;
        output += `        airports: ${JSON.stringify(airports)},\n`;
        output += `        nearbyDestinations: ${JSON.stringify(dests)},\n`;
        output += `        regionType: '${region}',\n`;
        output += `        businessType: '${biz}',\n`;
        output += `        attractions: ${JSON.stringify(attract)},\n`;
        output += `        uniqueContent: {\n`;
        output += `          intro: ${JSON.stringify(intro)},\n`;
        output += `          whyChoose: ${JSON.stringify(whyChoose)},\n`;
        output += `          airportInfo: ${JSON.stringify(airportInfo)},\n`;
        output += `          bestAircraft: ${JSON.stringify(bestAircraft)},\n`;
        output += `          localInsights: ${JSON.stringify(localInsights)},\n`;
        output += `          faqs: ${JSON.stringify(faqs)},\n`;
        output += `        },\n`;
        output += `      },\n`;
    }

    output += `    ],\n  },\n`;
}

output += `};\n\n`;
output += `export function getAllCities(): City[] {
  const allCities: City[] = [];
  Object.values(usStates).forEach(state => {
    allCities.push(...state.cities);
  });
  return allCities;
}

export function getCitiesByState(stateSlug: string): City[] {
  return usStates[stateSlug]?.cities || [];
}

export function getCity(stateSlug: string, citySlug: string): City | undefined {
  const state = usStates[stateSlug];
  return state?.cities.find(city => city.slug === citySlug);
}

export function getStateBySlug(stateSlug: string): StateData | undefined {
  return usStates[stateSlug];
}
`;

const outPath = new URL('../data/us-cities.ts', import.meta.url).pathname;
fs.writeFileSync(outPath, output, 'utf-8');

console.log(`✅ Generated ${outPath}`);
console.log(`   States: ${states.length}`);
const totalCities = states.reduce((acc, s) => acc + s.cities.length, 0);
console.log(`   Cities: ${totalCities}`);
