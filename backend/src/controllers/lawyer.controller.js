import { Case } from "../models/case.model.js";
import { Lawyer } from "../models/lawyer.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generate.token.js";

export const lawyerSignup = async (req, res) => {
  try {
    const existingUser = await Lawyer.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username },
        { lawyerId: req.body.lawyerId }
      ]
    });

    if (existingUser) {
      const field =
        existingUser.email === req.body.email
          ? "Email"
          : existingUser.username === req.body.username
          ? "Username"
          : "Lawyer ID";
      return res.status(400).json({
        message: `${field} already registered!`,
        success: false
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const lawyer = new Lawyer({
      name: req.body.name,
      lawyerId: req.body.lawyerId,
      email: req.body.email,
      address: req.body.address,
      username: req.body.username,
      password: hashedPassword
    });

    await lawyer.save();

    const token = generateToken(
      { lawyerId: lawyer.lawyerId },
      lawyer.email,
      lawyer.username
    );

    res.status(201).json({
      message: "Lawyer created successfully!",
      user: {
        name: lawyer.name,
        username: lawyer.username,
        lawyerId: lawyer.lawyerId,
        email: lawyer.email
      },
      token,
      success: true
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

export const lawyerLogin = async (req, res) => {
  try {
    const { usernameOrLawyerId, password } = req.body;

    if (!usernameOrLawyerId || !password) {
      return res.status(400).json({
        message: "Missing required fields.",
        success: false
      });
    }

    const orConditions = [
      { email: usernameOrLawyerId },
      { username: usernameOrLawyerId }
    ];

    const numericId = Number(usernameOrLawyerId);
    if (!isNaN(numericId)) {
      orConditions.push({ lawyerId: numericId });
    }

    const lawyer = await Lawyer.findOne({
      $or: orConditions
    }).select("+password");

    if (!lawyer) {
      return res.status(404).json({
        message: "Lawyer not found.",
        success: false
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, lawyer.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password.",
        success: false
      });
    }

    const token = generateToken(
      { lawyerId: lawyer.lawyerId },
      lawyer.email,
      lawyer.username
    );

    res.status(200).json({
      message: "Login successful!",
      user: {
        name: lawyer.name,
        username: lawyer.username,
        lawyerId: lawyer.lawyerId,
        email: lawyer.email
      },
      token,
      success: true
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

export const getOngoingCases = async (req, res) => {
  try {
    const { lawyerid } = req.params;

    if (!lawyerid) {
      return res.status(400).json({ message: "Lawyer ID is required", success: false });
    }

    const lawyer = await Lawyer.findOne({ lawyerId: lawyerid });

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found", success: false });
    }

    if (!lawyer.caseIds || !lawyer.caseIds.length) {
      return res.status(404).json({ message: "No ongoing cases found", cases: [], success: false });
    }

    const cases = await Case.find({ caseId: { $in: lawyer.caseIds } });

    res.status(200).json({
      message: "Ongoing cases fetched successfully!",
      cases,
      success: true
    });

  } catch (error) {
    console.error("Error fetching ongoing cases:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const forwardToJudge = async (req, res) => {
  try {
    const { caseid } = req.params;

    const updatedCase = await Case.findOneAndUpdate(
      { caseId: caseid },
      { bailStatus: "Pending to judge" },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found", success: false });
    }

    res.status(200).json({ message: "Case forwarded to judge successfully", case: updatedCase, success: true });
  } catch (error) {
    console.error("Error forwarding case to judge:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};