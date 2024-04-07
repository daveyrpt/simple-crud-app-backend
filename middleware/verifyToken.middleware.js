import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklistToken.model.js";

export const verifyToken = async(req, res, next) => {

/*     const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    } else {
        res.sendStatus(401);
    } */

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);
   
    const blacklistedToken = await BlacklistToken.findOne({
        where: {
            token: token
        }
    });

if (blacklistedToken) return res.sendStatus(403);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);     
        req.email = decoded.email;
        next();     
    })
}