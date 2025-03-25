import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

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
  const id = req.params.id;
  try {
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
  const id = req.params.id; //the one we want to update
  const tokenUserId = req.userID;

  //after verifying user is the owner of the account, get the data user want to update
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  //intially password in null
  let updatedPassword = null;

  try {
    //check if the name wanting to update is already taken.
    if (inputs.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: inputs.username,
          NOT: {
            id: id,
          },
        },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Name Already taken" });
      }
    }

    //if password is in the req.body hash it
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
    //now apdate the user account
    const updateduser = await prisma.user.update({
      where: { id: id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    //to prevent sending password to the user
    const {password: userPassword, ...rest} = updateduser;

    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update users" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id; //the one we want to update
  const tokenUserId = req.userID;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not authorized" });
  }
  try {
    await prisma.user.delete({
      where: { id: id },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete users" });
  }
};
