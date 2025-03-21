import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

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
export const login = async (req, res) => {};
export const logout = async (req, res) => {};
