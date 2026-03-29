import React from 'react';
import { useSearch } from '../context/SearchContext';
import { Link, Navigate } from 'react-router-dom';
import { ChevronLeft, X, Star, MapPin } from 'lucide-react';

export default function ComparePage() {
    const { compareList, removeFromCompare } = useSearch();

    if (compareList.length === 0) {
        return <Navigate to="/search" replace />;
    }

    const formatCurrency = (val) => val ? `$${val.toLocaleString()}` : 'N/A';
    const formatPercent = (val) => {
        if (val == null) return 'N/A';
        return val <= 1 ? `${Math.round(val * 100)}%` : `${Math.round(val)}%`;
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Header Subnavigation */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link to="/search" className="inline-flex items-center text-gray-500 hover:text-[#1a1a1a] font-medium transition-colors mb-4">
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back to Search
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight">
                            Compare Colleges
                        </h1>
                    </div>
                    <div className="text-gray-500 font-medium bg-white px-4 py-2 rounded-full border border-gray-200">
                        {compareList.length} of 3 Selected
                    </div>
                </div>

                {/* Matrix Layout */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-6 bg-gray-50 w-48 font-bold text-gray-700 uppercase tracking-wider text-xs">Criteria</th>
                                {compareList.map((school, i) => (
                                    <th key={school.id} className="p-6 w-1/3 align-top border-l border-gray-100 relative group">
                                        <button
                                            onClick={() => removeFromCompare(school.id)}
                                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Remove"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-gray-200 mb-4">
                                            <img
                                                src={`/images/college_campus_${(school.id % 2) === 0 ? '1_1771716197987' : '2_1771716213622'}.png`}
                                                alt={school.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 leading-tight">
                                            <Link to={`/school/${school.slug}`} className="hover:text-indigo-600 transition-colors">
                                                {school.name}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                                            <MapPin className="w-4 h-4" />
                                            {school.city}, {school.state}
                                        </div>
                                    </th>
                                ))}
                                {/* Empty placeholders if < 3 schools */}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                                    <th key={`empty-${i}`} className="p-6 w-1/3 align-top border-l border-gray-50 bg-gray-50/50">
                                        <div className="aspect-[4/3] w-full rounded-[20px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                                            <Link to="/search" className="flex flex-col items-center hover:text-indigo-600 transition-colors">
                                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                                                    <span className="text-2xl leading-none">+</span>
                                                </div>
                                                <span className="font-semibold text-sm">Add School</span>
                                            </Link>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[#1a1a1a] font-medium">

                            {/* General Stats */}
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-6 bg-gray-50 font-bold text-gray-600 border-r border-gray-100">Overall AI Grade</td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-6 border-l border-gray-100">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-[#2a7a4f] font-bold text-lg">
                                            {school.ai_scorecard?.overall_ai_grade || 'A+'}
                                        </div>
                                    </td>
                                ))}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`emp-${i}`} className="border-l border-gray-50 bg-gray-50/50"></td>)}
                            </tr>

                            {/* Admissions */}
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-6 bg-gray-50 font-bold text-gray-600 border-r border-gray-100">Acceptance Rate</td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-6 border-l border-gray-100 text-xl font-bold">
                                        {formatPercent(school.admission_rate)}
                                    </td>
                                ))}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`emp-${i}`} className="border-l border-gray-50 bg-gray-50/50"></td>)}
                            </tr>

                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-6 bg-gray-50 font-bold text-gray-600 border-r border-gray-100">SAT Range</td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-6 border-l border-gray-100">
                                        {school.sat_math_25th ? (
                                            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg inline-block text-sm font-bold">
                                                {school.sat_math_25th + school.sat_reading_25th} - {school.sat_math_75th + school.sat_reading_75th}
                                            </div>
                                        ) : 'N/A'}
                                    </td>
                                ))}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`emp-${i}`} className="border-l border-gray-50 bg-gray-50/50"></td>)}
                            </tr>

                            {/* Financials */}
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-6 bg-gray-50 font-bold text-gray-600 border-r border-gray-100">In-State Tuition</td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-6 border-l border-gray-100 text-lg">
                                        {formatCurrency(school.tuition_in_state)}
                                    </td>
                                ))}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`emp-${i}`} className="border-l border-gray-50 bg-gray-50/50"></td>)}
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-6 bg-gray-50 font-bold text-gray-600 border-r border-gray-100">Net Price</td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-6 border-l border-gray-100 text-lg font-bold text-[#2a7a4f]">
                                        {formatCurrency(school.net_price_public || school.tuition_in_state)}
                                    </td>
                                ))}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`emp-${i}`} className="border-l border-gray-50 bg-gray-50/50"></td>)}
                            </tr>

                            {/* Environment */}
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-6 bg-gray-50 font-bold text-gray-600 border-r border-gray-100">Undergrad Enrollment</td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-6 border-l border-gray-100">
                                        {school.total_enrollment ? school.total_enrollment.toLocaleString() : 'N/A'} students
                                    </td>
                                ))}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`emp-${i}`} className="border-l border-gray-50 bg-gray-50/50"></td>)}
                            </tr>

                            {/* Athletics */}
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-6 bg-gray-50 font-bold text-gray-600 border-r border-gray-100 border-b-transparent">Athletics Division</td>
                                {compareList.map(school => (
                                    <td key={school.id} className="p-6 border-l border-gray-100 border-b-transparent text-sm">
                                        {school.athletics_division || 'NCAA Division III (without football)'}
                                    </td>
                                ))}
                                {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`emp-${i}`} className="border-l border-gray-50 bg-gray-50/50 border-b-transparent"></td>)}
                            </tr>

                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
