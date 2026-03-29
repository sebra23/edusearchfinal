import Link from 'next/link';
import { notFound } from 'next/navigation';
import { europeData } from '../../../data/europe-cities';

// Helper to sanitize slugs
const normalizeSlug = (slug: string) => slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

interface PageProps {
    params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
    return Object.values(europeData).map((country) => ({
        country: country.slug,
    }));
}

export default async function CountryPage({ params }: PageProps) {
    const { country: countrySlug } = await params;
    const country = europeData[normalizeSlug(countrySlug)];

    if (!country) {
        notFound();
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542296332-2e44a996aaad?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300 mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        Private Jet Charter {country.name}
                    </div>
                    <h1 className="text-5xl font-bold mb-6">Private Jet Charter to {country.name}</h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
                        Experience premium air travel across {country.name}. Access {country.cities.length} top destinations including {country.cities.slice(0, 3).map(c => c.name).join(', ')}.
                    </p>
                </div>
            </div>

            {/* Cities Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold text-slate-900">Popular Destinations in {country.name}</h2>
                    <Link href="/europe" className="text-slate-600 hover:text-blue-600 font-medium">
                        ← Back to Europe
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {country.cities.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/europe/${country.slug}/${city.slug}`}
                            className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {city.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {city.regionType === 'coastal' && <span title="Coastal Destination">🌊</span>}
                                        {city.regionType === 'mountain' && <span title="Mountain Destination">🏔️</span>}
                                    </div>
                                </div>

                                <p className="text-slate-600 mb-6 line-clamp-3">
                                    {city.uniqueContent.intro.split('.')[0]}.
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-slate-500">
                                        <span className="w-24 font-medium text-slate-700">Top Airport:</span>
                                        {city.airports[0]?.code || 'N/A'}
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500">
                                        <span className="w-24 font-medium text-slate-700">Best For:</span>
                                        <span className="capitalize">{city.businessType}</span>
                                    </div>
                                </div>

                                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform pt-4 border-t border-slate-50">
                                    View Charter Options
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
