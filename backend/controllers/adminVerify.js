const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  } 
  else {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("error" + err);
        return res.status(402).json({ error: "Unauthorized: Invalid token" });
      }
      //   next();
      else {
        const isAdmin = decoded.isAdmin;
        return res.status(200).json({isAdmin:isAdmin});
      }
    });
  }
};
module.exports = verifyToken;
