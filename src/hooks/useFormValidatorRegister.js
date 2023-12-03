const useFormValidator = (fields) => {
    const isValid = fields.every(field => field.error === null);
    return { isValid };
};
export default useFormValidator;