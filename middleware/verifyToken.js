import jwt from "jsonwebtoken";
import jsonwebtokensecretkey from "../secrete.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  //1. check if the token exists
  if (!token) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  //2. verify the token
  jwt.verify(token, jsonwebtokensecretkey, async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    //requesting user id
    req.userID = payload.id;

    // return res.status(200).json({ message: "You are authenticated" });

    next();
  });
};
