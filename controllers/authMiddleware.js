const config = require("../config/index.json");
const { verify } = require("jsonwebtoken");
const { AES, enc } = require("crypto-js");

const auth = async (req, res, next) => {
    const token = req.header('auth-user');
    if (!token) {
        return res.status(401).json({ Error: "UnAuthorized. No Access Header" });
    }
    try {
        const bytes = AES.decrypt(token, config.CRYPTO_KEY);
        const originalToken = bytes.toString(enc.Utf8);
        const decoded = await verify(originalToken, config.SECRET_KEY);
        if (decoded.role === 'customer') {
            req.customer = decoded;
        } else {
            req.admin = decoded;
        }
        next();

    } catch (err) {
        res.json({ Error: "Token Expired. Login Again" });
    }
}

module.exports = auth;