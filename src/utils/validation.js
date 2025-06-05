// Utilitários de validação
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const validateRequired = (fields, data) => {
    const missing = []

    fields.forEach((field) => {
        if (!data[field] || data[field].toString().trim() === "") {
            missing.push(field)
        }
    })

    return missing
}

export const sanitizeInput = (input) => {
    if (typeof input !== "string") return input

    return input
        .trim()
        .replace(/[<>]/g, "") // Remove caracteres HTML básicos
        .substring(0, 255) // Limita tamanho
}
