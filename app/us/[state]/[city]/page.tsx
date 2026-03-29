import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCity, getCitiesByState, usStates } from '@/data/us-cities';
import ExpandableContent from '@/components/ExpandableContent';
import { Plane, MapPin, Clock, DollarSign } from 'lucide-react';

interface CityPageProps {
    params: Promise<{
        state: string;
        city: string;
    }>;
}

// Aircraft recommendations per region
const aircraftByRegion: Record<string, { name: string; desc: string }[]> = {
    coastal: [
        { name: 'Citation X', desc: 'Perfect for quick hops along the coast' },
        { name: 'Challenger 350', desc: 'Ideal for transcontinental flights' },
        { name: 'Gulfstream G280', desc: 'Super midsize comfort' },
    ],
    inland: [
        { name: 'Citation XLS+', desc: 'Versatile midsize for regional routes' },
        { name: 'Phenom 300', desc: 'Light jet efficiency with comfort' },
        { name: 'Hawker 900XP', desc: 'Proven reliability for business travel' },
    ],
    mountain: [
        { name: 'Pilatus PC-12', desc: 'Exceptional high-altitude performance' },
        { name: 'Citation CJ4', desc: 'Jet speed with short-field capability' },
        { name: 'King Air 350', desc: 'Rugged turboprop for mountain ops' },
    ],
    desert: [
        { name: 'Phenom 300E', desc: 'Hot climate optimized performance' },
        { name: 'Citation CJ3+', desc: 'Efficient in high temperatures' },
        { name: 'Challenger 350', desc: 'Long-range desert capability' },
    ],
    tropical: [
        { name: 'Citation Latitude', desc: 'Wide cabin for island hopping' },
        { name: 'Phenom 300', desc: 'Versatile for tropical conditions' },
        { name: 'Gulfstream G280', desc: 'Intercontinental range' },
    ],
};

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { state, city } = await params;
    const cityData = getCity(state, city);

    if (!cityData) {
        return { title: 'City Not Found' };
    }

    const stateData = usStates[state];
    const nearbyAirports = cityData.airports.map(a => a.code).join(', ');

    return {
        title: `Private Jet Charter ${cityData.name}, ${stateData.code} | Instant Quotes & Premium Aircraft`,
        description: `Charter a private jet to ${cityData.name}, ${stateData.name}. Access ${nearbyAirports} airports. Instant quotes, ${cityData.airports.length}+ FBO options, and premium aircraft. ${cityData.uniqueContent.intro.substring(0, 100)}...`,
        keywords: [
            `private jet ${cityData.name}`,
            `private jet charter ${cityData.name}`,
            `${cityData.name} private jet`,
            `private aviation ${cityData.name}`,
            `jet charter ${cityData.name} ${stateData.code}`,
            ...cityData.airports.map(a => `${a.code} private jet`),
        ],
        openGraph: {
            title: `Private Jet Charter ${cityData.name}, ${stateData.code}`,
            description: cityData.uniqueContent.intro,
            type: 'website',
        },
    };
}

export async function generateStaticParams() {
    const params: { state: string; city: string }[] = [];
    Object.keys(usStates).forEach(stateSlug => {
        const cities = getCitiesByState(stateSlug);
        cities.forEach(city => {
            params.push({ state: stateSlug, city: city.slug });
        });
    });
    return params;
}

export default async function CityPage({ params }: CityPageProps) {
    const { state, city } = await params;
    const cityData = getCity(state, city);

    if (!cityData) {
        notFound();
    }

    const stateData = usStates[state];
    const aircraft = aircraftByRegion[cityData.regionType] || aircraftByRegion.inland;

    // Schema.org markup
    const schemaMarkup = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `Private Jet Charter ${cityData.name}, ${stateData.code}`,
        description: cityData.uniqueContent.intro,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aeroelite.com' },
                { '@type': 'ListItem', position: 2, name: 'United States', item: 'https://aeroelite.com/us' },
                { '@type': 'ListItem', position: 3, name: stateData.name, item: `https://aeroelite.com/us/${state}` },
                { '@type': 'ListItem', position: 4, name: cityData.name, item: `https://aeroelite.com/us/${state}/${city}` },
            ],
        },
        mainEntity: {
            '@type': 'Service',
            serviceType: 'Private Jet Charter',
            provider: { '@type': 'Organization', name: 'AeroElite' },
            areaServed: {
                '@type': 'City',
                name: cityData.name,
                address: { '@type': 'PostalAddress', addressRegion: stateData.code, addressCountry: 'US' },
            },
        },
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: cityData.uniqueContent.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <div className="min-h-screen bg-white">
                {/* Breadcrumbs */}
                <nav className="bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li><Link href="/us" className="text-gray-500 hover:text-gray-700">United States</Link></li>
                            <li className="text-gray-400">/</li>
                            <li><Link href={`/us/${state}`} className="text-gray-500 hover:text-gray-700">{stateData.name}</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-yellow-600 font-medium">{cityData.name}</li>
                        </ol>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Private Jet Charter {cityData.name}, {stateData.code}
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-3xl">
                            {cityData.uniqueContent.intro}
                        </p>

                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-yellow-400" />
                                <span>{cityData.airports.length} Airports</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Plane className="w-5 h-5 text-yellow-400" />
                                <span>{cityData.nearbyDestinations.length}+ Routes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-yellow-400" />
                                <span>24/7 Availability</span>
                            </div>
                        </div>

                        <button className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors">
                            Get Instant Quote
                        </button>
                    </div>
                </div>

                {/* Main Content: Two Column Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Expandable Content */}
                        <div className="lg:w-2/3">
                            {/* Why Choose */}
                            <ExpandableContent title={`Why Choose Private Jet Charter in ${cityData.name}?`} defaultExpanded={true}>
                                <ul className="space-y-2 mb-4">
                                    {cityData.uniqueContent.whyChoose.map((reason, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-yellow-500 mr-2 mt-0.5">✓</span>
                                            <span>{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-gray-600">
                                    Whether you&apos;re traveling for business meetings in {cityData.name}&apos;s {cityData.businessType} district or leisure activities in the surrounding area, private aviation provides the flexibility and comfort that discerning travelers demand.
                                </p>
                            </ExpandableContent>

                            {/* Airport Information */}
                            <ExpandableContent title={`${cityData.name} Airport Information for Private Jets`}>
                                <p className="mb-4">{cityData.uniqueContent.airportInfo}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    {cityData.airports.map((airport) => (
                                        <div key={airport.code} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Plane className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-sm">{airport.name} ({airport.code})</h4>
                                                <p className="text-xs text-gray-500">Full FBO services available including fueling, hangar space, and luxury passenger amenities.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm text-gray-600">
                                    Each FBO at {cityData.airports[0]?.name || 'the airport'} offers private lounges, conference facilities, catering services, and direct tarmac access for seamless boarding. Ground transportation can be arranged directly through your FBO concierge.
                                </p>
                            </ExpandableContent>

                            {/* Best Aircraft - with yellow-bordered cards */}
                            <ExpandableContent title={`Best Aircraft for ${cityData.name} Charter Flights`}>
                                <p className="mb-4">
                                    Selecting the right aircraft for your {cityData.name} private jet charter depends on your destination, passenger count, and luggage requirements. Here are our recommendations:
                                </p>
                                <div className="space-y-3">
                                    {aircraft.map((jet) => (
                                        <div key={jet.name} className="border-l-4 border-yellow-400 pl-4 py-2">
                                            <h4 className="font-semibold">{jet.name}</h4>
                                            <p className="text-sm text-gray-600">{jet.desc} from {cityData.name}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm text-gray-600">
                                    Our charter specialists can help you select the optimal aircraft based on your specific route from {cityData.name}, ensuring the perfect balance of comfort, speed, and cost.
                                </p>
                            </ExpandableContent>

                            {/* Popular Routes - Table format */}
                            <ExpandableContent title={`Popular Private Jet Routes from ${cityData.name}`}>
                                <p className="mb-4">
                                    Based on charter demand from {cityData.name}, these are the most frequently requested private jet routes with estimated flight times and starting prices:
                                </p>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-2 font-semibold text-gray-700">Destination</th>
                                            <th className="text-left py-2 font-semibold text-gray-700">Flight Time</th>
                                            <th className="text-left py-2 font-semibold text-gray-700">Starting Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cityData.nearbyDestinations.map((dest) => (
                                            <tr key={dest.city} className="border-b border-gray-100">
                                                <td className="py-3">{dest.city}</td>
                                                <td className="py-3">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        {dest.time}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className="flex items-center gap-1 text-yellow-600 font-medium">
                                                        <DollarSign className="w-4 h-4" />
                                                        {dest.price.replace('$', '')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p className="mt-4 text-xs text-gray-500 italic">
                                    * Prices are estimates for one-way flights on light jets. Final pricing depends on aircraft availability, scheduling, and specific requirements.
                                </p>
                            </ExpandableContent>

                            {/* Local Insights */}
                            <ExpandableContent title={`Local Insights for ${cityData.name} Private Aviation`}>
                                <p className="mb-4">{cityData.uniqueContent.localInsights}</p>
                                <p className="mb-4">
                                    The {cityData.name} area has seen significant growth in private aviation demand, particularly among business travelers who value the time savings and productivity benefits of flying private. With a population of {cityData.population}, the region supports a robust network of charter services and aircraft operators.
                                </p>
                                <p className="text-gray-600">
                                    Seasonal considerations for {cityData.name} private jet charter include peak travel periods during major local events, holidays, and summer vacation season. Booking in advance during these periods ensures the best aircraft selection and pricing.
                                </p>
                            </ExpandableContent>

                            {/* FAQs */}
                            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                                <div className="p-5 border-b border-gray-200 bg-gray-50">
                                    <h2 className="text-lg font-bold">{cityData.name} Private Jet Charter FAQs</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {cityData.uniqueContent.faqs.map((faq, index) => (
                                        <ExpandableContent key={index} title={faq.question}>
                                            <p>{faq.answer}</p>
                                        </ExpandableContent>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside className="lg:w-1/3">
                            <div className="sticky top-20 space-y-6">
                                {/* Airports Card */}
                                <div className="border border-gray-200 rounded-xl p-5">
                                    <h3 className="text-lg font-bold mb-3">{cityData.name} Area Airports</h3>
                                    <ul className="space-y-2">
                                        {cityData.airports.map((airport) => (
                                            <li key={airport.code} className="flex items-center gap-2">
                                                <Plane className="w-4 h-4 text-yellow-400" />
                                                <span className="text-sm">{airport.name} ({airport.code})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Popular Routes Card */}
                                <div className="border border-gray-200 rounded-xl p-5">
                                    <h3 className="text-lg font-bold mb-3">Popular Routes from {cityData.name}</h3>
                                    <ul className="space-y-3">
                                        {cityData.nearbyDestinations.map((dest) => (
                                            <li key={dest.city} className="flex items-center justify-between">
                                                <span className="text-sm">{dest.city}</span>
                                                <span className="text-sm font-semibold text-yellow-600">From {dest.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Available Aircraft Card */}
                                <div className="border border-gray-200 rounded-xl p-5">
                                    <h3 className="text-lg font-bold mb-3">Available Aircraft</h3>
                                    <ul className="space-y-2">
                                        {aircraft.map((jet) => (
                                            <li key={jet.name} className="text-sm text-gray-700">{jet.name}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA */}
                                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-5 py-3 rounded-lg transition-colors text-sm">
                                    Get {cityData.name} Quote
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
