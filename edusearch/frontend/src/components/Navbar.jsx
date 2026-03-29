import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ transparent }) {
    const { user, openLogin, openSignup, logout } = useAuth();
    // Dynamic classes based on transparent state
    const bgClass = transparent ? 'bg-transparent border-none' : 'bg-white border-b border-gray-200';
    const textClass = transparent ? 'text-white' : 'text-gray-700';
    const logoClass = transparent ? 'text-white' : 'text-[#1a4331]';
    const linkHoverClass = transparent ? 'hover:text-gray-200' : 'hover:text-green-700';
    const btnClass = transparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-gray-100';
    const loginBtnClass = transparent ? 'text-white border-white hover:bg-white/10' : 'text-gray-700 border-gray-300 hover:bg-gray-50';

    return (
        <nav className={`flex items-center justify-between px-6 py-4 sticky top-0 z-[100] transition-colors duration-300 ${bgClass}`}>
            <div className="flex items-center gap-8">
                <Link to="/" className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${logoClass}`}>
                    PRIVATE SCHOOL <span className="font-light">TOURS</span>
                </Link>
                <div className={`hidden md:flex items-center gap-6 text-sm font-semibold ${textClass}`}>
                    <Link to="/search" className={`transition-colors ${linkHoverClass}`}>Find a Tour</Link>
                    <Link to="/search" className={`transition-colors ${linkHoverClass}`}>Virtual Experiences</Link>
                    <Link to="/search" className={`transition-colors ${linkHoverClass}`}>For Schools</Link>
                    <button className={`transition-colors ${transparent ? 'text-white hover:text-gray-200' : 'text-gray-500 hover:text-black'}`}>
                        <span className="font-bold tracking-widest leading-none">...</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className={`p-2 rounded-full transition-colors ${btnClass}`}>
                    <Search className="w-5 h-5" />
                </button>
                <div className={`h-6 w-px mx-2 hidden sm:block ${transparent ? 'bg-white/30' : 'bg-gray-300'}`}></div>
                <div className="hidden sm:flex items-center gap-3">
                    {user ? (
                        <>
                            <Link to="/profile" className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 border rounded-full transition-colors ${loginBtnClass}`}>
                                Hi, {user.first_name}
                            </Link>
                            <button onClick={logout} className={`px-4 py-2 text-sm font-bold border rounded-full transition-colors ${loginBtnClass}`}>
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={openLogin} className={`px-4 py-2 text-sm font-bold border rounded-full transition-colors ${loginBtnClass}`}>
                                Log In
                            </button>
                            <button onClick={openSignup} className="px-4 py-2 text-sm font-bold text-white bg-[#0f442d] rounded-full hover:bg-[#0a3120] transition-colors shadow-sm">
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
