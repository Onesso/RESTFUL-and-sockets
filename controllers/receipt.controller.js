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
  const id = req.params.id;
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: id },
    });
    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    } else {
      await prisma.receipt.delete({
        where: { id: id },
      });
      res.status(200).json({ message: "Receipt deleted successfully" });
    }
  } catch (err) {
    console.log(err);
  }
};

// export const getAllReceiptsBySellerId = async (req, res) => {
//     const sellerId = req.params.id;

//     try {
//       // Validate the sellerId exists
//       if (!sellerId) {
//         return res.status(400).json({ error: "Seller ID is required" });
//       }

//       // Check if seller exists
//       const seller = await prisma.user.findUnique({
//         where: { id: sellerId }
//       });

//       if (!seller) {
//         return res.status(404).json({ error: "Seller not found" });
//       }

//       // Get all receipts where the post was created by this seller
//       const receipts = await prisma.receipt.findMany({
//         where: {
//           post: {
//             userId: sellerId
//           }
//         },
//         include: {
//           post: true,    // Include post details
//           user: true     // Include buyer details (who made the payment)
//         },
//         orderBy: {
//           createdAt: 'desc' // Newest receipts first
//         }
//       });

//       if (receipts.length === 0) {
//         return res.status(200).json({ message: "No receipts found for this seller", receipts: [] });
//       }

//       res.status(200).json(receipts);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };

export const getAllReceiptsBySellerId = async (req, res) => {
  const sellerId = req.params.id;

  try {
    // 1. Validate input exists and is proper format
    if (!sellerId) {
      return res.status(400).json({ error: "Seller ID is required" });
    }

    // Add MongoDB ObjectID validation
    if (!/^[0-9a-fA-F]{24}$/.test(sellerId)) {
      return res.status(400).json({ error: "Invalid Seller ID format" });
    }

    // 2. Check if seller exists
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // 3. Get all receipts for this seller
    const receipts = await prisma.receipt.findMany({
      // Fixed typo from 'receipt' to 'receipt'
      where: {
        post: {
          userId: sellerId,
        },
      },
      include: {
        post: true, // Include post details
        user: true, // Include buyer details
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. Return appropriate response
    if (receipts.length === 0) {
      return res.status(200).json({
        message: "No receipts found for this seller",
        receipts: [],
      });
    }

    res.status(200).json(receipts);
  } catch (err) {
    console.error("Error in getAllReceiptsBySellerId:", err);

    // Handle specific Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2023") {
        return res.status(400).json({
          error: "Invalid ID format",
          details: err.meta,
        });
      }
      return res.status(500).json({
        error: "Database error",
        code: err.code,
      });
    }

    // Generic error fallback
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};
export const getReceipt = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
};
