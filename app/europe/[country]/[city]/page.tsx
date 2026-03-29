import Link from 'next/link';
import { notFound } from 'next/navigation';
import { europeData, getAllEuropeCities } from '../../../../data/europe-cities';

// Helper to sanitize slugs
const normalizeSlug = (slug: string) => slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

interface PageProps {
    params: Promise<{ country: string; city: string }>;
}

export async function generateStaticParams() {
    const cities = getAllEuropeCities();
    return cities.map((city) => ({
        country: normalizeSlug(city.country),
        city: city.slug,
    }));
}

export default async function CityPage({ params }: PageProps) {
    const { country: countrySlug, city: citySlug } = await params;

    // Find country data first
    const countryData = europeData[normalizeSlug(countrySlug)];
    if (!countryData) notFound();

    // Find city within country
    const city = countryData.cities.find(c => c.slug === citySlug);
    if (!city) notFound();

    // Format currency symbol
    const currencySymbol = city.currency === 'GBP' ? '£' : city.currency === 'CHF' ? 'Fr' : '€';

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300 mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        Private Jet Charter {city.code}
                    </div>
                    <h1 className="text-5xl font-bold mb-6">Private Jet Charter {city.name}, {city.country}</h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
                        {city.uniqueContent.intro.split('.')[0]}. Instant quotes and premium aircraft.
                    </p>
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25">
                        Get Instant Quote
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Intro */}
                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Executive Travel to {city.name}</h2>
                            <div className="prose prose-slate max-w-none text-slate-600">
                                <p className="text-lg leading-relaxed mb-6">{city.uniqueContent.intro}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <h3 className="font-semibold text-slate-900 mb-2">Business & Economy</h3>
                                        <p className="text-sm">{city.name} is a hub for {city.businessType}, attracting executive travelers worldwide.</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <h3 className="font-semibold text-slate-900 mb-2">Local Insights</h3>
                                        <p className="text-sm">{city.uniqueContent.localInsights}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Why Choose */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Charter to {city.name}?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {city.uniqueContent.whyChoose.map((reason, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-700 font-medium">{reason}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Aircraft Rcommendations */}
                        <section className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 -mr-32 -mt-32"></div>
                            <h2 className="text-2xl font-bold mb-6 relative">Recommended Aircraft for {city.name}</h2>
                            <p className="text-slate-300 mb-8 relative text-lg leading-relaxed">
                                {city.uniqueContent.bestAircraft}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
                                {['Light Jet', 'Midsize Jet', 'Heavy Jet'].map((type) => (
                                    <div key={type} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Class</div>
                                        <div className="font-bold text-lg">{type}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQs */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {city.uniqueContent.faqs.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                                        <p className="text-slate-600">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        {/* Airports Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Nearby Airports
                            </h3>
                            <div className="space-y-4">
                                {city.airports.map((airport) => (
                                    <div key={airport.code} className="block group">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-slate-900">{airport.code}</span>
                                            <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                {airport.distance}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-500 truncate" title={airport.name}>{airport.name}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-xs text-slate-500 italic">
                                    Distance measured from city center.
                                </p>
                            </div>
                        </div>

                        {/* Popular Routes */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                Popular Routes
                            </h3>
                            <div className="space-y-4">
                                {city.nearbyDestinations.map((dest) => (
                                    <div key={dest.city} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div>
                                            <div className="font-medium text-slate-900">{dest.city}, {dest.country}</div>
                                            <div className="text-xs text-slate-500">{dest.time} flight</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600 text-sm">~{dest.price}</div>
                                            <div className="text-[10px] text-slate-400">est. one-way</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
