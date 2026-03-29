import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Telescope, CheckCircle2, Puzzle, Heart } from 'lucide-react';

export default function HomePage() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            {/* HERO SECTION */}
            <section className="relative flex flex-col items-center justify-center min-h-[85vh] w-full mt-[-73px] pt-[73px] overflow-hidden">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero_students.png"
                        alt="Campus layout"
                        className="w-full h-full object-cover brightness-[0.65]"
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center w-full px-4 max-w-5xl mt-[-5vh]">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold text-white mb-10 text-center tracking-tight text-shadow-lg">
                        Good morning.
                    </h1>

                    {/* Search Component container */}
                    <div className="w-full max-w-2xl relative">
                        <div className="flex items-center w-full bg-white rounded-full p-2 pl-6 pr-4 shadow-2xl transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                            <svg className="w-6 h-6 text-gray-500 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by city, college, or major"
                                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 placeholder-gray-500 h-12"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') navigate('/search');
                                }}
                            />
                            <button
                                onClick={() => navigate('/search')}
                                className="bg-[#1a4331] hover:bg-[#0a2016] text-white p-3 rounded-full transition-colors ml-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>

                        {/* Dropdown Menu (mockup style) */}
                        <div className="absolute top-[calc(100%+16px)] right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 bg-white rounded-2xl shadow-xl w-[320px] max-w-[calc(100vw-32px)] overflow-hidden z-20 transition-all border border-gray-100 hidden md:block">
                            <div className="flex flex-col py-2">
                                <button className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors w-full text-left">
                                    <div className="bg-gray-100 p-2 rounded-full"><svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                                    <span className="font-semibold text-gray-800">Nearby colleges</span>
                                </button>
                                <button className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors w-full text-left">
                                    <div className="bg-gray-100 p-2 rounded-full"><svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                                    <span className="font-semibold text-gray-800">Recently viewed</span>
                                </button>
                                <button className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors w-full text-left">
                                    <div className="bg-gray-100 p-2 rounded-full"><svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                                    <span className="font-semibold text-gray-800">Build custom list</span>
                                </button>
                                <button className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors w-full text-left">
                                    <div className="bg-gray-100 p-2 rounded-full"><svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
                                    <span className="font-semibold text-gray-800">Community</span>
                                </button>
                                <button className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors w-full text-left border-t border-gray-100 mt-2">
                                    <div className="bg-gray-100 p-2 rounded-full"><svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg></div>
                                    <span className="font-semibold text-gray-800">Top national rankings</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DIRECT ADMISSIONS SECTION */}
            <section className="bg-[#f4ebe1] py-16 px-6 relative z-10 w-full flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
                <div className="w-full md:w-1/2 flex flex-col items-start px-4">
                    <div className="mb-4">
                        <span className="text-[#1a4331] font-bold text-xl flex items-center gap-1">EDU<span className="font-light">SEARCH</span>
                            <svg className="w-6 h-6 text-[#f36b21] ml-2" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v2H4V4zm0 6h16v2H4v-2zm0 6h16v2H4v-2z" /></svg>
                        </span>
                        <h2 className="text-[#1a4331] text-3xl font-serif mt-1 italic">Direct Admissions™</h2>
                    </div>
                    <h3 className="text-[#1a4331] text-4xl font-extrabold mb-6 leading-tight">Get accepted without an application.</h3>
                    <p className="text-gray-600 font-medium mb-8 text-lg max-w-md">No application. No waiting.<br />With Direct Admissions, colleges can accept you based on the information in your EduSearch Profile.</p>
                    <div className="flex items-center gap-4">
                        <button className="bg-[#1a4331] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0a2016] transition shadow-sm">Create an EduSearch Profile</button>
                        <button className="border-2 border-[#1a4331] text-[#1a4331] px-6 py-3 rounded-full font-bold hover:bg-[#e4dbd1] transition shadow-sm">Learn more</button>
                    </div>
                </div>
                <div className="w-full md:w-1/2 relative h-[400px] flex justify-center items-center">
                    {/* Mockup Phone */}
                    <div className="bg-white rounded-[2rem] shadow-2xl w-[260px] h-[480px] p-4 relative z-20 flex flex-col items-center">
                        <div className="absolute top-6 right-6 font-bold text-3xl text-[#f36b21]">*</div>
                        <div className="w-full bg-[#f36b21] h-[120px] rounded-t-[1.5rem] absolute top-2 left-0 z-0"></div>

                        <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden z-10 mt-16 shadow-lg bg-gray-200">
                            <img src="/images/student_profile.png" alt="Student Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="mt-8 w-full flex flex-col gap-3 px-2 z-10">
                            <div className="bg-[#9c7847] text-white text-xs font-bold py-3 px-2 rounded-full text-center">INTERESTED IN ENGINEERING</div>
                            <div className="bg-[#9c7847] text-white text-xs font-bold py-3 px-2 rounded-full text-center">DETROIT, MICHIGAN</div>
                            <div className="bg-[#9c7847] text-white text-xs font-bold py-3 px-2 rounded-full text-center">3.75 GPA</div>
                        </div>
                    </div>

                    {/* Floating Images (simulated) */}
                    <div className="hidden md:block absolute -right-4 top-10 w-24 h-24 rounded-full border-4 border-[#1a4331] overflow-hidden z-30 shadow-xl bg-gray-300">
                        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&q=80" className="object-cover w-full h-full" alt="Campus" />
                    </div>
                    <div className="hidden md:block absolute right-4 bottom-10 w-28 h-28 rounded-full border-4 border-[#f36b21] overflow-hidden z-30 shadow-xl bg-gray-300">
                        <img src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=300&q=80" className="object-cover w-full h-full" alt="Library" />
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="bg-[#f4ebe1] py-16 px-6 text-center text-[#1a4331]">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-4">Find Your EduSearch</h4>
                <h2 className="text-4xl font-extrabold mb-4">Your search is unique.<br />Just like you.</h2>
                <div className="w-24 h-5 mx-auto mb-6">
                    <svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 C25,20 25,0 50,10 C75,20 75,0 100,10" fill="none" stroke="#22c55e" strokeWidth="3" /></svg>
                </div>
                <p className="max-w-xl mx-auto text-lg mb-16 text-gray-700">We give you all of the data, reviews, and insights in one place to make your search as easy as possible.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center">
                        <div className="mb-6 relative w-20 h-20 text-[#2a7a4f]">
                            <Telescope className="w-16 h-16 relative z-10" strokeWidth={1} />
                            <div className="absolute top-2 -right-2 w-12 h-12 bg-green-200 rounded-full opacity-60 z-0"></div>
                        </div>
                        <h3 className="font-bold text-sm tracking-wider uppercase mb-4 text-[#2a7a4f]">No Heavy Lifting</h3>
                        <p className="text-gray-600 font-medium">We analyze the data so you don't have to.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-6 relative w-20 h-20 text-[#2a7a4f]">
                            <CheckCircle2 className="w-16 h-16 relative z-10" strokeWidth={1} />
                            <div className="absolute top-2 -left-2 w-12 h-12 bg-yellow-200 rounded-full opacity-60 z-0"></div>
                        </div>
                        <h3 className="font-bold text-sm tracking-wider uppercase mb-4 text-[#2a7a4f]">The Good, The Bad, & The Honest</h3>
                        <p className="text-gray-600 font-medium">Our user reviews let you hear directly from families and students to give you an honest and holistic view.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-6 relative w-20 h-20 text-[#2a7a4f]">
                            <Puzzle className="w-16 h-16 relative z-10" strokeWidth={1} />
                            <div className="absolute bottom-0 right-0 w-12 h-12 bg-pink-200 rounded-full opacity-60 z-0"></div>
                        </div>
                        <h3 className="font-bold text-sm tracking-wider uppercase mb-4 text-[#2a7a4f]">Like a Glove</h3>
                        <p className="text-gray-600 font-medium">We personalize your search based on what's most important to you.</p>
                    </div>
                </div>
            </section>

            <div className="w-full bg-[#f4ebe1]">
                {/* Wavy transition to white background for stories section */}
                <svg className="block w-full h-[60px] bg-white -mb-px" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-[#f4ebe1]"></path>
                </svg>
            </div>

            {/* STORIES SECTION */}
            <section className="bg-white py-16 px-6 text-[#1a4331] w-full overflow-hidden relative">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2 flex flex-col items-start pr-0 md:pr-12">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-[#2a7a4f]">Real EduSearch Stories</h4>
                        <h2 className="text-4xl font-extrabold mb-10 leading-tight">EduSearch has helped millions of students and families find their fit.</h2>
                        <div className="pl-6 border-l-4 border-gray-200">
                            <p className="text-lg text-[#324b89] font-medium leading-relaxed italic mb-4">
                                "During my college search, I was having a difficult time narrowing down what I wanted in a school, so I used EduSearch to help. I especially liked looking at the rankings for different aspects of the college experience, like the campus, academics, and much more!"
                            </p>
                            <p className="text-xs font-bold tracking-widest uppercase text-gray-500">- ABBY D.</p>
                        </div>
                        <div className="flex gap-2 mt-8 ml-6">
                            <div className="w-3 h-3 rounded-full bg-[#1a4331]"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 relative h-[500px] mt-12 md:mt-0 flex justify-center flex-col items-center">
                        <div className="relative w-[300px] md:w-[400px] h-[500px]">
                            <img src="/images/testimonial_student.png" alt="Student" className="rounded-3xl object-cover w-full h-full shadow-2xl relative z-20" />
                            {/* Colorful abstract wavy graphic */}
                            <svg className="absolute top-1/2 -left-20 md:-left-32 transform -translate-y-1/2 w-[150%] md:w-[180%] h-[200px] z-10 pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none">
                                <path d="M0,50 C100,50 150,0 200,50 C250,100 300,50 400,50 L400,100 L0,100 Z" fill="#ff7f12" opacity="0.9" />
                                <path d="M0,60 C100,60 150,10 200,60 C250,110 300,60 400,60 L400,100 L0,100 Z" fill="#ff77aa" opacity="0.8" />
                            </svg>

                            {/* Badge */}
                            <div className="absolute -bottom-10 -right-5 md:-right-10 w-32 md:w-40 h-32 md:h-40 bg-[#55aadd] rounded-full flex flex-col items-center justify-center z-30 transform rotate-12 drop-shadow-lg p-2 star-badge">
                                <p className="text-blue-900 font-bold text-[0.55rem] md:text-[0.65rem] tracking-widest uppercase mb-1 rotating-text text-center" style={{ letterSpacing: '0.2em' }}>I FOUND MY BEST FIT SCHOOL</p>
                                <svg className="w-8 h-8 md:w-12 md:h-12 text-blue-900 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STAY ON TRACK SECTION */}
            <section className="bg-[#1a4331] pt-12 pb-24 text-white w-full overflow-hidden relative">
                {/* Top section divider curve pointing down matching image */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180 z-20">
                    <svg className="relative block w-full h-[40px] md:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C89.71,114.62,185.92,112.55,270.62,94.3Z" className="fill-white"></path>
                    </svg>
                </div>

                <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 pt-20 px-6">
                    <div className="w-full md:w-1/2 relative space-y-6">
                        {/* Mock UI Cards */}
                        <div className="flex flex-col gap-4 max-w-sm">
                            <div className="bg-white rounded-t cursor-pointer w-[120px] font-bold text-[#1a4331] py-2 px-3 text-sm flex items-center shadow-lg -mb-2 z-10">
                                Your List <Heart className="w-4 h-4 ml-1 fill-[#2a7a4f] text-[#2a7a4f]" />
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-xl flex items-center justify-between z-20 hover:-translate-y-1 transition transform">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded bg-orange-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                        <div className="w-full h-1/2 bg-gray-200"></div><div className="w-full h-1/2 bg-green-200 rounded-t-full mt-1"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 text-sm">Stony Brook University</span>
                                        <div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 rounded-full bg-[#2a7a4f]"></div><div className="w-16 h-1 bg-gray-200 rounded"></div></div>
                                    </div>
                                </div>
                                <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Applied</div>
                            </div>

                            <div className="bg-white rounded-lg p-3 shadow-xl flex items-center justify-between z-20 hover:-translate-y-1 transition transform translate-x-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded bg-blue-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                        <div className="w-full h-full bg-[#2a7a4f] rounded-t-full mt-2"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 text-sm flex items-center">Pace University <div className="w-3 h-3 rounded-full bg-blue-400 ml-1"></div></span>
                                        <div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 rounded-full bg-[#2a7a4f]"></div><div className="w-16 h-1 bg-gray-200 rounded"></div></div>
                                    </div>
                                </div>
                                <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Researching</div>
                            </div>

                            <div className="bg-white rounded-lg p-3 shadow-xl flex items-center justify-between z-20 hover:-translate-y-1 transition transform translate-x-8 mt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded bg-pink-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-end">
                                        <div className="w-full h-3/4 bg-orange-400 rounded-tr-full"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 text-sm flex items-center">Adelphi University <div className="w-3 h-3 rounded-full bg-blue-400 ml-1"></div></span>
                                        <div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 rounded-full bg-[#2a7a4f]"></div><div className="w-16 h-1 bg-gray-200 rounded"></div></div>
                                    </div>
                                </div>
                                <div className="bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Touring</div>
                            </div>
                        </div>

                        <div className="absolute -left-10 bottom-0 hidden sm:block">
                            <button className="bg-white text-[#1a4331] font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-lg z-30 transform hover:scale-105 transition"><div className="w-3 h-4 border-l-4 border-r-4 border-[#1a4331]"></div> Pause</button>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col items-start px-4">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gray-300">Stay On Track</h4>
                        <h2 className="text-4xl font-extrabold mb-6 leading-tight">Tools to organize<br />your school search.</h2>
                        <div className="w-24 h-5 mb-6">
                            <svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 C25,20 25,0 50,10 C75,20 75,0 100,10" fill="none" stroke="#fff" strokeWidth="4" /></svg>
                        </div>
                        <p className="text-lg opacity-90 mb-8 max-w-sm font-medium">We'll help you build your list, track your progress and get new recommendations as your search narrows.</p>
                        <button className="text-white border-b border-white pb-1 font-bold hover:opacity-80 transition cursor-pointer">Start Exploring</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
