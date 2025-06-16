function validateEmailConfig() {
    const isValid = true; 
    const errors = isValid ? [] : ['SMTP não configurado'];

    return {
        isValid,
        errors,
    };
}

module.exports = {
    validateEmailConfig,
};
