import { Case } from "../models/case.model.js";
import { Detainee } from "../models/detainee.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generate.token.js";

export const detaineeSignup = async (req, res) => {
  try {
    const existingUser = await Detainee.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username }
      ]
    });

    if (existingUser) {
      const field =
        existingUser.email === req.body.email
          ? "Email"
          : "Username";
      return res.status(400).json({
        message: `${field} already registered!`,
        success: false
      });
    }

    const requiredFields = ["name", "address", "email", "username", "password"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
        success: false
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const detainee = new Detainee({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword
    });

    await detainee.save();

    const token = generateToken(
      { username: detainee.username },
      detainee.email,
      detainee.username
    );

    res.status(201).json({
      message: "Detainee account created successfully!",
      user: {
        name: detainee.name,
        username: detainee.username,
        email: detainee.email
      },
      token,
      success: true
    });
  } catch (error) {
    console.error("Detainee Signup Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

export const detaineeLogin = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        message: "Missing required fields.",
        success: false
      });
    }

    const query = emailOrUsername.includes("@")
      ? { email: emailOrUsername }
      : { username: emailOrUsername };

    const detainee = await Detainee.findOne(query).select("+password");

    if (!detainee) {
      return res.status(404).json({
        message: "Detainee not found.",
        success: false
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, detainee.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password.",
        success: false
      });
    }

    const token = generateToken(
      { username: detainee.username },
      detainee.email,
      detainee.username
    );

    res.status(200).json({
      message: "Login successful!",
      user: {
        name: detainee.name,
        username: detainee.username,
        email: detainee.email
      },
      token,
      success: true
    });
  } catch (error) {
    console.error("Detainee Login Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

export const getOngoingCases = async (req, res) => {
    try {
        const { username } = req.params;

        const detainee = await Detainee.findOne({ username }).lean();
        if (!detainee || !detainee.caseIds || detainee.caseIds.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const cases = await Case.find({
            caseId: { $in: detainee.caseIds },
            bailStatus: { $in: ["", "Pending to judge", "Pending to lawyer", "Accepted", "Declined"] }
        }).sort({ filingDate: -1 });

        res.status(200).json({
            success: true,
            data: cases
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

export const raiseBail = async (req, res) => {
    try {
        const { caseid } = req.params;
        const updatedCase = await Case.findOneAndUpdate(
            { caseId: caseid },
            { $set: { bailStatus: "Pending to lawyer" } },
            { new: true }
        );

        if (!updatedCase) {
            return res.status(404).json({
                success: false,
                message: "Case not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedCase
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};