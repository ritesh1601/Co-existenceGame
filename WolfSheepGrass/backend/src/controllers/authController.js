const authService = require("../services/authService");

async function googleLogin(req, res) {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required"
            });
        }

        const result = await authService.authenticateWithGoogle(credential);

        res.status(200).json({
            message: "Login successful",
            token: result.token,
            user: result.user
        });

    } catch (error) {
        console.error("Google authentication error:", error);

        res.status(401).json({
            message: "Google authentication failed"
        });
    }
}

async function getCurrentUser(req, res) {
    try {
        const userId = Number(req.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                message: "Invalid authenticated user"
            });
        }

        const user = await authService.getCurrentUser(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            message: "Could not get current user"
        });
    }
}

module.exports = {
    googleLogin,
    getCurrentUser
};