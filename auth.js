function validateCredentials(username, password) {
    if (!username || !password) {
        return {
            success: false,
            message: "Missing fields"
        };
    }

    return {
        success: true,
        message: "Valid input"
    };
}

module.exports = { validateCredentials };