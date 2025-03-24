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
  const body = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    //check if the name wanting to update is already taken.
    if (body.username) {
      const existingUser = await prisma.user.findUnique({
        where: {
          username: body.username,
          NOT: {
            id: id, //
          },
        },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Name Already taken" });
      }
    }
    //now apdate the user account
    const updateduser = await prisma.user.update({
      where: { id: id },
      data: body,
    });

    res.status(200).json(updateduser);
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
