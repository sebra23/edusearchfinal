import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { MapPin, Heart, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export default function ProfilePage() {
    const { user, token, savedSchools, unsaveSchool } = useAuth();
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchSchools = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/me/saved-schools`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setSchools(response.data);
            } catch (error) {
                console.error("Error fetching saved schools", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchools();
    }, [token, savedSchools.length]);

    if (!token && !loading) {
        return <Navigate to="/" replace />;
    }

    const formatCurrency = (val) => val ? `$${val.toLocaleString()}` : 'N/A';
    const formatPercent = (val) => {
        if (val == null) return 'N/A';
        return val <= 1 ? `${Math.round(val * 100)}%` : `${Math.round(val)}%`;
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] mb-2 tracking-tight">
                        Hi, {user?.first_name || 'Student'} 👋
                    </h1>
                    <p className="text-gray-500 text-lg">Manage your saved colleges and track your applications.</p>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex border-b border-gray-200 mb-8">
                    <button className="py-4 px-6 text-indigo-600 font-bold border-b-2 border-indigo-600">
                        Saved Schools
                    </button>
                    <button className="py-4 px-6 text-gray-500 font-medium hover:text-gray-800 transition">
                        Account Settings
                    </button>
                </div>

                {/* Saved Schools Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : schools.length === 0 ? (
                    <div className="bg-white rounded-[24px] p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 fill-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">No saved schools yet</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">Start browsing and click the heart icon to save colleges you're interested in applying to.</p>
                        <Link to="/search" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
                            Explore Colleges
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schools.map((school, index) => {
                            const imgIndex = (school.id % 2) === 0 ? '1_1771716197987' : '2_1771716213622';

                            return (
                                <div key={school.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group flex flex-col h-full">
                                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-gray-200">
                                        <img src={`/images/college_campus_${imgIndex}.png`} alt={school.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                unsaveSchool(school.id);
                                            }}
                                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 active:scale-95 transition-transform z-10"
                                            title="Remove from saved"
                                        >
                                            <Heart className="w-5 h-5 fill-red-500 text-red-500 stroke-red-500" />
                                        </button>
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1a1a1a]">
                                            ⭐ {school.rating_overall?.toFixed(1) || '4.5'}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium mb-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{school.city}, {school.state}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                                            <Link to={`/school/${school.slug}`} className="before:absolute before:inset-0">
                                                {school.name}
                                            </Link>
                                        </h3>

                                        <div className="mt-auto space-y-3">
                                            <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                                                <span className="text-gray-500">Acceptance Rate</span>
                                                <span className="font-bold text-[#1a1a1a]">{formatPercent(school.admission_rate)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Net Price</span>
                                                <span className="font-bold text-[#1a1a1a]">{formatCurrency(school.net_price_public || school.tuition_in_state)}/yr</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
