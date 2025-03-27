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
    const { password: userPassword, ...rest } = updateduser;

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

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userID;
  try {
    //searching for the post we want to save and its associated user
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    //the logic is that when you reach savepost, it saves the specific post and when you reach the endpoint again it deletes the post.
    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      return res.status(200).json({ message: "post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      return res.status(200).json({ message: "post saved" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userID;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });

    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get post!" });
  }
};
