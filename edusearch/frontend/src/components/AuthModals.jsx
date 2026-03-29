import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

export const AuthModals = () => {
    const { isLoginModalOpen, isSignupModalOpen, closeModals, login, register, openLogin, openSignup } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isLoginModalOpen && !isSignupModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLoginModalOpen) {
                await login(email, password);
            } else {
                await register(email, password, firstName, lastName);
            }
            // Reset form
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#1a1a1a]">
                            {isLoginModalOpen ? "Welcome back" : "Create an account"}
                        </h2>
                        <button onClick={closeModals} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignupModalOpen && (
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e68a] focus:border-transparent outline-none"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e68a] focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e68a] focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00e68a] focus:border-transparent outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1a1a1a] text-white font-bold py-3 rounded-xl hover:bg-black transition-colors md:text-lg block mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Please wait..." : (isLoginModalOpen ? "Log In" : "Sign Up")}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        {isLoginModalOpen ? (
                            <p>Don't have an account? <button onClick={openSignup} className="text-[#00e68a] font-bold hover:underline">Sign up</button></p>
                        ) : (
                            <p>Already have an account? <button onClick={openLogin} className="text-[#00e68a] font-bold hover:underline">Log in</button></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
