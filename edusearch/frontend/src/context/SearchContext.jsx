import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [compareList, setCompareList] = useState([]);

    const addToCompare = (school) => {
        if (compareList.length >= 3) {
            alert("Can only compare up to 3 schools");
            return;
        }
        if (!compareList.find(s => s.id === school.id)) {
            setCompareList([...compareList, school]);
        }
    };

    const removeFromCompare = (schoolId) => {
        setCompareList(compareList.filter(s => s.id !== schoolId));
    };

    return (
        <SearchContext.Provider value={{ compareList, addToCompare, removeFromCompare }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    return useContext(SearchContext);
}
