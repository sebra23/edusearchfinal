import React, { useState } from 'react';
import { Calendar, X, Users, MapPin, Video, CheckCircle2 } from 'lucide-react';

export default function BookingModal({ school, isOpen, onClose, intentData }) {
    const [step, setStep] = useState(1);
    const [bookingType, setBookingType] = useState('in-person');
    const [selectedDate, setSelectedDate] = useState('');
    const [partySize, setPartySize] = useState(1);
    const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8000/api/v1/institutions/${school.id}/book-tour`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    institution_id: school.id,
                    booking_type: bookingType,
                    selected_date: selectedDate,
                    party_size: partySize,
                    contact_name: contactInfo.name,
                    contact_email: contactInfo.email,
                    intent_data: intentData
                })
            });

            if (!response.ok) throw new Error("Booking failed");

            const data = await response.json();
            console.log("Booking successful:", data);
            setStep(3); // Go to success screen
        } catch (error) {
            console.error("Error submitting booking:", error);
            alert("There was an error submitting your booking. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // View for unclaimed schools
    if (!school.is_claimed) {
        return (
            <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-[24px] w-full max-w-lg overflow-hidden shadow-2xl relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition z-10">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="p-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <Calendar className="w-8 h-8 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-2">Request a Tour at {school.name}</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            This school has not yet claimed their EduSearch profile. Fill out your details below and our concierge team will reach out to their admissions office to coordinate a tour on your behalf.
                        </p>

                        {step === 1 ? (
                            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Parent/Guardian Name</label>
                                    <input required type="text" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jane Doe" onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <input required type="email" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="jane@example.com" onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full bg-[#1a1a1a] text-white font-bold py-4 rounded-full mt-4 hover:bg-black transition shadow-md">
                                    Request Concierge Booking
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                                <p className="text-gray-500">Our team will be in touch shortly regarding your tour at {school.name}.</p>
                                <button onClick={onClose} className="mt-6 bg-gray-100 text-[#1a1a1a] font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition">Close</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // View for claimed schools
    return (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
                <div className="border-b border-gray-100 p-6 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-extrabold text-[#1a1a1a]">Schedule Your Visit</h2>
                        <p className="text-sm text-gray-500 font-medium">{school.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full transition shadow-sm">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            {/* Tour Type Selection */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">1. Select Tour Type</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setBookingType('in-person')}
                                        className={`p-4 rounded-2xl border-2 text-left transition ${bookingType === 'in-person' ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${bookingType === 'in-person' ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="font-bold text-[#1a1a1a] mb-1">In-Person Campus Tour</div>
                                        <div className="text-sm text-gray-500 font-medium">Walk the grounds with a student guide</div>
                                    </button>
                                    <button
                                        onClick={() => setBookingType('virtual')}
                                        className={`p-4 rounded-2xl border-2 text-left transition ${bookingType === 'virtual' ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${bookingType === 'virtual' ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            <Video className="w-5 h-5" />
                                        </div>
                                        <div className="font-bold text-[#1a1a1a] mb-1">Live Virtual Tour</div>
                                        <div className="text-sm text-gray-500 font-medium">Interactive Zoom session with admissions</div>
                                    </button>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">2. Select Date & Time</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Mock Dates based on next_tour_date */}
                                    <button
                                        onClick={() => setSelectedDate(school.next_tour_date)}
                                        className={`p-3 rounded-xl border text-center transition ${selectedDate === school.next_tour_date ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
                                    >
                                        <div className="font-bold text-sm mb-1">{school.next_tour_date ? new Date(school.next_tour_date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : 'Next Tuesday'}</div>
                                        <div className="text-xs font-medium opacity-80">{school.next_tour_date ? new Date(school.next_tour_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM'}</div>
                                        <div className="text-[10px] uppercase font-bold text-red-500 mt-2">{school.spots_remaining || 3} spots left</div>
                                    </button>
                                    <button
                                        onClick={() => setSelectedDate('date2')}
                                        className={`p-3 rounded-xl border text-center transition ${selectedDate === 'date2' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
                                    >
                                        <div className="font-bold text-sm mb-1">Next Thursday</div>
                                        <div className="text-xs font-medium opacity-80">2:00 PM</div>
                                        <div className="text-[10px] uppercase font-bold text-green-600 mt-2">Available</div>
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={!selectedDate}
                                onClick={() => setStep(2)}
                                className="w-full bg-[#1a1a1a] text-white font-bold py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition shadow-md"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 border-b pb-2">Selected Tour</label>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                                    <span className="font-bold capitalize">{bookingType.replace('-', ' ')}</span>
                                    <span>{selectedDate === school.next_tour_date && school.next_tour_date ? new Date(school.next_tour_date).toLocaleString() : 'Selected Date'}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Party Size</label>
                                <div className="flex items-center gap-4">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <input type="number" min="1" max="5" value={partySize} onChange={e => setPartySize(e.target.value)} className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center" />
                                    <span className="text-sm text-gray-500">Total attendees including student</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                                <input required type="text" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]" onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input required type="email" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]" onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition">Back</button>
                                <button type="submit" className="flex-1 bg-[#1a1a1a] text-white font-bold py-4 rounded-full hover:bg-black transition shadow-md">Confirm Booking</button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-12 animate-in fade-in zoom-in-95">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-3xl font-extrabold mb-3">You're Booked!</h3>
                            <p className="text-gray-500 text-lg max-w-sm mx-auto mb-8">
                                Check your email ({contactInfo.email}) for your prep package and itinerary for {school.name}.
                            </p>

                            {intentData?.length > 0 && (
                                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium mb-8 max-w-sm mx-auto text-left">
                                    <div className="font-bold mb-1">We let the school know you're interested in:</div>
                                    <ul className="list-disc list-inside">
                                        {intentData.map(i => <li key={i}>{i}</li>)}
                                    </ul>
                                </div>
                            )}

                            <button onClick={onClose} className="bg-[#1a1a1a] text-white font-bold px-10 py-4 rounded-full hover:bg-black transition shadow-md w-full max-w-xs">Done</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
