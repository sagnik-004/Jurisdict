import { Lawyer } from "../models/lawyer.model.js";
import { Case } from "../models/case.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const lawyerSignup = async (req, res) => {
  try {
    const existingUser = await Lawyer.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username },
        { lawyerId: req.body.lawyerId },
      ]
    });

    if (existingUser) {
      const field = existingUser.email === req.body.email ? "Email" :
                   existingUser.username === req.body.username ? "Username" :
                   "Lawyer ID";
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
      password: hashedPassword,
    });

    await lawyer.save();

    const token = generateToken(lawyer._id, lawyer.email, lawyer.username);

    res.status(201).json({
      message: "Lawyer created successfully!",
      user: {
        id: lawyer._id,
        name: lawyer.name,
        username: lawyer.username,
        lawyerId: lawyer.lawyerId
      },
      token: token, // Send token in the response
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

    const token = generateToken(lawyer._id, lawyer.email, lawyer.username);

    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: lawyer._id,
        name: lawyer.name,
        username: lawyer.username,
        lawyerId: lawyer.lawyerId,
        email: lawyer.email
      },
      token: token, // Send token in the response
      success: true
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ 
      message: "Internal Server Error",
      success: false
    });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ 
    message: "Logout successful",
    success: true
  });
};

export const getOngoingCases = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    if (!lawyerId) {
      return res.status(400).json({ message: "Lawyer ID is required", success: false });
    }

    const cases = await Case.find({ lawyerId });

    if (!cases.length) {
      return res.status(404).json({ message: "No ongoing cases found", cases: [], success: false });
    }

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

export const getBailAppeals = async (req, res) => {
  try {
    const cases = await Case.find(
      { 
        lawyerId: req.params.lawyerId,
        bailStatus: "" // Assuming bailStatus is empty for new bail appeals
      },
      "caseId caseTitle detaineeName detaineeUsername groundsOfBail bailFilingDate judgeComments caseSummary status" // Select the same fields as the judge's getBailAppeals
    ).sort({ bailFilingDate: -1 }); // Sort by bailFilingDate in descending order

    res.status(200).json({ appeals: cases });
  } catch (error) {
    console.error("Error fetching bail appeals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPendingBails = async (req, res) => {
  try {
    const cases = await Case.find({ 
      lawyerId: req.params.lawyerId,
      bailStatus: "Pending to judge"
    });
    
    res.status(200).json({ pendingCases: cases });
  } catch (error) {
    console.error("Error fetching pending bails:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
