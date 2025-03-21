export const register = async (req, res) => {
  try {
    //1.check if we have received the data
    console.log(`data received: ${req.body}`);

    //2. Destructure the data
    const { username, email, password } = req.body;
















    
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {};
export const logout = async (req, res) => {};
