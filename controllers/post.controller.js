import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import jsonwebtokensecretkey from "../secrete.js";
import braintree from "braintree";

export const getPosts = async (req, res) => {
  const query = req.query;
  console.log(query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ message: "Page not found" });

    //added code: to check if you are logged in so that you can get your saved post
    const token = req.cookies?.token;
    if (!token) return res.status(200).json({ ...post, isSaved: false });

    // Verify token synchronously
    try {
      const payload = jwt.verify(token, jsonwebtokensecretkey);
      const saved = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            postId: id,
            userId: payload.id,
          },
        },
      });
      return res.status(200).json({ ...post, isSaved: !!saved });
    } catch (error) {
      return res.status(200).json({ ...post, isSaved: false });
    }
    // if (token) {
    //   jwt.verify(token, jsonwebtokensecretkey, async (err, payload) => {
    //     if (!err) {
    //       const saved = await prisma.savedPost.findUnique({
    //         where: {
    //           userId_postId: {
    //             postId: id,
    //             userId: payload.id,
    //           },
    //         },
    //       });
    //       res.status(200).json({ ...post, isSaved: saved ? true : false });
    //     }
    //   });
    // }

    // res.status(200).json({ ...post, isSaved: false });
  } catch (error) {
    console.log(error);
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  console.log("received the requestbody to add post", body);
  const tokenuserId = req.userID;
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenuserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenuserId = req.userID;
  const { postData, postDetail } = req.body;

  // Input validation
  if (!postData || typeof postData !== "object") {
    return res.status(400).json({ message: "Invalid post data" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: { postDetail: true },
    });
    console.log("Post is found: ", post);
    if (!post) {
      console.log("Post not found");
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.postDetail) console.log("No details available"); // Handle optional case
    //if the product is found, we are checking if it belong to the user who want to update.
    if (post.userId !== tokenuserId) {
      return res.status(403).json({ message: "Not authorized" });
    } // Update Post

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
      },
    }); // Update PostDetail if exists

    if (post.postDetail) {
      await prisma.postDetail.update({
        where: { postId: id },
        data: {
          ...postDetail,
        },
      });
    } else if (postDetail) {
      // Create new PostDetail if it doesn't exist but postDetail is provided
      await prisma.postDetail.create({
        data: {
          ...postDetail,
          postId: id,
        },
      });
    }

    res.status(200).json({ message: "Post updated successfully", updatedPost });
    console.log("Post updated successfully", updatedPost);
  } catch (error) {
    console.log("Error from updating post: ", error);
    return res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenuserId = req.userID;

  console.log("from delete endpoint token id: ", tokenuserId);

  // try {
  //   //checking if there is such a product
  //   const post = await prisma.post.findUnique({
  //     where: { id: id },
  //     include: { postDetail: true },
  //   });

  //   console.log("Post is found: ", post);

  //   if (!post) return res.status(404).json({ message: "Post not found" });
  //   if (!post.postDetail) console.log("No details available"); // Handle optional case

  //   //if the product is found, we are checking if it belong to the user who want to update.
  //   if (post.userId !== tokenuserId) {
  //     return res.status(403).json({ message: "Not authorized" });
  //   }

  //   await prisma.savedPost.deleteMany({ where: { postId: id } }); // delete saved post to

  //   await prisma.postDetail.deleteMany({
  //     where: {
  //       postId: id,
  //     },
  //   });

  //   //delete the post
  //   await prisma.post.delete({
  //     where: { id: id },
  //   });
  //   console.log("deleted runned");
  //   res.status(200).json({ message: "Post deleted" });
  // } catch (error) {
  //   console.log("error in delete post: ", error);
  //   res.status(500).json({ message: "post not deleted" });
  // }
  try {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: { postDetail: true },
    });

    console.log("Post is found: ", post);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.postDetail) console.log("No details available");

    // Authorization check
    if (post.userId !== tokenuserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Use a transaction to ensure all deletions succeed or fail together
    await prisma.$transaction([
      // 1. First delete all receipts associated with this post
      prisma.receipt.deleteMany({ where: { postId: id } }),

      // 2. Delete all saved posts referencing this post
      prisma.savedPost.deleteMany({ where: { postId: id } }),

      // 3. Delete the post detail if it exists
      prisma.postDetail.deleteMany({ where: { postId: id } }),

      // 4. Finally delete the post itself
      prisma.post.delete({ where: { id: id } }),
    ]);

    console.log("Post and all related data deleted successfully");
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log("Error in delete post: ", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

//payment processing

//account variables
const BRAINTREE_MERCHANT_ID = "yb7kbmcx42fp45kd";
const BRAINTREE_PULIC_KEY = "jgt4rm8vvtxt33m5";
const BRAINTREE_PRIVATE_KEY = "0993c60ff1f861198eacacf3b7c8f9f1";

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: BRAINTREE_MERCHANT_ID,
  publicKey: BRAINTREE_PULIC_KEY,
  privateKey: BRAINTREE_PRIVATE_KEY,
});

export const getToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (error, responce) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(responce);
        // console.log(responce);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const processPayment = async (req, res) => {
  try {
    const { nonce, amount } = req.body;

    const result = await gateway.transaction.sale({
      amount: amount.toString(),
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
    });

    if (result.success) {
      res.json({ success: true, transaction: result.transaction });
      console.log("went through", result.transaction);
    } else {
      console.log("Processor response:", result.transaction);
      res.status(400).json({
        error: result.message,
        processorResponse: result.processorResponseText,
        // verification: result.creditCardVerification,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSettlementReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate dates
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
    ) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    const summary = await gateway.settlementBatch.summary(startDate, endDate, {
      includeRecords: true,
    });

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      debug: {
        sdkVersion: braintree.version,
        merchantId: process.env.BRAINTREE_MERCHANT_ID?.slice(0, 4) + "...",
      },
    });
  }
};

export const checkPropertyStatus = async (req, res) => {
  const id = req.params.id;
  const tokenuserId = req.userID;
  try {
   
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: { postDetail: true },
    });
    if (!post) {
      console.log("Post not found; to check if iti is taken or not");
      return res.status(404).json({ message: "Page not found" });
    }
    if (post.userId !== tokenuserId) {
      console.log("Not authorized to check property status");
      return res.status(403).json({ message: "Not authorized" });
    }
    // check if the post is already taken for
    if (post.isTaken) {
      return res.status(200).json({
        message: "Property is already taken",
        status: "taken",
        isTaken: post.isTaken,
      });
    } else {
      return res.status(200).json({
        message: "Property is available",
        status: "available",
        isTaken: post.isTaken,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error; on checking isTaken" });
  }
};

export const updatePropertyStatus = async (req, res) => {
  const id = req.params.id;
  const tokenuserId = req.userID;
  const { isTaken } = req.body;



  // Input validation
  if (typeof isTaken !== "boolean") {
    return res.status(400).json({ message: "isTaken must be a boolean value" });
  }

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) return res.status(404).json({ message: "Page not found" });
    // Authorization check
    if (post.userId !== tokenuserId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (post.isTaken === isTaken) {
      return res.status(200).json({
        message: `Property already ${isTaken ? "taken" : "available"}`,
        post,
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { isTaken },
    });

    return res.status(200).json({
      message: `Property status updated to ${isTaken ? "taken" : "available"}`,
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: "Database error" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
