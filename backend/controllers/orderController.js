import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import { localDb } from "../config/localDb.js";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const snsClient = new SNSClient({ region: "eu-north-1" });

const sendSMS = async (phoneNumber, message) => {
  try {
    if (!phoneNumber) return;
    const cleanPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
    console.log(`Sending SMS to ${cleanPhone}: ${message}`);
    const command = new PublishCommand({
      PhoneNumber: cleanPhone,
      Message: message,
    });
    const response = await snsClient.send(command);
    console.log("SMS sent successfully, MessageId:", response.MessageId);
  } catch (error) {
    console.error("Error sending SMS via SNS:", error.message);
  }
};

// placing user order for frontend
const placeOrder = async (req, res) => {
  const host = req.get("host");
  const hostname = host ? host.split(":")[0] : "localhost";
  const frontend_url = ["localhost", "127.0.0.1"].includes(hostname) ? "http://localhost:5173" : `http://${hostname}`;
  try {
    let newOrder;
    if (global.useLocalDB) {
      newOrder = localDb.save("orders", {
        userId: req.body.userId,
        items: req.body.items,
        amount: req.body.amount,
        address: req.body.address,
        payment: false,
        status: "Food Processing",
        date: Date.now()
      });
      localDb.findByIdAndUpdate("users", req.body.userId, { cartData: {} });
    } else {
      newOrder = new orderModel({
        userId: req.body.userId,
        items: req.body.items,
        amount: req.body.amount,
        address: req.body.address,
      });
      await newOrder.save();
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    }

    // Send SMS alert to user's registered phone number
    try {
      const userData = global.useLocalDB
        ? localDb.findById("users", req.body.userId)
        : await userModel.findById(req.body.userId);
      if (userData && userData.phone) {
        await sendSMS(userData.phone, "The order placed is successfully");
      }
    } catch (err) {
      console.error("Failed to fetch user phone or send SMS:", err.message);
    }

    // Direct success return for direct order placement checkout flow
    return res.json({ success: true, message: "The order placed is successfully", orderId: newOrder._id });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      if (global.useLocalDB) {
        localDb.findByIdAndUpdate("orders", orderId, { payment: true });
      } else {
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
      }
      res.json({ success: true, message: "Paid" });
    } else {
      if (global.useLocalDB) {
        localDb.findByIdAndDelete("orders", orderId);
      } else {
        await orderModel.findByIdAndDelete(orderId);
      }
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = global.useLocalDB
      ? localDb.find("orders", { userId: req.body.userId })
      : await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin pannel
const listOrders = async (req, res) => {
  try {
    let userData = global.useLocalDB
      ? localDb.findById("users", req.body.userId)
      : await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      const orders = global.useLocalDB
        ? localDb.find("orders")
        : await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    let userData = global.useLocalDB
      ? localDb.findById("users", req.body.userId)
      : await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      if (global.useLocalDB) {
        localDb.findByIdAndUpdate("orders", req.body.orderId, { status: req.body.status });
      } else {
        await orderModel.findByIdAndUpdate(req.body.orderId, {
          status: req.body.status,
        });
      }
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
