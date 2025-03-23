import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jsonwebtokensecretkey = "damnfuckingshitdotenvisnotworking";

export const register = async (req, res) => {
  try {
    //1.check if we have received the data
    console.log("received data: \n", req.body);

    //2. Destructure the data
    const { username, email, password } = req.body;

    //3.Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Hashed password: ${hashedPassword}`);

    //4. create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log("New user created: \n", newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create user" });
  }
};
export const login = async (req, res) => {
  //1. get the data from the client and destructure it
  const { username, password } = req.body;
  try {
    //2. check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //3. compare the provided password with the hashed password
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //4. create a cookie
    // send the cookie to the client with the response;

    const age = 1000 * 60 * 60 * 24 * 7; // miliseconds converted to a week

    const token = jwt.sign(
      {
        id: user.id,
        // isAdmin: user.isAdmin,
        isAdmin: false,
      },
      jsonwebtokensecretkey,
      {
        expiresIn: age,
      }
    );

    const { password: userpassword, ...userInfo } = user; //living the password and returing the rest of the user info to the client

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,  set to true in production use https
        maxAge: age,
      })
      .status(200)
      .json({ userInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login" });
  }
};
export const logout = async (req, res) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to logout" });
  }
};
