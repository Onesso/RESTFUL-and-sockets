import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import jsonwebtokensecretkey from "../secrete.js";

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

