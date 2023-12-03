import { useState, useEffect, useCallback } from 'react';

const useDateHandler = (initialValue) => {
    const [date, setDate] = useState({
        day: '',
        month: '',
        year: '',
    });

    // Actualiza el estado cuando initialValue cambia
    useEffect(() => {
        setDate({
            day: initialValue.day || '',
            month: initialValue.month || '',
            year: initialValue.year || '',
        });
    }, [initialValue.day, initialValue.month, initialValue.year]);

    const handleDayChange = useCallback((newDay) => {
        setDate(currentDate => ({ ...currentDate, day: newDay }));
    }, []);

    const handleMonthChange = useCallback((newMonth) => {
        setDate(currentDate => ({ ...currentDate, month: newMonth }));
    }, []);

    const handleYearChange = useCallback((newYear) => {
        
        setDate(currentDate => ({ ...currentDate, year: newYear }));
    }, []);

    return { date, handleDayChange, handleMonthChange, handleYearChange };
};

export default useDateHandler;
