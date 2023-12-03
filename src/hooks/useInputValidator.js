 
import { useState, useCallback } from 'react';
const useInputValidator = (initialValue, validators) => {
    const [value, setValue] = useState(initialValue);
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState(null);

    const validate = useCallback(() => {
        for (const validator of validators) {
            const validationError = validator(value);
            if (validationError) {
                setError(validationError);
                return;
            }
        }
        setError(null);
    }, [value, validators]);

    useEffect(() => {
        if (touched) {
            validate();
        }
    }, [value, touched, validate]);

    return { value, setValue, touched, setTouched, error };
};

export default useInputValidator;