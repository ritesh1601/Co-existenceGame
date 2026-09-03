const authService = require("../services/authService");

async function googleLogin(req, res) {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required"
            });
        }

        const user = await authService.authenticateWithGoogle(credential);

        res.status(200).json({
            message: "Login successful",
            user: user
        });

    } catch (error) {
        console.error("Google authentication error:", error);

        res.status(401).json({
            message: "Google authentication failed"
        });
    }
}

module.exports = {
    googleLogin
};