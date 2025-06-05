const multer = require("multer")

const handleMulterError = (error, req, res, next) => {
    console.error("Multer error:", error)

    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File size too large. Maximum size is 10MB." })
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({ error: "Unexpected field name for file upload. Use 'image' as field name." })
        }
        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({ error: "Too many files. Only one file is allowed." })
        }
    }

    if (error.message === "Only image files (JPEG, PNG, GIF, WebP) are allowed!") {
        return res.status(400).json({ error: error.message })
    }

    // Log do erro para debug
    console.error("Unhandled error in file upload:", error)
    next(error)
}

// Middleware global para capturar erros de upload
const uploadErrorHandler = (req, res, next) => {
    // Log da requisição para debug
    if (req.file) {
        console.log("File upload details:", {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            size: req.file.size,
            hasBuffer: !!req.file.buffer,
            bufferLength: req.file.buffer ? req.file.buffer.length : 0,
        })
    }
    next()
}

module.exports = { handleMulterError, uploadErrorHandler }
