import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, MapPin, Heart, ChevronLeft, ChevronRight, Map, Plus } from 'lucide-react';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';

const API_URL = 'http://localhost:8000/api/v1';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const stateFilter = searchParams.get('state') || '';
    const typeFilter = searchParams.get('type') || '';
    const maxTuitionFilter = searchParams.get('max_tuition') || '';
    const sortFilter = searchParams.get('sort_by') || 'relevance';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [hoveredSchoolId, setHoveredSchoolId] = useState(null);
    const { addToCompare } = useSearch();
    const { savedSchools, saveSchool, unsaveSchool, user, openLogin } = useAuth();

    const [filterOptions, setFilterOptions] = useState({ states: [], types: [], levels: [], difficulties: [], sort_options: [] });

    useEffect(() => {
        axios.get(`${API_URL}/filters/options`).then(res => setFilterOptions(res.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (stateFilter) params.append('state', stateFilter);
        if (typeFilter) params.append('type', typeFilter);
        if (maxTuitionFilter) params.append('max_tuition', maxTuitionFilter);
        if (sortFilter && sortFilter !== 'relevance') params.append('sort_by', sortFilter);

        axios.get(`${API_URL}/search?${params.toString()}`).then(res => {
            setResults(res.data.results);
            setTotal(res.data.total);
            setLoading(false);
        });
    }, [query, stateFilter, typeFilter, maxTuitionFilter, sortFilter]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    // Format numbers safely
    const formatPercent = (val) => {
        if (val == null) return 'N/A';
        return val <= 1 ? `${Math.round(val * 100)}%` : `${Math.round(val)}%`;
    };
    const formatCurrency = (val) => val ? `$${val.toLocaleString()}` : 'N/A';

    return (
        <div className="flex flex-col h-screen bg-[#f9f9f9] overflow-hidden">


            {/* Split Screen Layout */}
            <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
                {/* Left Column (List) */}
                <div className="w-full lg:w-[55%] xl:w-[60%] overflow-y-auto bg-white flex flex-col relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)] pt-6 sm:pt-10">

                    <div className="px-6 md:px-10 lg:px-12 xl:px-16 pb-16 max-w-4xl mx-auto w-full">
                        {/* Breadcrumbs */}
                        <div className="text-sm font-bold text-gray-500 mb-6 flex items-center gap-2">
                            <span className="hover:text-black cursor-pointer border-b border-gray-400 pb-0.5">Back to Explore</span>
                            <span className="text-gray-300 font-normal">/</span>
                            <span className="hover:text-black cursor-pointer">Colleges</span>
                            <span className="text-gray-300 font-normal">/</span>
                            <span className="text-black">America</span>
                        </div>

                        <h1 className="text-[36px] sm:text-[48px] md:text-[56px] font-extrabold text-[#1a1a1a] leading-tight mb-6 tracking-tight">Best colleges in America</h1>

                        {/* Filters Bar */}
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <select
                                value={stateFilter}
                                onChange={(e) => updateFilter('state', e.target.value)}
                                className="bg-white border border-gray-300 text-sm rounded-full px-4 py-2 font-medium text-[#1a1a1a] shadow-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center]"
                            >
                                <option value="">State (Any)</option>
                                {filterOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>

                            <select
                                value={typeFilter}
                                onChange={(e) => updateFilter('type', e.target.value)}
                                className="bg-white border border-gray-300 text-sm rounded-full px-4 py-2 font-medium text-[#1a1a1a] shadow-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center]"
                            >
                                <option value="">Type (Any)</option>
                                {filterOptions.types.map(s => <option key={s} value={s}>{s?.replace('_', ' ')}</option>)}
                            </select>

                            <select
                                value={maxTuitionFilter}
                                onChange={(e) => updateFilter('max_tuition', e.target.value)}
                                className="bg-white border border-gray-300 text-sm rounded-full px-4 py-2 font-medium text-[#1a1a1a] shadow-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center]"
                            >
                                <option value="">Max Tuition (Any)</option>
                                <option value="10000">Under $10k/yr</option>
                                <option value="25000">Under $25k/yr</option>
                                <option value="40000">Under $40k/yr</option>
                                <option value="60000">Under $60k/yr</option>
                            </select>

                            <select
                                value={sortFilter}
                                onChange={(e) => updateFilter('sort_by', e.target.value)}
                                className="bg-[#1a1a1a] border border-[#1a1a1a] text-sm rounded-full px-4 py-2 font-bold text-white shadow-sm appearance-none cursor-pointer hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1a1a1a] pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center]"
                            >
                                {filterOptions.sort_options?.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>

                            {(stateFilter || typeFilter || maxTuitionFilter || (sortFilter && sortFilter !== 'relevance')) && (
                                <button
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.delete('state');
                                        newParams.delete('type');
                                        newParams.delete('max_tuition');
                                        newParams.delete('sort_by');
                                        setSearchParams(newParams);
                                    }}
                                    className="text-xs font-bold text-gray-500 hover:text-black underline px-2 py-2"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>



                        {/* Description */}
                        <p className="text-[#1a1a1a] text-lg leading-relaxed mb-12">
                            Ready to locate the perfect college? EduSearch has data on thousands of 4-year, 2-year, and community colleges across the United States. Discover hand-curated rankings, comprehensive academic statistics, and authentic reviews from real students to find your best fit.
                        </p>

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[28px] font-extrabold text-[#1a1a1a] tracking-tight">{total.toLocaleString()} college{total !== 1 && 's'}</h2>
                            <span className="text-gray-500 font-medium">Page 1</span>
                        </div>

                        {/* Results List */}
                        {loading ? (
                            <p className="py-12 text-gray-500 font-bold">Loading results...</p>
                        ) : (
                            <div className="space-y-2">
                                {results.map((school, index) => {
                                    const rank = index + 1;
                                    const reviewCount = (school.enrollment_total % 2000) + 150;
                                    const imgIndex = (index % 4) + 1;

                                    return (
                                        <div
                                            key={school.id}
                                            className="group"
                                            onMouseEnter={() => setHoveredSchoolId(school.id)}
                                            onMouseLeave={() => setHoveredSchoolId(null)}
                                        >
                                            <div className="flex flex-col sm:flex-row gap-6 p-4 -mx-4 rounded-[28px] hover:bg-[#f4f4f4] transition duration-300">
                                                {/* Left Image */}
                                                <div className="w-full sm:w-48 xl:w-56 aspect-[4/3] flex-shrink-0 rounded-[20px] overflow-hidden relative group/img cursor-pointer shadow-sm">
                                                    <img src={`/images/college_campus_${(school.id % 2) === 0 ? '1_1771716197987' : '2_1771716213622'}.png`} alt={school.name} className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500" />
                                                    <div className="absolute top-3 right-3 flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                addToCompare(school);
                                                            }}
                                                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white text-gray-800 transition shadow hover:scale-110 active:scale-95 z-10"
                                                            title="Add to Compare"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (!user) openLogin();
                                                                else if (savedSchools.includes(school.id)) unsaveSchool(school.id);
                                                                else saveSchool(school.id);
                                                            }}
                                                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white text-gray-800 transition shadow hover:scale-110 active:scale-95 z-10"
                                                            title="Save School"
                                                        >
                                                            <Heart className={`w-4 h-4 transition-colors ${savedSchools.includes(school.id) ? 'fill-[#1a1a1a] text-[#1a1a1a]' : ''}`} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Right Content */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-center py-2">
                                                    <Link to={`/school/${school.slug}`} className="text-[22px] font-bold text-[#1a1a1a] group-hover:underline truncate block mb-2 leading-tight">
                                                        #{rank} - {school.name}
                                                    </Link>

                                                    {school.is_claimed && school.next_tour_date ? (
                                                        <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] rounded-xl p-3 mb-3 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold">Next Available Tour:</span>
                                                                <span>{new Date(school.next_tour_date).toLocaleDateString()} at {new Date(school.next_tour_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            <div className="font-bold text-sm bg-white px-2 py-1 rounded-md shadow-sm">
                                                                {school.spots_remaining} spots left
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-50 border border-gray-200 text-gray-500 rounded-xl p-3 mb-3 flex items-center justify-center italic text-sm">
                                                            Tours not currently scheduled. Contact admissions.
                                                        </div>
                                                    )}

                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#1a1a1a] font-medium mb-3">
                                                        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current text-[#1a1a1a]" /> {school.rating_overall || "4.8"}</span>
                                                        <span className="text-gray-500">({reviewCount})</span>
                                                        <span className="text-gray-300 px-1">•</span>
                                                        <span className="text-[#2a7a4f] font-bold tracking-widest text-[11px] uppercase bg-green-50 px-2.5 py-1 rounded">Best Value</span>
                                                        <span className="text-gray-300 px-1">•</span>
                                                        <span className="text-gray-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {school.city}, {school.state}</span>
                                                    </div>
                                                    <p className="text-[15px] text-gray-600 line-clamp-2 leading-relaxed mb-4 pr-4">
                                                        {school.ai_scorecard?.ai_summary_text || `This highly-rated institution offers an incredible learning environment filled with innovation, collaboration, and hands-on opportunities designed to specifically prepare students for their post-graduate careers...`} <span className="font-bold text-[#1a1a1a] cursor-pointer hover:underline">more</span>
                                                    </p>

                                                    <div className="flex gap-3 mt-auto">
                                                        <Link to={`/school/${school.slug}#booking`} className="bg-[#1a1a1a] text-white font-bold py-2 px-6 rounded-full shadow-sm hover:bg-black transition text-sm flex items-center gap-2">
                                                            Book Tour <ChevronRight className="w-4 h-4" />
                                                        </Link>
                                                        <Link to={`/school/${school.slug}#virtual`} className="bg-white border border-gray-200 text-[#1a1a1a] font-bold py-2 px-6 rounded-full shadow-sm hover:border-gray-300 transition text-sm">
                                                            Virtual Tour
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Minimal separator */}
                                            {index < results.length - 1 && <div className="h-px bg-gray-200 mx-4 mt-2"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Explore More Button */}
                        {!loading && results.length > 0 && (
                            <div className="mt-12 text-center">
                                <button className="bg-[#1a1a1a] text-white font-bold px-8 py-3.5 rounded-full hover:bg-black transition shadow-md active:scale-95">
                                    Explore more colleges
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (Map) */}
                <div className="hidden lg:block lg:w-[45%] xl:w-[40%] bg-[#e5e3df] relative shadow-inner">
                    <MapView results={results} total={total} hoveredSchoolId={hoveredSchoolId} />
                </div>
            </div>

            {/* Mobile Map Button Overlay */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => setIsMapOpen(true)}
                    className="bg-[#1a1a1a] text-white px-6 py-3.5 rounded-full font-bold shadow-[0_8px_16px_rgba(0,0,0,0.2)] flex items-center gap-2 hover:scale-105 transition"
                >
                    <Map className="w-5 h-5" /> Map
                </button>
            </div>

            {/* Mobile Map Modal */}
            {isMapOpen && (
                <div className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col">
                    <div className="bg-white p-4 z-[1000] border-b border-gray-200 flex justify-between items-center shadow-sm">
                        <button onClick={() => setIsMapOpen(false)} className="bg-[#f4f4f4] hover:bg-[#e5e5e5] text-black px-4 py-2 rounded-full font-bold text-sm transition flex items-center gap-1">
                            <ChevronLeft className="w-4 h-4" /> Back to list
                        </button>
                        <span className="font-bold text-[#1a1a1a] text-sm">{total} Results</span>
                    </div>
                    <div className="flex-1 relative">
                        <MapView results={results} total={total} onClose={() => setIsMapOpen(false)} hoveredSchoolId={hoveredSchoolId} />
                    </div>
                </div>
            )}
        </div>
    );
}
