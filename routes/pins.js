import express from "express";
import Pin from "../models/Pins.js";

const router = express.Router();

//CREATE A PIN
router.post("/", async (req, res) => {
  const newPin = await Pin.create(req.body);

  try {
    const savedPin = await newPin.save();

    res.status(200).json({ result: savedPin });
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL PINS
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();

    res.status(200).json({ result: pins });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
