class AuthController {
    validateToken(req, res) {
        res.status(200).json({ valid: true });
    }
}

module.exports = new AuthController();
