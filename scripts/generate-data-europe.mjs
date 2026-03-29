/**
 * Generates europe-cities.ts with top European cities.
 * Run: node scripts/generate-data-europe.mjs
 */
import fs from 'fs';
import { europeCountries } from './data/europe-cities.mjs';

function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatPrice(amount, currency) {
    const symbols = { 'EUR': '€', 'GBP': '£', 'CHF': 'Fr', 'USD': '$' };
    return `${symbols[currency] || currency}${amount.toLocaleString()}`;
}

function formatDistance(miles, unit) {
    if (unit === 'metric') {
        return `${Math.round(miles * 1.60934)} km`;
    }
    return `${miles} miles`;
}

// European-specific templates regarding currency and units
function generateIntro(city, country, biz, attractions) {
    const intros = [
        `${city}, a premier destination in ${country}, serves as a vital hub for ${biz} and private aviation. With its strategic location and world-class infrastructure, the city attracts business leaders and leisure travelers seeking seamless connectivity. Whether arriving for meetings in the ${biz} district or exploring ${attractions[0]}, private jet charter offers the ultimate travel experience.`,
        `Experience the convenience of flying private to ${city}, ${country}. Known for its thriving ${biz} sector and cultural landmarks like ${attractions[0]}, ${city} offers discerning travelers exceptional access through its dedicated private aviation facilities. Avoid commercial congestion and arrive minutes from your final destination.`,
        `As a key ${biz} center in ${country}, ${city} demands the efficiency of private jet travel. Our charter services connect you directly to ${city}'s executive airports, bypassing the hassles of commercial terminals. From the moment you land, you're just a short drive from ${attractions[0]} and the city's business core.`,
    ];
    return intros[city.length % intros.length];
}

function generateWhyChoose(city, country, airports) {
    const mainAirport = airports[0] ? airports[0].n : 'local private airports';
    return [
        `Direct access to ${mainAirport} eliminates commercial airport hassles`,
        `Skip long security lines and arrive just 15 minutes before departure`,
        `Flexible scheduling that adapts to ${city}'s dynamic business environment`,
        `Privacy and comfort for confidential business discussions`,
        `Access to smaller airports closer to your final destination in ${country}`,
    ];
}

function generateAirportInfo(airports, city, unit) {
    if (airports.length === 0) return `${city} is served by nearby regional airports with dedicated private aviation facilities.`;

    const airportDescs = airports.map(a => `${a.n} (${a.c})`).join(', ');
    const mainAirport = airports[0];

    return `${city} is primarily served by ${mainAirport.n} (${mainAirport.c}), offering specialized FBO services for private aircraft. The area also provides access through ${airportDescs}. These facilities feature private lounges, hangarage, and rapid ground handling, ensuring a seamless transition from air to ground transportation.`;
}

function generateBestAircraft(regionType, city) {
    // European specific aircraft preferences
    const recs = {
        coastal: `For flights to or from ${city}, light jets like the Phenom 300 are popular for regional coastal hops. For longer European routes, super-midsize jets such as the Challenger 350 offer the perfect balance of range and cabin comfort.`,
        inland: `Regional travel from ${city} is efficiently served by light jets like the Citation CJ4. For longer missions across Europe, midsize jets like the Hawker 900XP provide excellent range and stand-up cabin comfort.`,
        mountain: `Operations in ${city}'s high-altitude environment require performance aircraft. The Pilatus PC-12 turboprop is a rugged favorite in the Alps, while the Citation Latitude offers jet speed with excellent climb performance for mountain airports.`,
    };
    return recs[regionType] || recs.inland;
}

function generateLocalInsights(city, country, biz, attractions) {
    return `The ${city} private aviation market is driven by its strong ${biz} sector and status as a key destination in ${country}. Peak charter demand often coincides with major industry conferences and seasonal events at ${attractions[0]}. The region boasts a robust network of FBOs and support services, catering to the specific needs of executive and VIP travelers.`;
}

function generateFaqs(city, country, airports, currency, unit) {
    const mainAirport = airports[0];
    const airportRef = mainAirport ? `${mainAirport.n} (${mainAirport.c})` : 'local airports';

    // Adjust pricing roughly for currency
    let lightPrice = 4500;
    let midPrice = 6500;
    let heavyPrice = 10000;

    if (currency === 'GBP') { lightPrice *= 0.8; midPrice *= 0.8; heavyPrice *= 0.8; }
    if (currency === 'CHF') { lightPrice *= 0.95; midPrice *= 0.95; heavyPrice *= 0.95; }

    const lP = formatPrice(Math.round(lightPrice), currency);
    const mP = formatPrice(Math.round(midPrice), currency);
    const hP = formatPrice(Math.round(heavyPrice), currency);

    return [
        { question: `How much does a private jet charter cost from ${city}?`, answer: `Private jet charter costs from ${city} vary based on aircraft type, destination, and flight duration. Light jets typically range from ${lP} per hour, midsize jets from ${mP} per hour, and heavy jets from ${hP} per hour. Contact us for a precise quote.` },
        { question: `Which airports serve private jets near ${city}?`, answer: `${city} is served by ${airportRef}, along with other regional options. These airports offer dedicated FBO conveniences, including private terminals, concierge services, and direct tarmac access.` },
        { question: `How far in advance should I book a private jet from ${city}?`, answer: `While we can accommodate last-minute requests, we recommend booking your private jet charter from ${city} at least 24-48 hours in advance for optimal aircraft availability and pricing. For peak travel periods and major events in ${country}, booking 1-2 weeks ahead ensures the best selection.` },
        { question: `What aircraft types are available for charter from ${city}?`, answer: `We offer a comprehensive fleet from ${city} including light jets (Citation CJ4, Phenom 300) for short regional flights, midsize jets (Citation Latitude, Challenger 350) for cross-continent travel. Our team will recommend the optimal aircraft based on your passenger count and luggage requirements.` },
    ];
}

// Major European hubs for route generation
const hubs = [
    { n: 'London', c: 'UK', cur: 'GBP' },
    { n: 'Paris', c: 'FR', cur: 'EUR' },
    { n: 'Geneva', c: 'CH', cur: 'CHF' },
    { n: 'Nice', c: 'FR', cur: 'EUR' },
    { n: 'Zurich', c: 'CH', cur: 'CHF' },
    { n: 'Milan', c: 'IT', cur: 'EUR' },
    { n: 'Madrid', c: 'ES', cur: 'EUR' },
    { n: 'Berlin', c: 'DE', cur: 'EUR' },
    { n: 'Rome', c: 'IT', cur: 'EUR' },
    { n: 'Ibiza', c: 'ES', cur: 'EUR' },
];

function generateDests(city, country, originCurrency) {
    // Pick 3 diverse hubs
    const shuffled = hubs.filter(h => h.n !== city).sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    return selected.map(hub => {
        // Mock travel time and price
        const baseTime = 1.0 + Math.random() * 2.0; // 1 to 3 hours mostly within Europe
        const hours = Math.floor(baseTime);
        const mins = Math.floor((baseTime - hours) * 60);
        const time = `${hours}h ${mins}m`;

        let basePrice = 5000 + (baseTime * 3000); // Base price in EUR

        // Convert to origin currency
        if (originCurrency === 'GBP') basePrice *= 0.85;
        if (originCurrency === 'CHF') basePrice *= 0.95;

        const price = formatPrice(Math.round(basePrice), originCurrency);

        return {
            city: hub.n,
            country: hub.c,
            time,
            price
        };
    });
}

function assignAirports(cityName, countryAirports, cityIndex) {
    if (countryAirports.length === 0) return [];

    // If exact match name (roughly)
    const exact = countryAirports.filter(a => a.n.includes(cityName));
    if (exact.length > 0) return exact.map(a => ({ code: a.c, name: a.n, distance: '10 km' }));

    // Otherwise distribute
    const a = countryAirports[cityIndex % countryAirports.length];
    return [{ code: a.c, name: a.n, distance: '25 km' }];
}

let output = `// AUTO-GENERATED - Do not edit manually
// Generated by scripts/generate-data-europe.mjs

export interface EuropeCity {
  name: string;
  slug: string;
  country: string;
  code: string;
  population: string;
  currency: string;
  unitSystem: 'metric' | 'imperial';
  airports: { code: string; name: string; distance: string }[];
  nearbyDestinations: { city: string; country: string; time: string; price: string }[];
  regionType: 'coastal' | 'inland' | 'mountain' | 'tropical';
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

export interface CountryData {
  name: string;
  slug: string;
  code: string;
  cities: EuropeCity[];
}

export const europeData: Record<string, CountryData> = {\n`;

for (const country of europeCountries) {
    output += `  '${country.slug}': {\n    name: '${country.name}',\n    slug: '${country.slug}',\n    code: '${country.code}',\n    cities: [\n`;

    for (let i = 0; i < country.cities.length; i++) {
        const city = country.cities[i];
        const citySlug = slugify(city);
        const airports = assignAirports(city, country.airports, i);
        const biz = country.biz[i] || country.biz[0];
        const region = country.region;
        const pop = country.pop[i] || 50000;
        const attract = country.attract[i] || ['Downtown'];
        const dests = generateDests(city, country.name, country.currency);
        const intro = generateIntro(city, country.name, biz, attract);
        const whyChoose = generateWhyChoose(city, country.name, airports);
        const airportInfo = generateAirportInfo(airports, city, country.unit);
        const bestAircraft = generateBestAircraft(region, city);
        const localInsights = generateLocalInsights(city, country.name, biz, attract);
        const faqs = generateFaqs(city, country.name, airports, country.currency, country.unit);

        output += `      {\n`;
        output += `        name: ${JSON.stringify(city)},\n`;
        output += `        slug: '${citySlug}',\n`;
        output += `        country: '${country.name}',\n`;
        output += `        code: '${country.code}',\n`;
        output += `        population: '${pop.toLocaleString()}',\n`;
        output += `        currency: '${country.currency}',\n`;
        output += `        unitSystem: '${country.unit}',\n`;
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

output += `
export function getAllEuropeCities(): EuropeCity[] {
  const all: EuropeCity[] = [];
  Object.values(europeData).forEach(c => all.push(...c.cities));
  return all;
}

export function getEuropeCity(countrySlug: string, citySlug: string): EuropeCity | undefined {
  return europeData[countrySlug]?.cities.find(c => c.slug === citySlug);
}
`;

const outPath = new URL('../data/europe-cities.ts', import.meta.url).pathname;
fs.writeFileSync(outPath, output, 'utf-8');

console.log(`✅ Generated ${outPath}`);
console.log(`   Countries: ${europeCountries.length}`);
const totalCities = europeCountries.reduce((acc, c) => acc + c.cities.length, 0);
console.log(`   Cities: ${totalCities}`);
