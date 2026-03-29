import type { Metadata } from 'next';
import Link from 'next/link';
import { usStates, getAllCities } from '@/data/us-cities';
import { MapPin, Globe, Plane } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Private Jet Charter United States | 50 States, 1000+ Cities',
    description: 'Discover private jet charter services across all 50 US states. Access 1000+ cities, instant quotes, and premium aircraft. 24/7 availability nationwide.',
    keywords: ['private jet USA', 'US private jet charter', 'private aviation United States'],
};

export default function USHubPage() {
    const allCities = getAllCities();
    const totalAirports = allCities.reduce((acc, city) => acc + city.airports.length, 0);
    const states = Object.values(usStates);

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs */}
            <nav className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900 font-medium">United States</li>
                    </ol>
                </div>
            </nav>

            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Private Jet Charter Across America
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl">
                        Access premium private aviation services in all 50 states. From coast to coast, discover instant quotes, 24/7 availability, and the finest aircraft for your journey.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <MapPin className="w-8 h-8 mb-3 text-yellow-400" />
                            <div className="text-3xl font-bold">{states.length}</div>
                            <div className="text-sm text-gray-300">US States</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <Globe className="w-8 h-8 mb-3 text-yellow-400" />
                            <div className="text-3xl font-bold">{allCities.length}+</div>
                            <div className="text-sm text-gray-300">Cities</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <Plane className="w-8 h-8 mb-3 text-yellow-400" />
                            <div className="text-3xl font-bold">{totalAirports}+</div>
                            <div className="text-sm text-gray-300">Airports</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <div className="text-3xl font-bold mb-3">24/7</div>
                            <div className="text-sm text-gray-300">Availability</div>
                        </div>
                    </div>

                    <button className="mt-10 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 rounded-lg transition-colors text-lg">
                        Get Instant Quote
                    </button>
                </div>
            </div>

            {/* States Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-4xl font-bold mb-12">Explore Private Jet Services by State</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {states.map((state) => (
                        <Link
                            key={state.code}
                            href={`/us/${state.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="group border border-gray-200 rounded-lg p-5 hover:border-yellow-500 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold group-hover:text-yellow-600 transition-colors">
                                    {state.name}
                                </h3>
                                <span className="text-sm text-gray-500 font-mono">{state.code}</span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    <span>{state.cities.length} cities</span>
                                </div>
                                <div className="flex items-center">
                                    <Plane className="w-4 h-4 mr-2 text-gray-400" />
                                    <span>{state.cities.reduce((acc, city) => acc + city.airports.length, 0)} airports</span>
                                </div>
                            </div>

                            <div className="mt-4 text-yellow-600 font-medium text-sm group-hover:underline">
                                View Cities →
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Popular Cities */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-8">Popular US Cities for Private Jet Charter</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {allCities.slice(0, 8).map((city) => {
                            const stateSlug = Object.keys(usStates).find(key =>
                                usStates[key].cities.some(c => c.slug === city.slug)
                            );
                            const state = stateSlug ? usStates[stateSlug] : null;

                            return state ? (
                                <Link
                                    key={city.slug}
                                    href={`/us/${stateSlug}/${city.slug}`}
                                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-yellow-500 hover:shadow-lg transition-all"
                                >
                                    <h3 className="font-semibold text-lg mb-1">{city.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{state.name}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {city.airports.slice(0, 2).map((airport) => (
                                            <span key={airport.code} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {airport.code}
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            ) : null;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
