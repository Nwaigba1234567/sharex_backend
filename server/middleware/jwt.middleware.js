const { expressjwt: jwt } = require("express-jwt");

const getTokenFromHeaders = (req) => {
    console.log(req.headers, process.env.TOKEN_SECRET);

    if (
        req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        const token = req.headers.authorization.split(" ")[1];
        return token;
    } else {
        return null;
    }
};

const isAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: getTokenFromHeaders,
});

module.exports = { isAuthenticated };