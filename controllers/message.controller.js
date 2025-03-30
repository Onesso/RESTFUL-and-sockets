import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserID = req.userID;
  const chatId = req.params.chatId;
  const text = req.body.text;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserID],
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserID,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserID],
        lastMessage: text,
      },
    });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add message" });
  }
};
