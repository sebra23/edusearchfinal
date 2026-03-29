import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Heart, Plus, Search, HelpCircle, CheckCircle, ChevronDown, ChevronRight, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import BookingModal from '../components/BookingModal';

const API_URL = 'http://localhost:8000/api/v1';

export default function SchoolPage() {
    const { slug } = useParams();
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);
    const { compareList, addToCompare, removeFromCompare } = useSearch();
    const { user, token, openLogin, savedSchools, saveSchool, unsaveSchool } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [newReviewText, setNewReviewText] = useState("");
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [viewedInterests, setViewedInterests] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/institutions/${slug}`)
            .then(res => {
                setSchool(res.data);
                return axios.get(`${API_URL}/institutions/${res.data.id}/reviews`);
            })
            .then(res => {
                const fetchedReviews = res.data || [];
                // Sort to put native user reviews first (no source), then Reddit, then Google
                fetchedReviews.sort((a, b) => {
                    const sourcePriority = { "EduSearch": 0, "Google": 1, "Reddit": 2 };
                    return (sourcePriority[a.source] || 0) - (sourcePriority[b.source] || 0);
                });
                setReviews(fetchedReviews);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    const handleCreateReview = async (e) => {
        e.preventDefault();
        if (!user) {
            openLogin();
            return;
        }

        setSubmittingReview(true);
        try {
            const response = await fetch(`${API_URL}/institutions/${school.id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rating_overall: newReviewRating,
                    body: newReviewText
                })
            });

            if (!response.ok) throw new Error("Failed to post review");
            const newRev = await response.json();
            setReviews(prev => [newRev, ...prev]);
            setReviewFormOpen(false);
            setNewReviewText("");
            setNewReviewRating(5);
        } catch (err) {
            console.error(err);
            alert("Error submitting review");
        } finally {
            setSubmittingReview(false);
        }
    };

    const scatterData = useMemo(() => {
        if (!school) return [];
        const baseSat = (school.sat_math_mid || 600) + (school.sat_reading_mid || 600);
        const baseGpa = school.admission_rate < 0.2 ? 3.9 : school.admission_rate < 0.5 ? 3.6 : 3.2;
        const pts = [];
        for (let i = 0; i < 150; i++) {
            const isAccepted = Math.random() < (school.admission_rate || 0.5);
            const isRejected = !isAccepted && Math.random() > 0.2;
            const status = isAccepted ? 'Accepted' : isRejected ? 'Rejected' : 'Considering';

            pts.push({
                id: i,
                sat: Math.min(1600, Math.max(800, baseSat + (Math.random() - 0.5) * 400)),
                gpa: Math.min(4.0, Math.max(2.0, baseGpa + (Math.random() - 0.5) * 1.0)),
                status
            });
        }
        return pts;
    }, [school]);

    if (loading) return <div className="min-h-screen bg-[#f9f9f9] p-12 text-center text-lg">Loading...</div>;
    if (!school) return <div className="min-h-screen bg-[#f9f9f9] p-12 text-center text-lg">School not found.</div>;

    const rank = (school.id % 50) + 1; // Fake rank for UI
    const totalReviews = (school.enrollment_total % 2000) + 150;
    const formatCurrency = (val) => val ? `$${val.toLocaleString()}` : 'N/A';
    const formatPercent = (val) => {
        if (val == null) return 'N/A';
        return val <= 1 ? `${Math.round(val * 100)}%` : `${Math.round(val)}%`;
    };
    const grade = school.rating_overall >= 4.5 ? 'A+' : (school.rating_overall >= 4.0 ? 'A' : 'A-');

    const sportEmojis = {
        "Baseball": "⚾",
        "Basketball": "🏀",
        "Cross Country": "🏃‍♂️",
        "Football": "🏈",
        "Soccer": "⚽",
        "Track & Field": "🏃‍♂️",
        "Swimming": "🏊‍♂️",
        "Tennis": "🎾",
        "Volleyball": "🏐",
        "Softball": "🥎"
    };

    const mensSportsList = school.sports_mens ? school.sports_mens.split(',') : [];
    const womensSportsList = school.sports_womens ? school.sports_womens.split(',') : [];

    const faqs = [
        school.ai_scorecard?.ai_summary_text ? {
            q: `What is the overall student experience and academic rigor like at ${school.name}?`,
            a: school.ai_scorecard.ai_summary_text,
            isAi: true
        } : null,
        school.admissions_rate ? {
            q: `How hard is it to get into ${school.name}?`,
            a: `${school.name} has an acceptance rate of ${formatPercent(school.admissions_rate)}, meaning out of 100 applicants, about ${Math.round(school.admissions_rate * 100)} are admitted. ${school.admissions_rate < 0.2 ? 'It is considered highly competitive.' : school.admissions_rate < 0.5 ? 'It is moderately competitive.' : 'It is an accessible school for most applicants.'}`
        } : null,
        (school.cost_net_price_public || school.cost_net_price_private) ? {
            q: `How much does ${school.name} cost after financial aid?`,
            a: `While the sticker price may be higher, the average net price (the cost after financial aid) for families is around ${formatCurrency(school.cost_net_price_public || school.cost_net_price_private)} per year.`
        } : null,
        school.enrollment_total ? {
            q: `What is the size of the student body at ${school.name}?`,
            a: `${school.name} has a total student enrollment of approximately ${school.enrollment_total.toLocaleString()} students, making it a ${school.enrollment_total > 15000 ? 'large' : school.enrollment_total > 5000 ? 'mid-sized' : 'small'} institution.`
        } : null,
        (school.city && school.state) ? {
            q: `Where is ${school.name} located?`,
            a: `The campus is located in ${school.city}, ${school.state}. It offers students a unique environment blending local culture with academic resources.`
        } : null
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-white font-sans pb-24 text-[#1a1a1a]">

            {/* Mobile Hero Banner (AllTrails Style) */}
            <div className="block md:hidden w-full h-[350px] relative">
                <img src="/images/school_hero_banner.png" alt="Campus Landscape" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Top Right Action Buttons */}
                <div className="absolute top-6 right-4 flex items-center gap-3">
                    <button
                        onClick={(e) => { e.preventDefault(); addToCompare(school); }}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1a1a1a] shadow-sm hover:bg-white transition"
                        title="Add to Compare"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (!user) openLogin();
                            else if (savedSchools.includes(school.id)) unsaveSchool(school.id);
                            else saveSchool(school.id);
                        }}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1a1a1a] shadow-sm hover:bg-white transition"
                    >
                        <Heart className={`w-5 h-5 transition-colors ${savedSchools.includes(school?.id) ? 'fill-red-500 text-red-500 stroke-red-500' : ''}`} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1a1a1a] shadow-sm hover:bg-white transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    </button>
                </div>

                {/* Bottom Left Play Button */}
                <div className="absolute bottom-12 left-4">
                    <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#1a1a1a] shadow-md hover:bg-gray-50 transition">
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                </div>
                {/* Mini map thumbnail */}
                <div className="absolute bottom-10 right-4 w-[72px] h-[72px] rounded-xl overflow-hidden border-[3px] border-white shadow-md">
                    <img src="/images/scatter_plot_mockup.png" alt="Map View" className="w-full h-full object-cover grayscale opacity-90" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:mt-8">
                {/* Main Header Info Area */}
                <div className="bg-white flex flex-col items-start gap-2 md:gap-4 z-10 mb-4 md:mb-6 relative rounded-t-[32px] md:rounded-none -mx-4 px-4 pt-6 md:mx-0 md:px-0 md:pt-0 -mt-6 md:-mt-0">
                    <h1 className="text-[34px] md:text-[54px] font-bold text-[#14231b] tracking-tight leading-[1.15]">{school.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 md:gap-y-3 text-[14px] md:text-[15px] font-medium text-[#1a1a1a]">
                        <span className="flex items-center">
                            <Star className="w-4 h-4 fill-[#1a1a1a] mr-1" />
                            4.9 <span className="ml-1 underline decoration-[#a6aba8] underline-offset-4 hover:decoration-[#1a1a1a] cursor-pointer">({totalReviews} reviews)</span>
                        </span>
                        <span className="text-[#a6aba8] px-0.5 md:px-1">·</span>
                        <span className="flex items-center gap-1 md:gap-1.5 underline decoration-[#a6aba8] underline-offset-4 hover:decoration-[#1a1a1a] cursor-pointer">
                            <div className="w-5 h-5 rounded-full bg-[#f4f4f4] border border-gray-200 flex items-center justify-center text-[9px] shadow-sm font-bold no-underline">{grade}</div>
                            Overall Grade
                        </span>
                        <span className="text-[#a6aba8] px-0.5 md:px-1">·</span>
                        <span className="underline decoration-[#a6aba8] underline-offset-4 hover:decoration-[#1a1a1a] cursor-pointer">
                            {school.city}, {school.state}
                        </span>
                    </div>
                </div>

                <div className="h-px bg-gray-200 mb-4 md:mb-6 -mx-4 md:mx-0"></div>

                {/* Sub Navigation Tabs and Action Buttons Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 md:mb-8 gap-4 md:gap-6">
                    <div className="flex gap-5 md:gap-6 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0">
                        <a href="#report-card" className="text-[#1a1a1a] text-base md:text-lg font-bold cursor-pointer whitespace-nowrap">Overview</a>
                        <a href="#about" className="text-gray-500 hover:text-[#1a1a1a] text-base md:text-lg font-medium cursor-pointer transition whitespace-nowrap">Academics</a>
                        <a href="#about" className="text-gray-500 hover:text-[#1a1a1a] text-base md:text-lg font-medium cursor-pointer transition whitespace-nowrap">Majors</a>
                        <a href="#cost" className="text-gray-500 hover:text-[#1a1a1a] text-base md:text-lg font-medium cursor-pointer transition whitespace-nowrap">Cost</a>
                        <a href="#admissions" className="text-gray-500 hover:text-[#1a1a1a] text-base md:text-lg font-medium cursor-pointer transition whitespace-nowrap">Admissions</a>
                        <a href="#reviews" className="text-gray-500 hover:text-[#1a1a1a] text-base md:text-lg font-medium cursor-pointer transition whitespace-nowrap">Reviews</a>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={(e) => { e.preventDefault(); addToCompare(school); }}
                            className="w-10 h-10 rounded-full bg-[#f4f4f4] flex items-center justify-center hover:bg-[#e8e8e8] transition text-[#1a1a1a]"
                            title="Add to Compare"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (!user) openLogin();
                                else if (savedSchools.includes(school.id)) unsaveSchool(school.id);
                                else saveSchool(school.id);
                            }}
                            className="w-10 h-10 rounded-full bg-[#f4f4f4] flex items-center justify-center hover:bg-[#e8e8e8] transition text-[#1a1a1a]">
                            <Heart className={`w-5 h-5 transition-colors ${savedSchools.includes(school?.id) ? 'fill-red-500 text-red-500 stroke-red-500' : ''}`} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-[#f4f4f4] flex items-center justify-center hover:bg-[#e8e8e8] transition text-[#1a1a1a]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Modern Pivot Hero Section: Video Reels & CTAs */}
                <div className="hidden md:grid grid-cols-12 gap-8 mb-12 min-h-[500px]">

                    {/* Left: Vertical Video Reel Mockup (TikTok Style) */}
                    <div className="col-span-4 rounded-[32px] overflow-hidden bg-gray-900 relative group cursor-pointer shadow-xl border border-gray-200/50">
                        <img src="/images/school_hero_banner.png" alt="Campus Reel" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80"></div>

                        {/* TikTok style overlays */}
                        <div className="absolute right-4 bottom-24 flex flex-col gap-5 items-center">
                            <div className="flex flex-col items-center gap-1 group/btn"><div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition"><Heart className="w-6 h-6" /></div><span className="text-white text-xs font-bold drop-shadow-md">1.2k</span></div>
                            <div className="flex flex-col items-center gap-1 group/btn"><div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition"><MessageCircle className="w-6 h-6" /></div><span className="text-white text-xs font-bold drop-shadow-md">48</span></div>
                        </div>

                        <div className="absolute bottom-8 left-8 right-20">
                            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg mb-3 inline-block shadow-sm">Campus Tour</span>
                            <h3 className="text-white font-extrabold text-xl leading-tight mb-2 drop-shadow-md">A minute in the robotics lab 🤖</h3>
                            <p className="text-white/90 text-sm line-clamp-2 font-medium drop-shadow">See what our STEM students are building this semester. The new 3D printers just arrived!</p>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white/30 transition shadow-2xl border border-white/30">
                                <svg className="w-10 h-10 ml-1 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Actions & Guides */}
                    <div className="col-span-8 flex flex-col justify-center space-y-10 pl-4 py-4">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-sm">
                                <span className="animate-pulse text-base">🔥</span> 12 parents are viewing this school right now
                            </div>
                            <h2 className="text-[44px] font-extrabold text-[#1a1a1a] tracking-tight leading-tight mb-3">
                                Experience {school.name}
                            </h2>
                            <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                                Step onto campus with an immersive virtual tour tailored to your interests, or book an in-person visit to see the magic for yourself.
                            </p>
                        </div>

                        <div className="flex gap-5">
                            <a href={school.booking_url || "#"} onClick={(e) => { e.preventDefault(); setIsBookingOpen(true); }} className="flex-1 bg-[#1a1a1a] text-white rounded-[24px] p-8 flex flex-col justify-between hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all group">
                                <div>
                                    <div className="text-white/60 text-xs font-bold tracking-widest uppercase mb-2">In-Person</div>
                                    <div className="text-[28px] font-extrabold tracking-tight leading-none mb-2">Book Physical Tour</div>
                                    <div className="text-white/80 font-medium">{school.spots_remaining ? `Only ${school.spots_remaining} spots left` : 'Check availability'}</div>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 mt-8 transition">
                                    <ChevronRight className="w-7 h-7 text-white" />
                                </div>
                            </a>

                            <a href={school.virtual_tour_url || "#"} onClick={(e) => { e.preventDefault(); setIsBookingOpen(true); }} className="flex-1 bg-white border-2 border-gray-200 text-[#1a1a1a] rounded-[24px] p-8 flex flex-col justify-between hover:border-[#1a1a1a] hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">

                                {/* Subtle map background hint */}
                                <div className="absolute right-0 bottom-0 w-48 h-48 opacity-5 grayscale pointer-events-none">
                                    <img src="/images/scatter_plot_mockup.png" className="w-full h-full object-cover" />
                                </div>

                                <div className="relative z-10">
                                    <div className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Interactive</div>
                                    <div className="text-[28px] font-extrabold tracking-tight leading-none mb-2">Take Virtual Tour</div>
                                    <div className="text-gray-500 font-medium">Explore campus from home</div>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-[#f4f4f4] flex items-center justify-center group-hover:bg-gray-200 mt-8 transition relative z-10">
                                    <ChevronRight className="w-7 h-7 text-[#1a1a1a]" />
                                </div>
                            </a>
                        </div>

                        <div className="pt-2">
                            <h3 className="text-sm font-bold tracking-widest text-[#1a1a1a] uppercase mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Choose Your Virtual Guide</h3>
                            <div className="flex gap-5">
                                <div
                                    className={`w-[120px] cursor-pointer group rounded-[20px] p-2 transition ${viewedInterests.includes('Theater & Arts') ? 'bg-blue-50 ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}
                                    onClick={() => setViewedInterests(prev => prev.includes('Theater & Arts') ? prev : [...prev, 'Theater & Arts'])}
                                >
                                    <div className="w-full aspect-square rounded-[16px] bg-gray-200 overflow-hidden relative mb-2 shadow-sm border border-gray-100">
                                        <div className="absolute inset-0 bg-blue-100 flex items-center justify-center text-4xl group-hover:scale-110 transition">🎭</div>
                                    </div>
                                    <div className="font-bold text-[#1a1a1a] text-sm text-center">Sarah T.</div>
                                    <div className="text-[11px] text-gray-500 text-center font-medium leading-tight mt-0.5">Theater & Arts</div>
                                </div>
                                <div
                                    className={`w-[120px] cursor-pointer group rounded-[20px] p-2 transition ${viewedInterests.includes('Varsity Soccer') ? 'bg-orange-50 ring-2 ring-orange-500' : 'hover:bg-gray-50'}`}
                                    onClick={() => setViewedInterests(prev => prev.includes('Varsity Soccer') ? prev : [...prev, 'Varsity Soccer'])}
                                >
                                    <div className="w-full aspect-square rounded-[16px] bg-gray-200 overflow-hidden relative mb-2 shadow-sm border border-gray-100">
                                        <div className="absolute inset-0 bg-orange-100 flex items-center justify-center text-4xl group-hover:scale-110 transition">⚽</div>
                                    </div>
                                    <div className="font-bold text-[#1a1a1a] text-sm text-center">David L.</div>
                                    <div className="text-[11px] text-gray-500 text-center font-medium leading-tight mt-0.5">Varsity Soccer</div>
                                </div>
                                <div
                                    className={`w-[120px] cursor-pointer group rounded-[20px] p-2 transition ${viewedInterests.includes('STEM / Robotics') ? 'bg-purple-50 ring-2 ring-purple-500' : 'hover:bg-gray-50'}`}
                                    onClick={() => setViewedInterests(prev => prev.includes('STEM / Robotics') ? prev : [...prev, 'STEM / Robotics'])}
                                >
                                    <div className="w-full aspect-square rounded-[16px] bg-gray-200 overflow-hidden relative mb-2 shadow-sm border border-gray-100">
                                        <div className="absolute inset-0 bg-purple-100 flex items-center justify-center text-4xl group-hover:scale-110 transition">🔬</div>
                                    </div>
                                    <div className="font-bold text-[#1a1a1a] text-sm text-center">Maya K.</div>
                                    <div className="text-[11px] text-gray-500 text-center font-medium leading-tight mt-0.5">STEM / Robotics</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Quick Stats Row (AllTrails Style) */}
                <div className="grid grid-cols-2 gap-y-4 md:flex md:gap-12 md:px-2 items-end">
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[40px] md:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-none">{formatPercent(school.admission_rate)}</span>
                        </div>
                        <span className="text-[14px] md:text-sm font-medium text-[#7a807d] mt-1 block">Acceptance rate</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[40px] md:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-none">{(school.enrollment_total / 1000).toFixed(1)}</span>
                            <span className="text-lg md:text-xl font-bold text-[#1a1a1a] ml-1">k</span>
                        </div>
                        <span className="text-[14px] md:text-sm font-medium text-[#7a807d] mt-1 block">Total enrollment</span>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[40px] md:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-none">{formatCurrency(school.net_price_public || school.net_price_private).replace('$', '')}</span>
                        </div>
                        <span className="text-[14px] md:text-sm font-medium text-[#7a807d] mt-1 block">Net price / year</span>
                    </div>
                </div>

                <div className="h-px bg-gray-200 w-full mt-10 mb-8"></div>

                {/* Content Layout */}
                <div className="mt-8 flex flex-col lg:flex-row gap-12">

                    {/* Left Sticky Sidebar Nav */}
                    <div className="hidden lg:block w-[240px] flex-shrink-0">
                        <div className="sticky top-8 flex flex-col gap-1 text-[15px] font-medium text-gray-500">
                            <a href="#report-card" className="bg-[#f4f4f4] text-[#1a1a1a] font-bold rounded-xl px-4 py-2.5 mb-2 flex items-center justify-between pointer-events-auto">
                                Overview <ChevronRight className="w-4 h-4 text-gray-400" />
                            </a>
                            <a href="#report-card" className="hover:bg-[#f4f4f4] hover:text-[#1a1a1a] rounded-xl px-4 py-2.5 cursor-pointer transition block">Report Card</a>
                            <a href="#about" className="hover:bg-[#f4f4f4] hover:text-[#1a1a1a] rounded-xl px-4 py-2.5 cursor-pointer transition block">About</a>
                            <a href="#admissions" className="hover:bg-[#f4f4f4] hover:text-[#1a1a1a] rounded-xl px-4 py-2.5 cursor-pointer transition block">Admissions & Acceptance</a>
                            <a href="#will-you-get-in" className="hover:bg-[#f4f4f4] hover:text-[#1a1a1a] rounded-xl px-4 py-2.5 cursor-pointer transition block">Will You Get In?</a>
                            <a href="#cost" className="hover:bg-[#f4f4f4] hover:text-[#1a1a1a] rounded-xl px-4 py-2.5 cursor-pointer transition block">Cost & Tuition</a>
                            <a href="#campus-life" className="hover:bg-[#f4f4f4] hover:text-[#1a1a1a] rounded-xl px-4 py-2.5 cursor-pointer transition block">Campus Life</a>
                            <a href="#sports" className="hover:bg-[#f4f4f4] hover:text-[#1a1a1a] rounded-xl px-4 py-2.5 cursor-pointer transition block">Sports & Athletics</a>
                            <a href="#reviews" className="hover:bg-[#f4f4f4] hover:text-[#1a1a1a] rounded-xl px-4 py-2.5 cursor-pointer transition block">Reviews</a>
                        </div>
                    </div>

                    {/* Main Content Sections */}
                    <div className="flex-1 flex flex-col space-y-12 pb-24">

                        {/* Report Card Block */}
                        <div id="report-card" className="bg-[#f8f9fa] rounded-[32px] p-6 sm:p-10 md:p-12 scroll-mt-12 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-10 md:gap-10 md:gap-y-12 mb-10">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-xl flex-shrink-0 text-[#1a1a1a] border border-gray-100">{grade}</div>
                                    <div>
                                        <div className="text-[22px] font-bold text-[#1a1a1a] mb-1">Overall Grade</div>
                                        <a href="#" className="text-gray-500 text-sm hover:text-[#1a1a1a] underline underline-offset-2 decoration-gray-300">View all grades</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100 text-gray-600"><span className="text-2xl">⚯</span></div>
                                    <div>
                                        <div className="text-[22px] font-bold text-[#1a1a1a] mb-1">{school.enrollment_total?.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">Total Undergrad Students</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100"><span className="text-2xl">🏆</span></div>
                                    <div>
                                        <div className="text-[22px] font-bold text-[#1a1a1a] mb-1">{formatPercent(school.admission_rate)}</div>
                                        <div className="text-sm text-gray-500">Acceptance Rate</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100"><MapPin className="text-gray-500 w-6 h-6" /></div>
                                    <div>
                                        <div className="text-[22px] font-bold text-[#1a1a1a] mb-1">Midsize City</div>
                                        <div className="text-sm text-gray-500">{school.city}, {school.state}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100 font-light text-2xl text-gray-600">$</div>
                                    <div>
                                        <div className="text-[22px] font-bold text-[#1a1a1a] mb-1">{formatCurrency(school.tuition_in_state)}</div>
                                        <div className="text-sm text-gray-500">Net Price Per Year · <span className="underline decoration-gray-300 hover:text-[#1a1a1a] cursor-pointer">Calculate True Cost</span></div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100">
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>
                                    </div>
                                    <div className="pt-2">
                                        <a href={school.website} target="_blank" rel="noreferrer" className="text-lg font-bold text-[#1a1a1a] underline underline-offset-4 decoration-gray-300 hover:decoration-[#1a1a1a] transition break-all">{school.website?.replace(/^https?:\/\//, '')}</a>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 leading-loose text-lg font-medium mt-8">
                                {school.name} is {school.admission_rate < 0.2 ? 'an elite' : 'a strong'} {school.type?.replace('_', ' ') || 'private college'} located in {school.city}, {school.state}. It is a {school.enrollment_total > 15000 ? 'large' : school.enrollment_total > 5000 ? 'midsize' : 'small'} institution with an enrollment of {school.enrollment_total?.toLocaleString()} students. Admissions is {school.admission_rate < 0.2 ? 'highly competitive' : school.admission_rate < 0.5 ? 'competitive' : 'accessible'} as the acceptance rate is {formatPercent(school.admission_rate)}. Popular majors include {['Business', 'Engineering', 'Nursing', 'Computer Science'][(school.id % 4)]} and {['Psychology', 'Biology', 'Communications', 'Mathematics'][(school.id % 4)]}. Graduating {school.graduation_rate <= 1 ? (school.graduation_rate * 100)?.toFixed(0) : school.graduation_rate?.toFixed(0)}% of students, {school.name.split(' ')[0]} alumni go on to earn a starting salary of {formatCurrency(school.median_earnings_10yr)}.
                            </p>
                        </div>

                        {/* About Block */}
                        <div id="about" className="bg-white border border-gray-100 text-center relative rounded-[32px] shadow-sm overflow-hidden mt-6 scroll-mt-12 w-full">
                            <h2 className="sr-only">About</h2>

                            {/* AI Scorecard Table */}
                            <div className="p-6 sm:p-10 md:p-12 pb-10 flex flex-col md:flex-row items-center border-b border-gray-100">
                                <div className="w-full md:w-1/3 flex flex-col items-center justify-center mb-8 md:mb-0 md:border-r border-gray-100 px-4 text-center">
                                    <div className="w-24 h-24 rounded-[32px] border border-gray-100 bg-white shadow-sm text-[#1a1a1a] flex items-center justify-center font-bold text-4xl mb-6 shadow-indigo-100">
                                        {school.ai_scorecard?.overall_ai_grade || grade}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 leading-tight">AI Community Scorecard</h3>
                                    <p className="text-sm text-gray-500 mb-4 px-2">
                                        {school.ai_scorecard ? "Synthesized from Reddit threads and Google Reviews by AI." : "Calculated from public data sources."}
                                    </p>
                                </div>
                                <div className="w-full md:w-2/3 px-4 md:px-12 flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-y-6">
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm text-[#1a1a1a] flex items-center justify-center font-bold text-sm">{school.ai_scorecard?.academics_grade || 'A+'}</div> <span className="text-gray-600 font-medium">Academics</span></div>
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm text-[#1a1a1a] flex items-center justify-center font-bold text-sm">{school.ai_scorecard?.value_grade || 'A+'}</div> <span className="text-gray-600 font-medium">Value</span></div>
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm text-[#1a1a1a] flex items-center justify-center font-bold text-sm">{school.ai_scorecard?.diversity_grade || 'A+'}</div> <span className="text-gray-600 font-medium">Diversity</span></div>
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm text-[#1a1a1a] flex items-center justify-center font-bold text-sm">{school.ai_scorecard?.campus_grade || 'A-'}</div> <span className="text-gray-600 font-medium">Campus</span></div>
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-500 flex items-center justify-center font-bold text-sm">{school.ai_scorecard?.athletics_grade || 'B-'}</div> <span className="text-gray-600 font-medium">Athletics</span></div>
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm text-[#1a1a1a] flex items-center justify-center font-bold text-sm">{school.ai_scorecard?.party_scene_grade || 'A'}</div> <span className="text-gray-600 font-medium">Party Scene</span></div>
                                    </div>

                                    {school.ai_scorecard?.ai_summary_text && (
                                        <div className="mt-4 bg-[#f8f9fa] rounded-2xl p-5 border border-indigo-50/50 text-left text-sm text-gray-600 leading-relaxed font-medium relative">
                                            <div className="absolute -top-3 left-6 bg-white px-2 py-0.5 text-xs font-bold text-indigo-600 border border-indigo-100 rounded-full shadow-sm flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                                AI Insight
                                            </div>
                                            "{school.ai_scorecard.ai_summary_text}"
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className="w-full py-4 text-[#1a1a1a] font-bold hover:bg-[#f4f4f4] transition border-b border-gray-100 flex items-center justify-center gap-2">View Full Report Card <ChevronDown className="w-4 h-4" /></button>

                            {/* About Meta Info */}
                            <div className="p-6 sm:p-10 md:p-12 text-left flex flex-col md:flex-row gap-12 md:gap-16">
                                <div className="w-full md:w-1/2 space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-12 h-12 bg-[#f4f4f4] rounded-full flex items-center justify-center flex-shrink-0 text-[#1a1a1a]">
                                            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>
                                        </div>
                                        <div className="pt-2">
                                            <a href={school.website} target="_blank" rel="noreferrer" className="text-[17px] font-bold text-[#1a1a1a] underline underline-offset-4 decoration-gray-300 hover:decoration-[#1a1a1a] transition break-all">{school.website?.replace(/^https?:\/\//, '') || 'Not provided'}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-12 h-12 bg-[#f4f4f4] rounded-full flex items-center justify-center flex-shrink-0 text-[#1a1a1a]"><MapPin className="w-5 h-5" /></div>
                                        <div className="text-gray-600 font-medium leading-relaxed pt-1">
                                            <span className="text-[#1a1a1a] font-bold">{school.name}</span><br />{school.city}, {school.state} {school.zip}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                                        <div className="w-12 h-12 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center flex-shrink-0 text-gray-400"><CheckCircle className="w-5 h-5" /></div>
                                        <span className="font-bold text-[#1a1a1a]">Work Here? <a href="#" className="underline underline-offset-4 decoration-gray-300 hover:decoration-[#1a1a1a] ml-1">Claim Your College</a></span>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 tracking-tight">About {school.name}...</h3>
                                        <div className="flex flex-wrap gap-2 text-sm font-bold">
                                            <span className="bg-[#f4f4f4] px-4 py-2 rounded-full text-[#1a1a1a]">Private</span>
                                            <span className="bg-[#f4f4f4] px-4 py-2 rounded-full text-[#1a1a1a]">Research College or University</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 mb-1 text-sm font-medium">Athletics Division</h3>
                                        <p className="font-bold text-[#1a1a1a] text-lg">{school.athletics_division || "Not Reported"}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 mb-1 text-sm font-medium">Athletics Conference</h3>
                                        <p className="font-bold text-[#1a1a1a] text-lg">{school.athletics_conference || "Not Reported"}</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <a href="#" className="font-bold text-[#1a1a1a] underline underline-offset-4 decoration-gray-300 hover:decoration-[#1a1a1a]">Compare to Other Colleges</a>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#f4f4f4] px-6 sm:px-10 md:px-12 py-5 text-left text-[#1a1a1a] font-bold text-sm">
                                <a href="#" className="hover:underline underline-offset-4 decoration-gray-400 mr-2">{school.state} <ChevronRight className="w-3 h-3 inline text-gray-400" /></a> <a href="#" className="hover:underline underline-offset-4 decoration-gray-400">{school.city}</a>
                            </div>
                        </div>

                        {/* Admissions Section */}
                        <div id="admissions" className="bg-[#f8f9fa] rounded-[32px] p-6 sm:p-10 md:p-12 mt-12 scroll-mt-12 w-full">
                            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#1a1a1a] mb-8 md:mb-10 tracking-tight">Admissions & Acceptance</h2>
                            <div className="flex flex-col md:flex-row gap-12 md:gap-16">
                                <div className="w-full md:w-1/2 space-y-8">
                                    <div>
                                        <div className="text-gray-500 font-medium flex items-center gap-1.5 text-lg mb-2">Application Deadline <HelpCircle className="w-4 h-4 text-gray-400" /></div>
                                        <div className="text-[40px] font-extrabold text-[#1a1a1a] tracking-tight">{school.application_deadline || "Rolling"}</div>
                                    </div>

                                    <div className="space-y-4 pt-4 text-lg text-[#1a1a1a]">
                                        <div className="flex justify-between border-b border-gray-200 pb-3"><span className="text-gray-500 font-medium">SAT Range</span><span className="font-bold">{school.sat_range || "Not Reported"}</span></div>
                                        <div className="flex justify-between border-b border-gray-200 pb-3"><span className="text-gray-500 font-medium">ACT Range</span><span className="font-bold">{school.act_range || "Not Reported"}</span></div>
                                        <div className="flex justify-between border-b border-gray-200 pb-3"><span className="text-gray-500 font-medium">Application Fee</span><span className="font-bold">{school.application_fee ? `$${school.application_fee}` : "Free"}</span></div>
                                        <div className="flex justify-between border-b border-gray-200 pb-3"><span className="text-gray-500 font-medium">SAT/ACT</span><span className="font-bold">{school.sat_required || "Considered if submitted"}</span></div>
                                        <div className="flex justify-between border-b border-gray-200 pb-3"><span className="text-gray-500 font-medium">High School GPA</span><span className="font-bold">{school.gpa_required || "Considered"}</span></div>
                                        <div className="flex justify-between border-b border-gray-200 pb-3"><span className="text-gray-500 font-medium">Early Decision/Action</span><span className="font-bold">{school.early_decision ? "Yes" : "No"}</span></div>
                                        <div className="flex justify-between border-b border-gray-200 pb-3"><span className="text-gray-500 font-medium">Accepts Common App</span><span className="font-bold">{school.common_app ? "Yes" : "No"}</span></div>
                                        <div className="flex justify-between border-b border-gray-200 pb-3"><span className="text-gray-500 font-medium max-w-[120px]">Application Website</span><a href={school.application_website || "#"} className="font-bold underline underline-offset-4 decoration-gray-300 hover:decoration-[#1a1a1a] truncate">{school.application_website?.replace(/^https?:\/\//, '') || school.name.toLowerCase().replace(/\s/g, '') + 'admissions.org'}</a></div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 space-y-10">
                                    <div>
                                        <div className="text-gray-500 font-medium text-lg mb-2">Acceptance Rate</div>
                                        <div className="text-[48px] font-extrabold text-[#1a1a1a] tracking-tight mb-2 leading-none">{formatPercent(school.admission_rate)}</div>
                                        <div className="text-sm text-gray-500 font-medium flex items-center gap-2">37% <select className="border border-gray-300 rounded-lg px-2 py-1 bg-white outline-none focus:border-gray-500"><option>State Avg</option></select></div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-xl text-[#1a1a1a] border-b border-gray-200 pb-4 mb-6 tracking-tight">Students also applied to ...</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-200 text-[#1a1a1a] flex items-center justify-center font-bold text-sm transition group-hover:border-gray-300">A+</div>
                                                <a href="#" className="text-[17px] font-bold text-[#1a1a1a] underline decoration-transparent group-hover:decoration-gray-300 underline-offset-4 transition">California Institute of Technology</a>
                                            </div>
                                            <div className="w-full h-px bg-gray-200"></div>
                                            <div className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-200 text-[#1a1a1a] flex items-center justify-center font-bold text-sm transition group-hover:border-gray-300">A+</div>
                                                <a href="#" className="text-[17px] font-bold text-[#1a1a1a] underline decoration-transparent group-hover:decoration-gray-300 underline-offset-4 transition">Stanford University</a>
                                            </div>
                                            <div className="w-full h-px bg-gray-200"></div>
                                            <div className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-200 text-[#1a1a1a] flex items-center justify-center font-bold text-sm transition group-hover:border-gray-300">A+</div>
                                                <a href="#" className="text-[17px] font-bold text-[#1a1a1a] underline decoration-transparent group-hover:decoration-gray-300 underline-offset-4 transition">Harvard University</a>
                                            </div>
                                            <div className="pt-4"><a href="#" className="text-[#1a1a1a] hover:bg-[#efefef] bg-white border border-gray-200 px-4 py-2 rounded-full transition inline-flex items-center gap-1 font-bold shadow-sm">More <ChevronDown className="w-4 h-4" /></a></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scatterplot Will You Get In block */}
                        <div id="will-you-get-in" className="bg-white border text-center relative border-gray-100 rounded-[32px] shadow-sm overflow-hidden mt-12 mb-12 p-6 sm:p-10 md:p-12 scroll-mt-12 w-full">
                            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#1a1a1a] mb-8 md:mb-10 tracking-tight text-left">Will You Get Into {school.name}?</h2>
                            <div className="flex flex-col lg:flex-row gap-10">
                                <div className="w-[180px] flex-shrink-0 space-y-4 text-left">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-6 h-6 rounded flex items-center justify-center bg-[#1a1a1a] text-white"><CheckCircle className="w-4 h-4" /></div>
                                        <span className="text-[#1a1a1a] font-bold group-hover:opacity-80 transition">Accepted</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-400 text-white"><CheckCircle className="w-4 h-4" /></div>
                                        <span className="text-[#1a1a1a] font-bold group-hover:opacity-80 transition">Rejected</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-200 text-gray-500"><CheckCircle className="w-4 h-4 opacity-0" /></div>
                                        <span className="text-gray-500 font-bold group-hover:opacity-80 transition">Considering</span>
                                    </label>
                                    <select className="w-full mt-6 border border-gray-200 rounded-xl p-3 font-bold text-[#1a1a1a] bg-[#f4f4f4] outline-none hover:bg-[#e8e8e8] transition cursor-pointer">
                                        <option>All Majors</option>
                                    </select>
                                </div>
                                <div className="flex-1 relative h-[380px] bg-white rounded-[24px] border border-gray-100 p-4 pb-2 sm:p-6 sm:pb-4 flex flex-col items-center justify-center overflow-hidden">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis type="number" dataKey="sat" name="SAT" domain={[800, 1600]} tick={{ fill: '#a6aba8', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(tick) => tick} />
                                            <YAxis type="number" dataKey="gpa" name="GPA" domain={[2.0, 4.0]} tick={{ fill: '#a6aba8', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(tick) => tick.toFixed(1)} />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }}
                                                contentStyle={{ borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                                                itemStyle={{ fontWeight: 'bold', color: '#1a1a1a' }}
                                                labelStyle={{ color: '#6b7280', fontSize: '13px', marginBottom: '4px' }}
                                            />
                                            <Scatter name="Students" data={scatterData} fill="#1a1a1a">
                                                {scatterData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.status === 'Accepted' ? '#1a1a1a' : entry.status === 'Rejected' ? '#9ca3af' : '#e5e7eb'} />
                                                ))}
                                            </Scatter>
                                        </ScatterChart>
                                    </ResponsiveContainer>

                                    {/* Map overlay CTA */}
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-[24px] shadow-xl border border-gray-100/50 p-6 flex flex-col sm:flex-row items-center gap-6 w-11/12 max-w-lg z-10 popup-bounce text-left">
                                        <div className="w-20 h-20 bg-[#f4f4f4] rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                            <div className="absolute border border-gray-200 inset-0 opacity-20 bg-[url('/images/scatter_plot_mockup.png')] bg-cover bg-center"></div>
                                            <div className="absolute text-4xl">👆</div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-extrabold tracking-tight text-xl text-[#1a1a1a] mb-1">What Are Your Chances?</p>
                                            <p className="text-sm font-medium text-gray-500 mb-4 line-clamp-2">See how you compare to current students and your competition.</p>
                                            <button className="bg-[#1a1a1a] text-white font-bold py-3 px-6 w-full rounded-full shadow-sm hover:bg-black transition">See Your Chances</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cost & Tuition Section */}
                        <div id="cost" className="bg-[#f8f9fa] rounded-[32px] p-6 sm:p-10 md:p-12 mb-12 scroll-mt-12 w-full">
                            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#1a1a1a] mb-8 md:mb-10 tracking-tight">Cost & Tuition</h2>
                            <div className="flex flex-col md:flex-row gap-12 md:gap-16">
                                <div className="w-full md:w-1/2 space-y-8">
                                    <div>
                                        <div className="text-gray-500 font-medium text-lg mb-2">Net Price</div>
                                        <div className="text-[48px] font-extrabold text-[#1a1a1a] tracking-tight mb-2 leading-none">{formatCurrency(school.tuition_in_state)} <span className="text-xl font-medium text-gray-400 tracking-normal">/ year</span></div>
                                        <div className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-2">$17,821 <select className="border border-gray-300 rounded-lg px-2 py-1 bg-white outline-none focus:border-gray-500"><option>National Avg</option></select></div>
                                    </div>
                                    <p className="text-gray-600 font-medium pt-2 border-b border-gray-200 pb-8">
                                        Average cost after financial aid for students receiving grant or scholarship aid, as reported by the college.
                                    </p>
                                    <div>
                                        <h3 className="font-bold text-xl text-[#1a1a1a] mb-6 tracking-tight">Avg. Room & Board Expenses</h3>
                                        <div className="flex justify-between border-b border-gray-200 pb-3 mb-4"><span className="text-gray-500 font-medium">Average Housing Cost</span><span className="font-bold text-[#1a1a1a]">{school.housing_cost ? formatCurrency(school.housing_cost) : "Not Reported"} <span className="text-sm text-gray-500 font-medium font-normal">/ year</span></span></div>
                                        <div className="flex justify-between border-b border-gray-200 pb-3 mb-4"><span className="text-gray-500 font-medium">Average Meal Plan Cost</span><span className="font-bold text-[#1a1a1a]">{school.meal_plan_cost ? formatCurrency(school.meal_plan_cost) : "Not Reported"} <span className="text-sm text-gray-500 font-medium font-normal">/ year</span></span></div>
                                        <div className="flex justify-between border-b border-gray-200 pb-3"><span className="text-gray-500 font-medium">Books & Supplies</span><span className="font-bold text-[#1a1a1a]">{school.books_supplies_cost ? formatCurrency(school.books_supplies_cost) : "Not Reported"} <span className="text-sm text-gray-500 font-medium font-normal">/ year</span></span></div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <h3 className="font-bold text-xl text-[#1a1a1a] mb-8 tracking-tight">Tuition & Financial Aid</h3>
                                    <div className="space-y-6">
                                        <div className="flex justify-between border-b border-gray-200 pb-4">
                                            <span className="text-gray-500 font-medium pt-1">In-State Tuition</span>
                                            <div className="text-right">
                                                <div className="font-bold text-lg text-[#1a1a1a]">{formatCurrency(school.tuition_in_state || 60156)} <span className="text-sm text-gray-500 font-medium">/ year</span></div>
                                                <div className="text-sm text-gray-500 mt-2 flex items-center gap-2 justify-end font-medium">$33,894 <select className="border border-gray-300 rounded-lg px-2 py-1 bg-white outline-none"><option>State Avg</option></select></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 pb-4">
                                            <span className="text-gray-500 font-medium pt-1">Out-of-State Tuition</span>
                                            <div className="text-right">
                                                <div className="font-bold text-lg text-[#1a1a1a]">{formatCurrency(school.tuition_out_of_state || 60156)} <span className="text-sm text-gray-500 font-medium">/ year</span></div>
                                                <div className="text-sm text-gray-500 mt-2 flex items-center gap-2 justify-end font-medium">$36,578 <select className="border border-gray-300 rounded-lg px-2 py-1 bg-white outline-none"><option>State Avg</option></select></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 pb-4">
                                            <span className="text-gray-500 font-medium pt-1">Average Total Aid Awarded</span>
                                            <div className="text-right">
                                                <div className="font-bold text-lg text-[#1a1a1a]">{school.average_total_aid ? formatCurrency(school.average_total_aid) : "Not Reported"} <span className="text-sm text-gray-500 font-medium">/ year</span></div>
                                                <div className="text-sm text-gray-500 mt-2 flex items-center gap-2 justify-end font-medium">$10,457 <select className="border border-gray-300 rounded-lg px-2 py-1 bg-white outline-none"><option>Natl. Avg</option></select></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <span className="text-gray-500 font-medium">Students Receiving Financial Aid</span>
                                            <span className="font-bold text-lg text-[#1a1a1a]">{school.percent_financial_aid ? formatPercent(school.percent_financial_aid) : "Not Reported"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-gray-200 text-right">
                                <a href="#" className="font-bold text-[#1a1a1a] underline underline-offset-4 decoration-gray-300 hover:decoration-[#1a1a1a] transition inline-flex items-center justify-end gap-1">Calculate your True Cost <ChevronRight className="w-4 h-4" /></a>
                            </div>
                        </div>

                        {/* Campus Life Section */}
                        <div id="campus-life" className="bg-white border text-left border-gray-100 shadow-sm rounded-[32px] overflow-hidden mb-12 scroll-mt-12 w-full">
                            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#1a1a1a] tracking-tight p-6 sm:p-10 md:p-12 pb-0">Campus Life</h2>
                            <div className="p-6 sm:p-10 md:p-12 pb-12 flex flex-col md:flex-row gap-12 md:gap-16">
                                <div className="w-full md:w-1/2 space-y-10">
                                    <div>
                                        <div className="text-gray-500 font-medium mb-2 text-lg">Freshman Live On-Campus</div>
                                        <div className="text-[48px] font-extrabold text-[#1a1a1a] tracking-tight leading-none">{school.freshman_live_on_campus ? formatPercent(school.freshman_live_on_campus) : "Not Reported"}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 font-medium mb-2 text-lg">Day Care Services</div>
                                        <div className="text-[48px] font-extrabold text-[#1a1a1a] tracking-tight leading-none">{school.day_care_services != null ? (school.day_care_services ? "Yes" : "No") : "Not Reported"}</div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-200 space-y-10">
                                        <div>
                                            <div className="flex justify-between items-center text-sm font-bold tracking-widest text-[#1a1a1a] mb-4 uppercase">
                                                <span className="flex items-center gap-2">Poll</span>
                                            </div>
                                            <div className="text-[48px] font-extrabold text-[#1a1a1a] tracking-tight mb-4 flex items-center gap-4 leading-none">
                                                <div className="w-12 h-12 rounded-full bg-[#f4f4f4] overflow-hidden flex border border-gray-200">
                                                    <div className="bg-[#d1d5db]" style={{ width: `${school.ai_scorecard?.poll_greek_life_percent || 0}%` }}></div>
                                                    <div className="bg-[#f3f4f6]" style={{ width: `${100 - (school.ai_scorecard?.poll_greek_life_percent || 0)}%` }}></div>
                                                </div>
                                                {school.ai_scorecard?.poll_greek_life_percent || "N/A"}%
                                            </div>
                                            <p className="text-gray-600 font-medium mb-2 text-lg">of students say that Greek life is average, and no one will treat you differently if you don't join.</p>
                                            <p className="text-sm text-gray-400 font-medium">124 responses</p>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center text-sm font-bold tracking-widest text-[#1a1a1a] mb-4 uppercase">
                                                <span className="flex items-center gap-2">Poll</span>
                                            </div>
                                            <div className="text-[48px] font-extrabold text-[#1a1a1a] tracking-tight mb-4 flex items-center gap-4 leading-none">
                                                <div className="w-12 h-12 rounded-full bg-[#f4f4f4] overflow-hidden flex border border-gray-200">
                                                    <div className="bg-[#d1d5db]" style={{ width: `${school.ai_scorecard?.poll_varsity_sports_percent || 0}%` }}></div>
                                                    <div className="bg-[#f3f4f6]" style={{ width: `${100 - (school.ai_scorecard?.poll_varsity_sports_percent || 0)}%` }}></div>
                                                </div>
                                                {school.ai_scorecard?.poll_varsity_sports_percent || "N/A"}%
                                            </div>
                                            <p className="text-gray-600 font-medium mb-2 text-lg">of students say varsity sporting events are attended, but not a huge part of campus life.</p>
                                            <p className="text-sm text-gray-400 font-medium">92 responses</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 space-y-8">
                                    <div className="flex justify-between items-center text-sm font-bold tracking-widest text-[#1a1a1a] uppercase">
                                        <span className="flex items-center gap-2">Student Poll</span>
                                    </div>
                                    <h3 className="text-[22px] text-[#1a1a1a] font-bold tracking-tight leading-snug">What is your overall opinion of your school and the campus community?</h3>
                                    <p className="text-sm text-gray-400 font-medium">Based on 41 responses</p>

                                    <div className="space-y-4">
                                        <div className="bg-[#f4f4f4] rounded-full relative overflow-hidden flex h-14 items-center">
                                            <div className="absolute left-0 top-0 bottom-0 bg-[#d1d5db] rounded-full" style={{ width: `${school.ai_scorecard?.poll_happiness_love_percent || 1}%` }}></div>
                                            <div className="relative z-10 px-6 flex justify-between items-center w-full text-[#1a1a1a] text-[15px]">
                                                <span className="w-4/5 font-medium truncate">I love everything about my school.</span>
                                                <span className="font-bold">{school.ai_scorecard?.poll_happiness_love_percent || 0}%</span>
                                            </div>
                                        </div>
                                        <div className="bg-[#f4f4f4] rounded-full relative overflow-hidden flex h-14 items-center">
                                            <div className="absolute left-0 top-0 bottom-0 bg-[#d1d5db] rounded-full" style={{ width: `${school.ai_scorecard?.poll_happiness_like_percent || 1}%` }}></div>
                                            <div className="relative z-10 px-6 flex justify-between items-center w-full text-[#1a1a1a] text-[15px]">
                                                <span className="w-4/5 font-medium truncate">I like mostly everything about it.</span>
                                                <span className="font-bold">{school.ai_scorecard?.poll_happiness_like_percent || 0}%</span>
                                            </div>
                                        </div>
                                        <div className="bg-[#f4f4f4] rounded-full relative overflow-hidden flex h-14 items-center">
                                            <div className="absolute left-0 top-0 bottom-0 bg-[#d1d5db] rounded-full" style={{ width: `${school.ai_scorecard?.poll_happiness_okay_percent || 1}%` }}></div>
                                            <div className="relative z-10 px-6 flex justify-between items-center w-full text-[#1a1a1a] text-[15px]">
                                                <span className="w-4/5 font-medium">It's mostly okay.</span>
                                                <span className="font-bold">{school.ai_scorecard?.poll_happiness_okay_percent || 0}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#f8f9fa] border border-gray-100 rounded-3xl p-8 mt-10 space-y-8">
                                        <div className="flex justify-between items-center text-sm font-bold tracking-widest text-[#1a1a1a] uppercase border-b border-gray-200 pb-4 mb-4 mt-2">
                                            <span className="flex items-center gap-2">More Polls</span>
                                        </div>
                                        <div className="flex gap-6 items-start">
                                            <div className="text-[48px] font-extrabold text-[#1a1a1a] tracking-tight leading-none">{school.ai_scorecard?.poll_athletics_facilities_percent || "N/A"}%</div>
                                            <div>
                                                <p className="text-[#1a1a1a] font-medium text-lg leading-snug mb-2">of students highly rate the athletics/recreation facilities.</p>
                                                <p className="text-sm text-gray-500 font-medium">63 responses</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-6 items-start">
                                            <div className="text-[40px] font-serif font-bold text-[#333] leading-none">{school.ai_scorecard?.poll_dining_facilities_percent || "N/A"}%</div>
                                            <div>
                                                <p className="text-gray-700 mb-1">of students highly rate the dining facilities.</p>
                                                <p className="text-xs text-gray-400">64 responses</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-6 items-start">
                                            <div className="text-[40px] font-serif font-bold text-[#333] leading-none">{school.ai_scorecard?.poll_performing_arts_percent || "N/A"}%</div>
                                            <div>
                                                <p className="text-gray-700 mb-1">of students highly rate the performing arts facilities.</p>
                                                <p className="text-xs text-gray-400">62 responses</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#fbfcfa] px-6 sm:px-10 md:px-12 py-4 text-right border-t border-gray-100 text-[#2a5b9c]">
                                <a href="#" className="hover:underline flex justify-end items-center gap-1 font-bold">Read More About Campus Life <ChevronRight className="w-4 h-4" /></a>
                            </div>
                        </div>

                        {/* Sports & Athletics Section */}
                        <div id="sports" className="bg-[#f8f9fa] rounded-[32px] p-6 sm:p-10 md:p-12 mb-12 scroll-mt-12 w-full">
                            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#1a1a1a] mb-8 md:mb-10 tracking-tight">Sports & Athletics</h2>
                            <div className="flex flex-col md:flex-row gap-12 md:gap-16">
                                <div className="w-full md:w-1/2 space-y-8">
                                    <div>
                                        <h3 className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Athletics Division</h3>
                                        <p className="font-bold text-[#1a1a1a] text-xl">NCAA Division III (with football)</p>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Athletics Conference</h3>
                                        <p className="font-bold text-[#1a1a1a] text-xl">New England Women's & Men's Athletic Conference</p>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-3">
                                        <span className="text-gray-500 font-medium">Students Who Are Varsity Athletes</span>
                                        <span className="font-bold text-[#1a1a1a] text-lg">{school.varsity_athletes_percent || 17}%</span>
                                    </div>

                                    <div className="pt-4">
                                        <div className="flex justify-between items-center text-sm font-bold tracking-widest text-[#1a1a1a] mb-6 uppercase">
                                            <span className="flex items-center gap-2">Student Poll</span>
                                        </div>
                                        <h3 className="text-[22px] text-[#1a1a1a] font-bold tracking-tight mb-2 leading-snug">How popular are varsity sports on campus?</h3>
                                        <p className="text-sm text-gray-500 font-medium mb-6">Based on 81 responses</p>

                                        <div className="space-y-4">
                                            <div className="bg-[#f4f4f4] rounded-2xl relative overflow-hidden flex min-h-[56px] items-center">
                                                <div className="absolute left-0 top-0 bottom-0 bg-[#d1d5db] block rounded-2xl" style={{ width: `${Math.round((school.ai_scorecard?.poll_varsity_sports_percent || 60) * 0.1)}%` }}></div>
                                                <div className="relative z-10 p-4 px-6 flex justify-between items-center w-full text-[#1a1a1a] text-[15px]">
                                                    <span className="w-4/5 font-medium leading-snug">Almost everything on campus revolves around them.</span>
                                                    <span className="font-bold">{Math.round((school.ai_scorecard?.poll_varsity_sports_percent || 60) * 0.1)}%</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#f4f4f4] rounded-2xl relative overflow-hidden flex min-h-[56px] items-center">
                                                <div className="absolute left-0 top-0 bottom-0 bg-[#d1d5db] block rounded-2xl" style={{ width: `${Math.round((school.ai_scorecard?.poll_varsity_sports_percent || 60) * 0.15)}%` }}></div>
                                                <div className="relative z-10 p-4 px-6 flex justify-between items-center w-full text-[#1a1a1a] text-[15px]">
                                                    <span className="w-4/5 font-medium leading-snug">Varsity sports are a big part of campus life.</span>
                                                    <span className="font-bold">{Math.round((school.ai_scorecard?.poll_varsity_sports_percent || 60) * 0.15)}%</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#f4f4f4] rounded-2xl relative overflow-hidden flex min-h-[56px] items-center">
                                                <div className="absolute left-0 top-0 bottom-0 bg-[#d1d5db] block rounded-2xl" style={{ width: `${school.ai_scorecard?.poll_varsity_sports_percent || 60}%` }}></div>
                                                <div className="relative z-10 p-4 px-6 flex justify-between items-center w-full text-[#1a1a1a] text-[15px]">
                                                    <span className="w-4/5 font-medium leading-snug">Varsity sporting events are attended, but not a huge part of campus life.</span>
                                                    <span className="font-bold">{school.ai_scorecard?.poll_varsity_sports_percent || 60}%</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#f4f4f4] rounded-2xl relative overflow-hidden flex min-h-[56px] items-center">
                                                <div className="absolute left-0 top-0 bottom-0 bg-[#d1d5db] block rounded-2xl" style={{ width: `${Math.max(0, 100 - (Math.round((school.ai_scorecard?.poll_varsity_sports_percent || 60) * 0.1) + Math.round((school.ai_scorecard?.poll_varsity_sports_percent || 60) * 0.15) + (school.ai_scorecard?.poll_varsity_sports_percent || 60)))}%` }}></div>
                                                <div className="relative z-10 p-4 px-6 flex justify-between items-center w-full text-[#1a1a1a] text-[15px]">
                                                    <span className="w-4/5 font-medium leading-snug">No one pays attention to varsity sports.</span>
                                                    <span className="font-bold">{Math.max(0, 100 - (Math.round((school.ai_scorecard?.poll_varsity_sports_percent || 60) * 0.1) + Math.round((school.ai_scorecard?.poll_varsity_sports_percent || 60) * 0.15) + (school.ai_scorecard?.poll_varsity_sports_percent || 60)))}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <h3 className="font-bold text-xl text-[#1a1a1a] border-b border-gray-200 pb-4 mb-6 tracking-tight">Men's Sports</h3>
                                    <div className="space-y-4">
                                        {mensSportsList.length > 0 ? mensSportsList.map((sport, idx) => (
                                            <div key={idx} className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-[#1a1a1a] font-medium text-[17px] flex items-center gap-3">
                                                    <span className="text-xl">{sportEmojis[sport] || "🏅"}</span> {sport}
                                                </span>
                                                <span className="text-gray-500 font-medium">{school.athletics_division || "Division III"}</span>
                                            </div>
                                        )) : (
                                            <p className="text-gray-500 italic">No men's sports reported.</p>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-xl text-[#1a1a1a] border-b border-gray-200 pb-4 mt-12 mb-6 tracking-tight">Women's Sports</h3>
                                    <div className="space-y-4">
                                        {womensSportsList.length > 0 ? womensSportsList.map((sport, idx) => (
                                            <div key={idx} className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-[#1a1a1a] font-medium text-[17px] flex items-center gap-3">
                                                    <span className="text-xl">{sportEmojis[sport] || "🏅"}</span> {sport}
                                                </span>
                                                <span className="text-gray-500 font-medium">{school.athletics_division || "Division III"}</span>
                                            </div>
                                        )) : (
                                            <p className="text-gray-500 italic">No women's sports reported.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* FAQs Section */}
                        <div id="faqs" className="bg-white border border-gray-100 shadow-sm rounded-[32px] overflow-hidden mb-12 scroll-mt-12 w-full">
                            <div className="p-6 sm:p-10 md:p-12 pb-6">
                                <div className="flex items-start gap-4 md:gap-6 mb-10">
                                    <div className="relative mt-1 flex-shrink-0">
                                        <MessageCircle className="w-14 h-14 text-[#00e68a] fill-current" />
                                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#1a1a1a] font-extrabold text-xl">Q</span>
                                        <div className="absolute -bottom-2 -right-2 bg-white w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center shadow-sm"><span className="font-bold text-sm text-[#1a1a1a]">A</span></div>
                                    </div>
                                    <div>
                                        <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#1a1a1a] mb-3 tracking-tight">Frequently Asked Questions</h2>
                                        <p className="text-gray-500 font-medium leading-relaxed text-lg">
                                            Common questions and answers about <span className="font-bold text-[#1a1a1a]">{school.name}</span> to help you decide if it's the right fit for you.
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 divide-y divide-gray-200">
                                    {faqs.map((faq, idx) => (
                                        <div key={idx} className="py-8">
                                            <h3
                                                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                                                className="text-[22px] font-bold text-[#1a1a1a] leading-snug flex justify-between items-start gap-6 cursor-pointer tracking-tight"
                                            >
                                                <span className="flex-1">{faq.q}</span>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-colors duration-200 ${openFaqIndex === idx ? 'bg-[#f4f4f4]' : 'bg-white border border-gray-200 shadow-sm'}`}>
                                                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${openFaqIndex === idx ? 'text-[#1a1a1a] rotate-180' : 'text-gray-400'}`} />
                                                </div>
                                            </h3>
                                            {openFaqIndex === idx && (
                                                <div className="mt-6 text-gray-600 font-medium leading-relaxed text-[17px] animate-fade-in-up">
                                                    {faq.a}
                                                    {faq.isAi && (
                                                        <div className="mt-6 bg-[#f8f9fa] border border-gray-100 rounded-xl p-4 text-sm font-medium text-gray-500 flex items-start sm:items-center gap-3">
                                                            <Star className="w-4 h-4 text-[#00e68a] flex-shrink-0 mt-0.5 sm:mt-0" /> <span className="flex-1">Question summaries are AI generated from the text of student reviews. <button className="text-[#1a1a1a] font-bold hover:underline underline-offset-4 decoration-gray-300 transition">Report</button> summary inaccuracies</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#f4f4f4] p-6 text-center border-t border-gray-100">
                                <button className="font-bold text-[#1a1a1a] hover:underline underline-offset-4 decoration-gray-400 decoration-2 transition flex items-center justify-center gap-2 mx-auto text-lg">View all questions <ChevronDown className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div id="reviews" className="bg-[#f8f9fa] border-none rounded-[32px] shadow-sm p-6 sm:p-10 md:p-12 mt-12 mb-12 scroll-mt-12 w-full">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                                <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#1a1a1a] tracking-tight">{school.name} Reviews</h2>
                                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm w-fit border border-gray-100">
                                    <span className="flex items-center text-[#1a1a1a]">
                                        {[...Array(reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating_overall, 0) / reviews.length) : 4)].map((_, i) => <Star key={`filled-${i}`} className={`w-5 h-5 fill-current ${i === 0 ? 'mr-1' : ''}`} />)}
                                        {[...Array(5 - (reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating_overall, 0) / reviews.length) : 4))].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 ml-1" />)}
                                    </span>
                                    <span className="text-gray-500 font-bold">{reviews.length > 0 ? reviews.length : totalReviews} reviews</span>
                                </div>
                            </div>

                            <div className="mb-12 text-gray-600 font-medium leading-relaxed text-[17px]">
                                <div className="text-sm font-bold tracking-widest text-[#1a1a1a] mb-4 uppercase flex items-center gap-2"><Star className="w-5 h-5 text-[#00e68a]" /> What students say</div>
                                {school.ai_scorecard?.ai_summary_text || `At ${school.name}, students generally describe their academic experience as both rigorous and rewarding, with a strong emphasis on collaboration and innovative problem-solving. Many appreciate the passionate and supportive faculty who genuinely care about student success, even amid the challenges of intense coursework...`}
                                <div className="text-sm text-gray-400 mt-6 font-medium">Summary is AI generated from the text of student reviews. <button className="text-[#1a1a1a] font-bold hover:underline underline-offset-4 decoration-gray-300 transition">Report</button> summary inaccuracies</div>
                            </div>

                            <div className="border-t border-gray-200 pt-12 flex flex-col md:flex-row gap-16">
                                <div className="w-full md:w-[240px] flex-shrink-0">
                                    <div className="flex items-baseline gap-3 mb-4">
                                        <div className="text-[56px] font-extrabold text-[#1a1a1a] tracking-tight leading-none">
                                            {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating_overall, 0) / reviews.length).toFixed(1) : "0.0"}
                                        </div>
                                        <div className="text-gray-500 font-medium text-sm">overall rating<br />{reviews.length || totalReviews} reviews</div>
                                    </div>
                                    <div className="flex items-center text-gray-300 mb-8"><Star className="w-6 h-6 fill-[#1a1a1a] text-[#1a1a1a]" /><Star className="w-6 h-6 fill-[#1a1a1a] text-[#1a1a1a]" /><Star className="w-6 h-6 fill-[#1a1a1a] text-[#1a1a1a]" /><Star className="w-6 h-6 fill-[#1a1a1a] text-[#1a1a1a]" /><Star className="w-6 h-6 fill-[#1a1a1a] text-[#1a1a1a]" /></div>

                                    <div className="space-y-3 text-sm text-[#1a1a1a] font-bold">
                                        <div className="flex items-center gap-4"><span>5</span> <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-200"><div className="bg-[#1a1a1a] w-[45%] h-full"></div></div> <span className="w-10 text-right font-medium text-gray-500">{Math.floor((reviews.length || totalReviews) * 0.45)}</span></div>
                                        <div className="flex items-center gap-4"><span>4</span> <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-200"><div className="bg-[#1a1a1a] w-[30%] h-full"></div></div> <span className="w-10 text-right font-medium text-gray-500">{Math.floor((reviews.length || totalReviews) * 0.30)}</span></div>
                                        <div className="flex items-center gap-4"><span>3</span> <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-200"><div className="bg-[#1a1a1a] w-[15%] h-full"></div></div> <span className="w-10 text-right font-medium text-gray-500">{Math.floor((reviews.length || totalReviews) * 0.15)}</span></div>
                                        <div className="flex items-center gap-4"><span>2</span> <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-200"><div className="bg-[#1a1a1a] w-[3%] h-full"></div></div> <span className="w-10 text-right font-medium text-gray-500">{Math.floor((reviews.length || totalReviews) * 0.03)}</span></div>
                                        <div className="flex items-center gap-4"><span>1</span> <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-200"><div className="bg-[#1a1a1a] w-[1%] h-full"></div></div> <span className="w-10 text-right font-medium text-gray-500">{Math.floor((reviews.length || totalReviews) * 0.01)}</span></div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-8">
                                    <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#1a1a1a]">Have you attended {school.name}?</h3>
                                            <p className="text-gray-500 text-sm">Share your experiences and help others decide.</p>
                                        </div>
                                        {!reviewFormOpen && (
                                            <button
                                                onClick={() => {
                                                    if (!user) openLogin();
                                                    else setReviewFormOpen(true);
                                                }}
                                                className="bg-[#1a1a1a] text-white font-bold py-2.5 px-6 rounded-full shadow-sm hover:bg-black transition"
                                            >
                                                Leave a Review
                                            </button>
                                        )}
                                    </div>

                                    {reviewFormOpen && (
                                        <form onSubmit={handleCreateReview} className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6 sm:p-8 animate-fade-in-up">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-xl font-bold">Write a Review</h3>
                                                <button type="button" onClick={() => setReviewFormOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setNewReviewRating(star)}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star className={`w-8 h-8 ${newReviewRating >= star ? "fill-[#1a1a1a] text-[#1a1a1a]" : "text-gray-300"}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
                                                <textarea
                                                    required
                                                    value={newReviewText}
                                                    onChange={e => setNewReviewText(e.target.value)}
                                                    rows={4}
                                                    placeholder="What's it like attending here?"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00e68a] focus:border-transparent outline-none resize-none"
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button type="button" onClick={() => setReviewFormOpen(false)} className="px-6 py-2.5 rounded-full font-bold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                                                <button type="submit" disabled={submittingReview} className="bg-[#00e68a] text-black font-bold py-2.5 px-6 rounded-full shadow-sm hover:bg-[#00cc7a] transition disabled:opacity-70">
                                                    {submittingReview ? "Posting..." : "Post Review"}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {reviews.length > 0 ? reviews.map((rev, idx) => (
                                        <div key={idx} className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 relative">
                                            {rev.source && rev.source !== 'EduSearch' && (
                                                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-500">
                                                    {rev.source === 'Google' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>}
                                                    {rev.source === 'Reddit' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#FF4500"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.505 1.12-.821 2.685-1.373 4.417-1.465l.891-4.178c.036-.168.195-.285.367-.285.03 0 .06.004.09.012l3.033.64c.266-.395.708-.654 1.223-.654zm-6.289 10.42c.883 0 1.833-.177 2.607-.514l.118-.328a.428.428 0 1 0-.806-.29c-.615.289-1.482.441-2.228.441-.745 0-1.611-.151-2.227-.441a.428.428 0 1 0-.806.29l.118.328c.773.337 1.724.514 2.607.514zm3.832-2.383c0-.626-.508-1.134-1.134-1.134-.627 0-1.134.508-1.134 1.134 0 .627.507 1.135 1.134 1.135.626 0 1.134-.508 1.134-1.135zm-6.526 0c0-.626-.507-1.134-1.134-1.134-.626 0-1.134.508-1.134 1.134 0 .627.508 1.135 1.134 1.135.627 0 1.134-.508 1.134-1.135z" /></svg>}
                                                    {rev.source}
                                                </div>
                                            )}
                                            <div className="flex items-center text-[#1a1a1a] mb-6">
                                                {[...Array(rev.rating_overall)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                                {[...Array(5 - rev.rating_overall)].map((_, i) => <Star key={i} className="w-5 h-5 text-gray-300" />)}
                                            </div>
                                            <p className="text-gray-600 font-medium leading-relaxed mb-6 text-[17px] whitespace-pre-wrap">{rev.body}</p>
                                            <div className="flex flex-wrap gap-2 text-sm text-[#1a1a1a] font-bold">
                                                <span className="text-[#1a1a1a] font-extrabold">{rev.reviewer_name}</span> <span className="text-gray-300">•</span> <span className="text-gray-500 font-medium capitalize">{rev.reviewer_type || "Student"}</span> <span className="text-gray-300">•</span> <span className="text-gray-500 font-medium">{new Date(rev.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-gray-500">
                                                <button className="flex items-center gap-2 hover:text-[#1a1a1a] transition bg-[#f4f4f4] px-4 py-2 rounded-full">👍 <span className="hidden sm:inline">{rev.helpful_count} people found this helpful</span></button>
                                                <button className="font-medium hover:text-[#1a1a1a] transition px-4 py-2">Report</button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center p-12 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-500">
                                            No reviews yet. Be the first to share your experience!
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                school={school}
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                intentData={viewedInterests}
            />

        </div>
    );
}
