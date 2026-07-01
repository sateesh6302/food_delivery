import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { localDb } from "../config/localDb.js";

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = global.useLocalDB
      ? localDb.findOne("users", { email })
      : await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch =await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const role=user.role;
    const token = createToken(user._id);
    res.json({ success: true, token,role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create token

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // checking user is already exist
    const exists = global.useLocalDB
      ? localDb.findOne("users", { email })
      : await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // hashing user password

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (global.useLocalDB) {
      user = localDb.save("users", {
        name,
        email,
        password: hashedPassword,
        role: role || "user"
      });
    } else {
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      });
      user = await newUser.save();
    }
    const token = createToken(user._id);
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
