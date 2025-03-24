import prisma from "../lib/prisma.js";

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get user" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.update
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update users" });
  }
};
export const deleteUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete users" });
  }
};
