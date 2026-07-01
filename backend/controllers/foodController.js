import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import { localDb } from "../config/localDb.js";

// add food items

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  try {
    let userData = global.useLocalDB
      ? localDb.findById("users", req.body.userId)
      : await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      if (global.useLocalDB) {
        localDb.save("foods", {
          name: req.body.name,
          description: req.body.description,
          price: Number(req.body.price),
          category: req.body.category,
          image: image_filename,
        });
      } else {
        const food = new foodModel({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          image: image_filename,
        });
        await food.save();
      }
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = global.useLocalDB
      ? localDb.find("foods")
      : await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    let userData = global.useLocalDB
      ? localDb.findById("users", req.body.userId)
      : await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      let food;
      if (global.useLocalDB) {
        food = localDb.findById("foods", req.body.id);
        if (food) {
          fs.unlink(`uploads/${food.image}`, () => {});
          localDb.findByIdAndDelete("foods", req.body.id);
        }
      } else {
        food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => {});
        await foodModel.findByIdAndDelete(req.body.id);
      }
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
