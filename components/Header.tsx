'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-slate-900 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 32 32" fill="currentColor">
                            <path d="M16 2L4 14h8v16h8V14h8L16 2z" transform="rotate(-45 16 16)" />
                        </svg>
                        <span className="text-xl font-bold">
                            Aero<span className="text-yellow-400">Elite</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/asia" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Asia
                        </Link>
                        <Link href="/europe" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Europe
                        </Link>
                        <Link href="/us" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            United States
                        </Link>
                        <Link href="/routes" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Routes
                        </Link>
                        <Link href="/airports" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Airports
                        </Link>
                    </nav>

                    {/* Phone + CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <a href="tel:+18005555538" className="flex items-center text-gray-300 hover:text-white text-sm">
                            <Phone className="w-4 h-4 mr-2" />
                            +1-800-555-JET
                        </a>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-5 py-2 rounded-lg transition-colors text-sm">
                            Get Quote
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-gray-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-800 border-t border-slate-700">
                    <div className="px-4 py-4 space-y-3">
                        <Link href="/asia" className="block text-gray-300 hover:text-white text-sm py-2">Asia</Link>
                        <Link href="/europe" className="block text-gray-300 hover:text-white text-sm py-2">Europe</Link>
                        <Link href="/us" className="block text-gray-300 hover:text-white text-sm py-2">United States</Link>
                        <Link href="/routes" className="block text-gray-300 hover:text-white text-sm py-2">Routes</Link>
                        <Link href="/airports" className="block text-gray-300 hover:text-white text-sm py-2">Airports</Link>
                        <hr className="border-slate-700" />
                        <a href="tel:+18005555538" className="flex items-center text-gray-300 text-sm py-2">
                            <Phone className="w-4 h-4 mr-2" />
                            +1-800-555-JET
                        </a>
                        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-5 py-2 rounded-lg transition-colors text-sm">
                            Get Quote
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
