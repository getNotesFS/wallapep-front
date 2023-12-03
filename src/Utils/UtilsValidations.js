export let validateFormDataInputRequired =
    (formData, inputKey, formErrors, setFormErrors) => {

        let regexNotEmpty = /^(.+)$/;
        let errorMessage = "Required";


        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }

export let validateFormDataInputRequiredWithMinMax0 = (formData, inputKey, formErrors, setFormErrors, min = 0, max = null) => {
    let valueLength = formData[inputKey] ? formData[inputKey].length : 0;
    let errorMessage = null;


    if (max !== null && valueLength > max) {
        errorMessage = `Must be no more than ${max} characters`;
    } else if (valueLength < min) {
        errorMessage = `Must be at least ${min} characters`;
    }

    // Crear una nueva instancia de formErrors para la inmutabilidad
    let newFormErrors = {...formErrors};

    // Si el campo no está escrito aún o hay un error del servidor
    if (formData[inputKey] == null || formErrors[inputKey]?.type === "server") {
        return true;
    }
    let regexNotEmpty = /^(.+)$/;
    // Determinar si el valor es válido según el regex
    let isValid = formData[inputKey] != null && regexNotEmpty.test(formData[inputKey]);

    // Establecer o limpiar el mensaje de error basado en la validez
    newFormErrors[inputKey] = isValid ? null : {msg: errorMessage};

    // Actualizar el estado de formErrors solo si es necesario
    if (JSON.stringify(formErrors[inputKey]) !== JSON.stringify(newFormErrors[inputKey])) {
        setFormErrors(newFormErrors);
    }

    return isValid;
};

export let validateFormDataInputRequiredWithMinMax = (formData, inputKey, formErrors, setFormErrors, min = 0, max = null) => {
    let value = formData[inputKey] || '';
    let errorMessage = null;

    // Verificar si el campo está vacío
    if (!value) {
        errorMessage = 'This field is required';
    } else if (max !== null && value.length > max) {
        // Verificar si el valor excede el máximo
        errorMessage = `Must be no more than ${max} characters`;
    } else if (value.length < min) {
        // Verificar si el valor no alcanza el mínimo
        errorMessage = `Must be at least ${min} characters`;
    }

    // Actualizar el estado de formErrors
    if (errorMessage) {
        setFormErrors(prevErrors => ({...prevErrors, [inputKey]: {msg: errorMessage}}));
    } else {
        setFormErrors(prevErrors => {
            const newErrors = {...prevErrors};
            delete newErrors[inputKey];
            return newErrors;
        });
    }

    return !errorMessage;
};


export let validateBirthday = (formData, inputKey, formErrors, setFormErrors) => {
    let birthday = formData[inputKey];


    // Verifica si alguno de los componentes de la fecha está vacío
    if (!birthday.day || !birthday.month || !birthday.year || birthday.year.length < 4) {
        setFormErrors(prevErrors => ({...prevErrors, [inputKey]: 'Complete birthday fields'}));
        return;
    }

    // Construye una cadena de fecha en formato YYYY-MM-DD
    const birthdayStr = `${birthday.year}-${String(birthday.month).padStart(2, '0')}-${String(birthday.day).padStart(2, '0')}`;

    // Intenta crear una fecha con la cadena proporcionada
    const parsedDate = new Date(birthdayStr);
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 120); // Fecha de hace 120 años

    // Verifica si la fecha es válida (no es "Invalid Date") y si es razonable (no es futura ni más de 120 años en el pasado)
    const isValidDate = !isNaN(parsedDate.getTime());
    const isPastDate = parsedDate.getTime() < currentDate.getTime();
    const isNotTooOldDate = parsedDate.getTime() > pastDate.getTime();


    let errorMessage = null;
    if (!isValidDate) {
        errorMessage = 'Invalid date format';
    } else if (!isPastDate) {
        errorMessage = 'Birthday cannot be in the future';
    } else if (!isNotTooOldDate) {
        errorMessage = 'Birthday is too far in the past';
    }

    setFormErrors(prevErrors => ({...prevErrors, [inputKey]: errorMessage}));
};

export let validateFormDataInputEmail =
    (formData, inputKey, formErrors, setFormErrors) => {

        //let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        let errorMessage = "Not email format"
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexEmail, errorMessage)
    }

export let validateFormDataInput =
    (formData, inputKey, formErrors, setFormErrors, regex, msgError) => {


        // not write Yet
        if (formData[inputKey] == null) {
            return true
        }

        // have a serverError
        if (formErrors[inputKey]?.type == "server") {
            return false
        }
        // Have some value, remove the error only client erros
        if (formData[inputKey] != null && regex.test(formData[inputKey])) {

            if (formErrors[inputKey] != null) {

                formErrors[inputKey] = null;

                setFormErrors(formErrors)
                // don't put again the value in state
            }
            return true;
        }
        // Dont have value put the error
        if (formErrors[inputKey] == null) {
            formErrors[inputKey] = {msg: msgError}
            setFormErrors(formErrors)
        }
        return false;

    }


export let validateFormDataInput2 = (formData, inputKey, formErrors, setFormErrors, regex, msgError) => {

    // Crear una nueva instancia de formErrors para la inmutabilidad
    let newFormErrors = {...formErrors};

    // Si el campo no está escrito aún o hay un error del servidor
    if (formData[inputKey] == null || formErrors[inputKey]?.type === "server") {
        return true;
    }

    // Determinar si el valor es válido según el regex
    let isValid = formData[inputKey] != null && regex.test(formData[inputKey]);

    // Establecer o limpiar el mensaje de error basado en la validez
    newFormErrors[inputKey] = isValid ? null : {msg: msgError};

    // Actualizar el estado de formErrors solo si es necesario
    if (JSON.stringify(formErrors[inputKey]) !== JSON.stringify(newFormErrors[inputKey])) {
        setFormErrors(newFormErrors);
    }

    return isValid;
};


export let allowSubmitForm = (formData, formErrors, requiredInputWithNoErrors) => {
    let result = true;
    requiredInputWithNoErrors.forEach(inputKey => {
        if (formData[inputKey] == null
            || formErrors[inputKey] != null) {

            result = false;
            return;
        }
    })
    return result;
}
export const isFormValid = (formData, formErrors, requiredFields) => {
    // Verifica si todos los campos requeridos están completos
    const allRequiredFieldsFilled = requiredFields.every(field => {
        const value = formData[field];
        return value !== null && value !== undefined && value !== '';
    });

    // Verifica si hay errores
    const noErrors = Object.keys(formErrors).every(field => !formErrors[field]);

    return allRequiredFieldsFilled && noErrors;
};
export let setServerErrors = (serverErrors, setFormErrors) => {
    let newFormErrors = {} //delete all previous
    if (Array.isArray(serverErrors)) {
        serverErrors.forEach(e => {
            newFormErrors[e.field] = {msg: e.msg, type: "server"}
        });
    }
    // destroy all previous errors is a new SET
    setFormErrors(newFormErrors)
}


export let joinAllServerErrorMessages = (serverErrors) => {
    let generalErrorMessage = "";
    if (Array.isArray(serverErrors)) {
        serverErrors.forEach(e => {
            generalErrorMessage += e.msg
        });
    } else {
        if (serverErrors?.msg != null) {
            generalErrorMessage = serverErrors.msg;
        }
    }
    return generalErrorMessage
}


// CUSTOM UTILS TO USE IN FORMS AND HOOKS
// Validación de requerido con mensaje personalizable
export const requiredValidatorbk = (value, errorMessage = 'This field is required') => {
    // Verifica si el valor es un objeto de fecha con las propiedades day, month y year
    if (value && typeof value === 'object' && 'day' in value && 'month' in value && 'year' in value) {
        // Verifica que cada parte de la fecha no esté vacía
        if (birthadyValidator(value)) {
            return null; // Todos los campos de la fecha están completos
        } else {
            return { msg: errorMessage }; // Algunos campos de la fecha están vacíos
        }
    }
    // Verifica si el valor es una cadena o número no vacío
    if (value) {
        return null;
    }
    // En cualquier otro caso, se considera que falta el valor
    return { msg: errorMessage };
};

export const requiredValidator = (customErrorMessage) => (value) => {
    const defaultMessage = 'This field is required';
    const errorMessage = customErrorMessage || defaultMessage;
    if (value && typeof value === 'object' && 'day' in value && 'month' in value && 'year' in value) {
        // Verifica que cada parte de la fecha no esté vacía
        if (birthadyValidator(value)) {
            return null; // Todos los campos de la fecha están completos
        } else {
            return { msg: errorMessage }; // Algunos campos de la fecha están vacíos
        }
    }



    if (value) {
        return null;
    }
    return { msg: errorMessage };
};

export const priceValidator = (customErrorMessage) => (value) => {
    const defaultMessage = 'Please enter a valid positive price';
    const errorMessage = customErrorMessage || defaultMessage;

    //Verificar si es un caracter especial, excepto el punto y números
    const regex = /^[0-9.]+$/;
    if (!regex.test(value)) {
        return { msg: errorMessage };
    }
    // Si hay valores así 02222 sin el punto delante, se elimina el 0
    const regex2 = /^0[0-9]+$/;
    if (regex2.test(value)) {
        return { msg: errorMessage };
    }

    // Convertir el valor a un número flotante para manejar precios con decimales
    const numericValue = parseFloat(value);

    // Verificar si el valor es un número y es mayor o igual a cero
    if (!isNaN(numericValue) && numericValue >= 0) {
        return null; // Valor válido
    }

    // En caso de que no sea un número o sea negativo, retornar el mensaje de error
    return { msg: errorMessage };
}


// Validación de rango de longitud con mensaje personalizable
export const rangeValidator = (value, min, max, errorMessage = `Length must be between ${min} and ${max}`) => {
    if (value.length < min || value.length > max) {
        return {msg: errorMessage};
    }
   
    return null;
};

// Validación de email con mensaje personalizable
export const emailValidator = (value, errorMessage = 'Please enter a valid email') => {
    if (!value) return null;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
        return {msg: errorMessage};
    }
    return null;
};

export const expirationDateValidator = (value) => {

    const regex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    const dateString = value;

    if (regex.test(dateString)) {
        return null;
    } else {
        return {msg: "La fecha no es válida."};
    }

    return null;
};


export const getValidateStatus = (formData, formErrors, touchedFields, fieldName) => {

    if (!touchedFields[fieldName]) {
        return ""; // No mostrar estado si el campo no ha sido tocado
    }
    if (formErrors[fieldName]) {
        return "error"; // Mostrar error si hay un mensaje de error
    }
    if (fieldName === 'birthday') {
        // Verifica si todos los componentes de la fecha están presentes
        if(birthadyValidator(formData[fieldName]) === true){
            return "success"; // Mostrar éxito si el campo ha sido tocado y no hay errores
        }else{
            return "error"; // Mostrar error si hay un mensaje de error
        }

    }
    if (formData[fieldName]) {
        return "success"; // Mostrar éxito si el campo ha sido tocado y no hay errores
    }
    return ""; // No mostrar estado en otros casos
};


// Validación de fecha de nacimiento con mensaje personalizable
export const birthadyValidator = (_birthday) => {

    if(!_birthday){
        return null;
    }
    //const birthday = formData[fieldName];
    const birthday = _birthday;
    if (birthday && birthday.day && birthday.month && birthday.year) {

        // Construye una cadena de fecha en formato YYYY-MM-DD y verifica si es válida
        const birthdayStr = `${birthday.year}-${String(birthday.month).padStart(2, '0')}-${String(birthday.day).padStart(2, '0')}`;
        const parsedDate = new Date(birthdayStr);
        const currentDate = new Date();
        const pastDate = new Date();
        pastDate.setFullYear(pastDate.getFullYear() - 120); // Fecha de hace 120 años
        const isValidDate = !isNaN(parsedDate.getTime());
        const isPastDate = parsedDate.getTime() < currentDate.getTime();
        const isNotTooOldDate = parsedDate.getTime() > pastDate.getTime();
        if (!isValidDate) {
            return false; // Mostrar error si la fecha no es válida
        }
        if (!isPastDate) {
            return false; // Mostrar error si la fecha es futura
        }
        if (!isNotTooOldDate) {
            return false; // Mostrar error si la fecha es más de 120 años en el pasado
        }

        if (isValidDate && isPastDate && isNotTooOldDate){
            return true; // Mostrar éxito si la fecha es válida
        }
        else{
            return false; // Mostrar error si la fecha no es válida
        }



    } else {


        return false; // Mostrar error si la fecha no está completa
    }
};

// verificar si la fecha es válida o no
export const validateBirthdayCurrentValue = (value, errorMessage = 'Please enter your birthday') => {
    if (birthadyValidator(value,"birthday") === false) {
        return errorMessage;
    }
    return null;
}