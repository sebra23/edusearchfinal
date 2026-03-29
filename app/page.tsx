import Link from 'next/link';
import { Plane, MapPin, Clock, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-6">
              <span className="text-yellow-400 text-sm font-medium">
                ✈ GLOBAL PRIVATE AVIATION NETWORK
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Global Private Jet
              <br />
              <span className="text-yellow-400">Charter Directory</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Discover 10,000+ routes across Asia, Europe & US. Instant quotes, premium aircraft, and seamless travel experiences tailored to discerning travelers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/us"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 rounded-lg transition-colors text-lg inline-flex items-center justify-center"
              >
                Explore US Cities →
              </Link>
              <button className="border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg">
                Get Instant Quote
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">50</div>
              <div className="text-sm text-gray-300">US States</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">260+</div>
              <div className="text-sm text-gray-300">US Cities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">10K+</div>
              <div className="text-sm text-gray-300">Routes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-sm text-gray-300">Availability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Hubs */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore by Region</h2>
            <p className="text-xl text-gray-600">Premium private aviation services across three continents</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Asia */}
            <Link
              href="#asia"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-red-600 to-orange-600"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">Asia</h3>
                <p className="text-gray-200 mb-4">Singapore, Hong Kong, Tokyo, Dubai & more</p>
                <div className="flex items-center text-yellow-400 font-medium">
                  <span>Explore Asia</span>
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* Europe */}
            <Link
              href="#europe"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-indigo-600"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">Europe</h3>
                <p className="text-gray-200 mb-4">Paris, Geneva, London, Monaco & more</p>
                <div className="flex items-center text-yellow-400 font-medium">
                  <span>Explore Europe</span>
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>

            {/* United States */}
            <Link
              href="/us"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-700 to-slate-900"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">United States</h3>
                <p className="text-gray-200 mb-4">New York, Los Angeles, Miami, Las Vegas & more</p>
                <div className="flex items-center text-yellow-400 font-medium">
                  <span>Explore US</span>
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose AeroElite</h2>
            <p className="text-xl text-gray-600">Premium private aviation made simple</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Plane className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
              <p className="text-gray-600">Access to the finest aircraft from light jets to ultra-long-range</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Quotes</h3>
              <p className="text-gray-600">Get competitive pricing in minutes, not hours</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Network</h3>
              <p className="text-gray-600">10,000+ routes across Asia, Europe, and the United States</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safety First</h3>
              <p className="text-gray-600">All operators meet the highest safety and certification standards</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Fly?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get an instant quote for your next private jet charter. Available 24/7 worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-4 rounded-lg transition-colors text-lg">
              Get Instant Quote
            </button>
            <a
              href="tel:+18005555538"
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
            >
              Call +1-800-555-JET
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
