import bcrypt from "bcrypt";

export const register = async (req, res) => {

  try {
    //1.check if we have received the data
    console.log("received data: \n", req.body);

    //2. Destructure the data
    const { username, email, password } = req.body;

    //3.Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Hashed password: ${hashedPassword}`);

    //4. save the password to the databse
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {};
export const logout = async (req, res) => {};



