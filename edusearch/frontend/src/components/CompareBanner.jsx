import React from 'react';
import { useSearch } from '../context/SearchContext';
import { X, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompareBanner() {
    const { compareList, removeFromCompare } = useSearch();

    if (compareList.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none fade-in">
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto transition-all">

                {/* Left Side: Title and Selected Count */}
                <div className="flex-shrink-0 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-1 leading-tight">Compare Schools</h3>
                    <p className="text-sm text-gray-500 font-medium">
                        {compareList.length} of 3 Selected
                    </p>
                </div>

                {/* Center: Selected School Thumbnails */}
                <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar py-2 sm:py-0 px-2 sm:px-0">
                    {[0, 1, 2].map(index => {
                        const school = compareList[index];
                        return (
                            <div key={index} className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-200">
                                {school ? (
                                    <>
                                        <img
                                            src={`/images/college_campus_${(school.id % 2) === 0 ? '1_1771716197987' : '2_1771716213622'}.png`}
                                            alt={school.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => removeFromCompare(school.id)}
                                                className="w-8 h-8 bg-white/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
                                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-gray-400">ADD</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right Side: Action Button */}
                <Link
                    to="/compare"
                    className={`flex-shrink-0 group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all ${compareList.length >= 2
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                        }`}
                >
                    Compare Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

            </div>
        </div>
    );
}
