import { signInUser, loginUser } from "../services/authService.js";

export const SignIn = async (req, res) => {
  try {
    const user = await signInUser(req.body);

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token: data.token,
      user: data.user,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};