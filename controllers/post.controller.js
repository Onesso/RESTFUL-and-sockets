import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
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
    res.status(200).json(post);
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
