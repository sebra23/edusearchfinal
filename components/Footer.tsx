import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 32 32" fill="currentColor">
                                <path d="M16 2L4 14h8v16h8V14h8L16 2z" transform="rotate(-45 16 16)" />
                            </svg>
                            <span className="text-xl font-bold text-white">
                                Aero<span className="text-yellow-400">Elite</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 mb-6 max-w-xs">
                            Global private jet charter directory connecting discerning travelers with premium aircraft across Asia, Europe, and the United States.
                        </p>
                        <div className="space-y-2 text-sm">
                            <a href="tel:+18005555538" className="flex items-center hover:text-white transition-colors">
                                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                +1-800-555-JET
                            </a>
                            <a href="mailto:charter@aeroelite.com" className="flex items-center hover:text-white transition-colors">
                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                charter@aeroelite.com
                            </a>
                            <div className="flex items-start">
                                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                                <span>350 Fifth Avenue, Suite 4500<br />New York, NY 10118</span>
                            </div>
                        </div>
                    </div>

                    {/* Regions */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Regions</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/asia" className="hover:text-white transition-colors">Asia</Link></li>
                            <li><Link href="/europe" className="hover:text-white transition-colors">Europe</Link></li>
                            <li><Link href="/us" className="hover:text-white transition-colors">United States</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/routes" className="hover:text-white transition-colors">Popular Routes</Link></li>
                            <li><Link href="/airports" className="hover:text-white transition-colors">Airport Directory</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Aircraft Guide</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Empty Legs</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Safety</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} AeroElite. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        {/* Social links */}
                        {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                            <a
                                key={social}
                                href={`https://${social}.com`}
                                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                                aria-label={social}
                            >
                                <span className="text-xs text-gray-400">
                                    {social[0].toUpperCase()}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
