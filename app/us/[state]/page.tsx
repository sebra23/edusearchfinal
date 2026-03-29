import type { Metadata } from 'next';
import Link from 'next/link';
import { usStates, getCitiesByState } from '@/data/us-cities';
import { notFound } from 'next/navigation';
import { MapPin, Plane, Users, Building2 } from 'lucide-react';
import ExpandableContent from '@/components/ExpandableContent';

interface StatePageProps {
    params: Promise<{
        state: string;
    }>;
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
    const { state } = await params;
    const stateData = usStates[state];

    if (!stateData) {
        return { title: 'State Not Found' };
    }

    const cities = stateData.cities;
    const totalAirports = cities.reduce((acc, city) => acc + city.airports.length, 0);
    const totalPopulation = cities.reduce((acc, city) => acc + parseInt(city.population.replace(/,/g, ''), 10), 0);

    return {
        title: `Private Jet Charter ${stateData.name} | ${cities.length}+ Cities & Airports`,
        description: `Premium private jet charter services across ${stateData.name}. Access ${totalAirports} airports serving ${cities.length} cities with a combined population of ${totalPopulation.toLocaleString()}. Instant quotes, 24/7 concierge service.`,
        keywords: [
            `private jet ${stateData.name}`,
            `${stateData.name} private jet charter`,
            `private aviation ${stateData.name}`,
            `charter flight ${stateData.name}`,
            ...cities.slice(0, 5).map(c => `private jet ${c.name}`),
        ],
    };
}

export async function generateStaticParams() {
    return Object.keys(usStates).map(stateSlug => ({
        state: stateSlug,
    }));
}

export default async function StatePage({ params }: StatePageProps) {
    const { state } = await params;
    const stateData = usStates[state];

    if (!stateData) {
        notFound();
    }

    const cities = getCitiesByState(state);
    const totalAirports = cities.reduce((acc, city) => acc + city.airports.length, 0);
    const totalPopulation = cities.reduce(
        (acc, city) => acc + parseInt(city.population.replace(/,/g, ''), 10),
        0
    );
    const allAirportsRaw = cities.flatMap(city => city.airports);
    const seen = new Set<string>();
    const allAirports = allAirportsRaw.filter(a => {
        if (seen.has(a.code)) return false;
        seen.add(a.code);
        return true;
    });

    // Schema.org markup
    const schemaMarkup = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `Private Jet Charter ${stateData.name}`,
        description: `Premium private jet charter services across ${stateData.name}.`,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aeroelite.com' },
                { '@type': 'ListItem', position: 2, name: 'United States', item: 'https://aeroelite.com/us' },
                { '@type': 'ListItem', position: 3, name: stateData.name, item: `https://aeroelite.com/us/${state}` },
            ],
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />

            <div className="min-h-screen bg-white">
                {/* Breadcrumbs */}
                <nav className="bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <Link href="/us" className="text-gray-500 hover:text-gray-700">United States</Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-yellow-600 font-medium">{stateData.name}</li>
                        </ol>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Private Jet Charter {stateData.name}
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-3xl">
                            Premium private jet charter services across {stateData.name}. Access {totalAirports} airports serving {cities.length} cities with a combined population of {totalPopulation.toLocaleString()}. Instant quotes, 24/7 concierge service.
                        </p>

                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-yellow-400" />
                                <span>{cities.length} Cities</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Plane className="w-5 h-5 text-yellow-400" />
                                <span>{totalAirports} Airports</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-yellow-400" />
                                <span>{totalPopulation.toLocaleString()} Population</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Two Column Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Expandable Content */}
                        <div className="lg:w-2/3">
                            {/* Why Charter */}
                            <ExpandableContent
                                title={`Why Charter a Private Jet in ${stateData.name}?`}
                                defaultExpanded={true}
                            >
                                <p className="mb-4">
                                    {stateData.name} offers excellent private aviation infrastructure with airports strategically located to serve both business and leisure travelers. From {cities[0]?.name} to {cities[Math.min(cities.length - 1, 4)]?.name}, private jet charter provides unmatched convenience and flexibility.
                                </p>
                                <p className="mb-4">
                                    Whether you&apos;re traveling for business meetings, attending events, or enjoying leisure time, private aviation eliminates the hassles of commercial air travel. Skip long security lines, avoid crowded terminals, and enjoy personalized service from departure to arrival.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-yellow-500 mr-2 mt-0.5">✓</span>
                                        <span>Access to regional and international airports throughout {stateData.name}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-yellow-500 mr-2 mt-0.5">✓</span>
                                        <span>Flexible scheduling that adapts to your itinerary</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-yellow-500 mr-2 mt-0.5">✓</span>
                                        <span>Premium FBO facilities with luxury amenities</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-yellow-500 mr-2 mt-0.5">✓</span>
                                        <span>24/7 concierge and ground transportation services</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-yellow-500 mr-2 mt-0.5">✓</span>
                                        <span>Competitive pricing with transparent quotes</span>
                                    </li>
                                </ul>
                            </ExpandableContent>

                            {/* Airports */}
                            <ExpandableContent title={`${stateData.name} Private Jet Airports`}>
                                <p className="mb-4">
                                    {stateData.name} is served by {totalAirports} airports with dedicated FBO facilities for private aviation. These airports offer comprehensive services including aircraft fueling, hangar space, maintenance, and luxury passenger amenities.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    {allAirports.map((airport) => (
                                        <div
                                            key={airport.code}
                                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <Plane className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                            <span className="text-sm">
                                                {airport.name} ({airport.code})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </ExpandableContent>

                            {/* Popular Routes */}
                            <ExpandableContent title={`Popular Private Jet Routes from ${stateData.name}`}>
                                <p className="mb-4">
                                    Based on charter demand from {stateData.name}, these are the most frequently requested private jet routes:
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        { dest: 'New York', desc: 'Business and finance travel' },
                                        { dest: 'Los Angeles', desc: 'Cross-country routes' },
                                        { dest: 'Miami', desc: 'Leisure and vacation travel' },
                                        { dest: 'Chicago', desc: 'Regional business routes' },
                                    ].map((route) => (
                                        <li key={route.dest} className="flex items-start">
                                            <span className="text-yellow-500 mr-2">→</span>
                                            <span className="text-sm">
                                                {stateData.name} to {route.dest} - {route.desc}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </ExpandableContent>
                        </div>

                        {/* Right Sidebar - Cities List */}
                        <aside className="lg:w-1/3">
                            <div className="sticky top-20 border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-white p-6">
                                    <h2 className="text-xl font-bold mb-4">Cities in {stateData.name}</h2>
                                    <ul className="space-y-1">
                                        {cities.map((city) => (
                                            <li key={city.slug}>
                                                <Link
                                                    href={`/us/${state}/${city.slug}`}
                                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors group"
                                                >
                                                    <MapPin className="w-4 h-4 text-yellow-400 group-hover:text-yellow-600" />
                                                    <span className="text-sm font-medium">{city.name}</span>
                                                    <span className="ml-auto text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-5 py-3 rounded-lg transition-colors text-sm">
                                        Get Statewide Quote
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* City Cards Grid */}
                <div className="bg-gray-50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold mb-8">
                            Private Jet Charter by City in {stateData.name}
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cities.map((city) => (
                                <Link
                                    key={city.slug}
                                    href={`/us/${state}/${city.slug}`}
                                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-yellow-400 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-yellow-400" />
                                        <h3 className="text-lg font-semibold group-hover:text-yellow-600 transition-colors">
                                            {city.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">Pop: {city.population}</p>
                                    <p className="text-sm text-gray-500">
                                        {city.airports.map(a => `${a.name} (${a.code})`).join(', ')}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
