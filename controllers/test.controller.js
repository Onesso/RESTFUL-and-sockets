import jwt from "jsonwebtoken";
import jsonwebtokensecretkey from "../secrete.js";

export const shouldbeloggedin = async (req, res) => {
  console.log(req.userID);
  return res.status(200).json({ message: "You are authenticated" });
};

export const shouldbeadmin = async (req, res) => {
  const token = req.cookies.token;

  //1. check if the token exists
  if (!token) {
    return res.status(401).json({ message: "You are not Logged in" });
  }

  //2. verify the token
  //payload is the user.id which is stored in the token
  //if the token is valid, the payload will be the user.id
  jwt.verify(token, jsonwebtokensecretkey, async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    if (!payload.isAdmin) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    return res.status(200).json({ message: "You are authenticated" });
  });
};
