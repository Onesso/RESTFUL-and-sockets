import prisma from "../lib/prisma.js";

export const createReceipt = async (req, res) => {
  const {
    merchantName,
    address,
    transactionType,
    amount,
    paymentMethod,
    cardType,
    cardNumber,
    cardholder,
    property,
    propertyType,
    propertyPayment,
    postId,
  } = req.body;
  const userId = req.params.id;
//   const postId = req.body.postId; // This is the property that the user is renting or buying
  const tokenuserId = req.userID; // This is the buyer/renter of the property => is is from the token.

  console.log("received the requestbody to add receipt", req.body);
  console.log("userId from params", userId);
  console.log("userId from token", tokenuserId);

  try {
    //valiation
    if (!userId || !postId || !amount || !transactionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify user and post exist
    const [user, post] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.post.findUnique({ where: { id: postId } }),
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newReceipt = await prisma.receipt.create({
      data: {
        merchantName,
        address,
        transactionType,
        amount,
        paymentMethod,
        cardType,
        cardNumber,
        cardholder,
        property,
        propertyType,
        propertyPayment,
        userId,
        postId,
      },
    });
    res.status(200).json(newReceipt);

  } catch (err) {
    console.log(err);
  }
};

export const deleteReceipt = async (req, res) => {
    const id = req.params.id
}

export const getAllReceipts = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
};

export const getReceiptById = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
};


