import { useState, useEffect } from 'react';
const useDateValidation = (date, touched) => {
    const [errors, setErrors] = useState({});

    // Funciones de validación (validateDay, validateMonth, validateYear)
    // Obtén el número de días en un mes para un año específico
    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    // Validadores actualizados
    const validateDay = (day, month, year) => {
        if (!day) return 'Day is required';
        const dayNum = parseInt(day, 10);
        if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) return 'Invalid day';
        if (month && year) {
            const maxDays = getDaysInMonth(month, year);
            if (dayNum > maxDays) return 'Day out of range for month';
        }
        return '';
    };

    const validateMonth = (month) => {
        if (!month) return 'Month is required';
        const monthNum = parseInt(month, 10);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) return 'Invalid month';
        return '';
    };

    const validateYear = (year) => {
         
        if (!year) return 'Year is required';
        const yearNum = parseInt(year, 10);
        const currentYear = new Date().getFullYear();
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) return `Year must be 1900 - ${currentYear}`;
        return '';
    };

   // Actualiza los errores cuando cambia la fecha o el estado de "touched"
    useEffect(() => {
        if (touched.day || touched.month || touched.year) {
            setErrors({
                day: validateDay(date.day, date.month, date.year),
                month: validateMonth(date.month),
                year: validateYear(date.year)
            });
        }
    }, [date, touched]);

    return errors;
};

export default useDateValidation;