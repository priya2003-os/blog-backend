const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    // console.log("cookie", req );
    
    const token = req.cookies['jwt'];
    // console.log({tokenInMiddleware: token});
    
    if(!token) {
        return res.status(401).json({error: "Not Authorizeeeeeeeeeeed."});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log("REQ-USER", req.user);

        next();
    } catch(error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}

module.exports = { auth };
