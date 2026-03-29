import Link from 'next/link';
import { europeData } from '../../data/europe-cities';

const countries = Object.values(europeData);

export default function EuropeHub() {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-6">Private Jet Charter Europe</h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
                        Premium air charter services across 7 major European nations. Access thousands of airports from London to Lisbon, Berlin to Barcelona.
                    </p>
                </div>
            </div>

            {/* Countries Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Explore Destinations by Country</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {countries.map((country) => (
                        <Link
                            key={country.slug}
                            href={`/europe/${country.slug}`}
                            className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {country.name}
                                    </h3>
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                                        {country.code}
                                    </span>
                                </div>

                                <p className="text-slate-600 mb-6">
                                    {country.cities.length}+ destinations including {country.cities.slice(0, 3).join(', ')}.
                                </p>

                                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                    View Cities
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Trust Section */}
            <div className="bg-white py-16 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Why Charter in Europe?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Cross-Border Ease</h3>
                            <p className="text-slate-600">Seamless travel between UK, EU, and Schengen zones with expert handling of customs protocols.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Time Savings</h3>
                            <p className="text-slate-600">Access thousands of smaller airports closer to your destination, saving hours of ground travel.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Local Currencies</h3>
                            <p className="text-slate-600">Transparent pricing in EUR, GBP, or CHF depending on your departure point.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
