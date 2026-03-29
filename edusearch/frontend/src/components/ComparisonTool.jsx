import React from 'react';
import { Star, TrendingUp, DollarSign, Users, GraduationCap, X } from 'lucide-react';

export default function ComparisonTool({ schools, onRemove }) {
    if (!schools || schools.length === 0) {
        return null;
    }

    if (schools.length === 1) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <p className="text-yellow-800">Add at least one more school to compare</p>
            </div>
        );
    }

    const getBest = (key, higherIsBetter = true) => {
        const validSchools = schools.filter(s => s[key] != null && s[key] !== 0);
        if (validSchools.length === 0) return null;

        return higherIsBetter
            ? validSchools.reduce((best, s) => s[key] > best[key] ? s : best)
            : validSchools.reduce((best, s) => s[key] < best[key] ? s : best);
    };

    const bestEarnings = getBest('median_earnings_10yr', true);
    const bestGraduation = getBest('graduation_rate', true);
    const lowestDebt = getBest('median_debt', false);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Comparing {schools.length} Schools</h3>
                <button className="text-sm text-green-600 hover:underline">
                    View Full Comparison
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="p-4 text-left text-sm font-semibold text-gray-900 bg-white sticky left-0">Feature</th>
                            {schools.map(school => (
                                <th key={school.id} className="p-4 text-center min-w-[180px]">
                                    <div className="relative">
                                        <button
                                            onClick={() => onRemove(school.id)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="font-semibold text-gray-900">{school.name}</div>
                                        <div className="text-xs text-gray-500">{school.city}, {school.state}</div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <ComparisonRow
                            label="Overall Rating"
                            icon={Star}
                            schools={schools}
                            getValue={s => s.rating_overall || 4.5}
                            format={v => (
                                <div className="flex items-center justify-center gap-1">
                                    <span className="font-bold text-lg">{v}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                            )}
                        />

                        <ComparisonRow
                            label="Median Earnings"
                            icon={DollarSign}
                            schools={schools}
                            getValue={s => s.median_earnings_10yr}
                            highlight={bestEarnings?.id}
                            format={v => (
                                <div className="font-bold text-green-600">
                                    {v ? `$${v.toLocaleString()}` : 'N/A'}
                                </div>
                            )}
                        />

                        <ComparisonRow
                            label="Graduation Rate"
                            icon={GraduationCap}
                            schools={schools}
                            getValue={s => s.graduation_rate}
                            highlight={bestGraduation?.id}
                            format={v => (
                                <div className={`font-bold ${v > 0.8 ? 'text-green-600' : v > 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {v ? `${(v * 100).toFixed(0)}%` : 'N/A'}
                                </div>
                            )}
                        />

                        <ComparisonRow
                            label="Median Debt"
                            icon={DollarSign}
                            schools={schools}
                            getValue={s => s.median_debt}
                            highlight={lowestDebt?.id}
                            format={v => (
                                <div className={`font-bold ${v && v < 20000 ? 'text-green-600' : v && v < 35000 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {v ? `$${v.toLocaleString()}` : 'N/A'}
                                </div>
                            )}
                        />

                        <ComparisonRow
                            label="Tuition (In-State)"
                            icon={DollarSign}
                            schools={schools}
                            getValue={s => s.tuition_in_state}
                            format={v => (
                                <div className="font-bold">
                                    {v ? `$${v.toLocaleString()}` : 'N/A'}
                                </div>
                            )}
                        />

                        <ComparisonRow
                            label="Students"
                            icon={Users}
                            schools={schools}
                            getValue={s => s.enrollment_total}
                            format={v => v ? v.toLocaleString() : 'N/A'}
                        />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ComparisonRow({ label, icon: Icon, schools, getValue, format, highlight }) {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="p-4 text-sm font-medium text-gray-700 bg-white sticky left-0 flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400" />
                {label}
            </td>
            {schools.map(school => {
                const value = getValue(school);
                const isHighlighted = school.id === highlight;

                return (
                    <td key={school.id} className={`p-4 text-center ${isHighlighted ? 'bg-green-50' : ''}`}>
                        {format(value)}
                        {isHighlighted && <div className="text-xs text-green-600 font-medium mt-1">★ Best</div>}
                    </td>
                );
            })}
        </tr>
    );
}
