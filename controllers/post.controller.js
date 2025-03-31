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
  try {
    res.status(200).json();
  } catch (error) {
    console.log(error);
  }
};
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenuserId = req.userID;
  try {
    //checking if there is such a product
    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    //if the product is found, we are checking if it belong to the user who want to update.
    if (post.userId !== tokenuserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //delete the post
    await prisma.post.delete({
      where: { id: id },
    });
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
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
    console.log("this is the rent: ", amount);
    const result = await gateway.transaction.sale({
      amount: amount.toString(),
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
    });

    if (result.success) {
      res.json({ success: true });
      console.log("went through");
    } else {
      console.log("Processor response:", result);
      res.status(400).json({
        error: result.message,
        processorResponse: result.processorResponseText,
        verification: result.creditCardVerification,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
