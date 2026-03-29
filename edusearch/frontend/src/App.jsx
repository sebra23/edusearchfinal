import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import SchoolPage from './pages/SchoolPage'
import ProfilePage from './pages/ProfilePage'
import ComparePage from './pages/ComparePage'
import Navbar from './components/Navbar'
import CompareBanner from './components/CompareBanner'
import { SearchProvider } from './context/SearchContext'
import { AuthProvider } from './context/AuthContext'
import { AuthModals } from './components/AuthModals'

function App() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <AuthProvider>
            <SearchProvider>
                <div className="min-h-screen bg-[#f4ebe1] font-sans">
                    <Navbar transparent={isHome} />
                    <AuthModals />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/school/:slug" element={<SchoolPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/compare" element={<ComparePage />} />
                    </Routes>
                    <CompareBanner />
                </div>
            </SearchProvider>
        </AuthProvider>
    )
}

export default App
