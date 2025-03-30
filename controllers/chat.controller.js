import prisma from "../lib/prisma.js";

// description of getting the receiver user information
// For each chat:
// a. Finds the ID of the other participant (receiver)
// b. Fetches the receiver's profile (id, username, avatar)
// c. Adds the receiver's info to the chat object

export const getChats = async (req, res) => {
  const tokenUserID = req.userID;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserID],
        },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserID);

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },

        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      chat.receiver = receiver;
    }

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get chats" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserID = req.userID;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserID],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserID],
        },
      },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get chat" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserID = req.userID;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserID, req.body.receiverId],
      },
    });

    res.status(200).json(newChat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add chat" });
  }
};
export const readChat = async (req, res) => {
  const tokenUserID = req.userID;
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserID],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserID],
        },
      },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to read chat" });
  }
};
