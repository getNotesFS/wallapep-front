import React, { useState, useEffect } from 'react';

const useValidation = (initialFormData, validators) => {
    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({});

    const [touchedFields, setTouchedFields] = useState({});

    useEffect(() => {
        Object.keys(formData).forEach(key => {
            if (touchedFields[key] && validators[key]) {
                let errorFound = false;
                for (let validator of validators[key]) {
                    const error = validator(formData[key]);
                    if (error) {
                        setFormErrors(prev => ({ ...prev, [key]: error }));
                        errorFound = true;
                        break; // Detener en el primer error encontrado
                    }
                }
                if (!errorFound) {
                    setFormErrors(prev => ({ ...prev, [key]: null }));
                }
            }
        });
    }, [formData, touchedFields, validators]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setTouchedFields(prev => ({ ...prev, [key]: true }));
    };

    return { formData,setFormData, handleChange, formErrors, setFormErrors, touchedFields, setTouchedFields };
};



export default useValidation;
