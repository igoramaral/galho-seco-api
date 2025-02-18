const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    // Extracts token in the format "Bearer <token>"
    const token = authHeader.split(" ")[1]; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // saves user Id in the request for later use
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};