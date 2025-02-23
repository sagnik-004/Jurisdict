import { Judge } from "../models/judge.model.js";
import { Case } from "../models/case.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const formatJudgeResponse = (judge) => ({
  id: judge._id,
  name: judge.name,
  username: judge.username,
  judgeId: judge.judgeId,
  createdAt: judge.createdAt,
});

export const judgeSignup = async (req, res) => {
  try {
    const existingUser = await Judge.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username },
        { judgeId: req.body.judgeId },
      ],
    });

    if (existingUser) {
      const field = existingUser.email === req.body.email
        ? "Email"
        : existingUser.username === req.body.username
        ? "Username"
        : "Judge ID";
      return res.status(400).json({
        message: `${field} already registered!`,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const judge = new Judge({
      ...req.body,
      password: hashedPassword,
    });
    await judge.save();

    const token = generateToken(judge._id, judge.email, judge.username);
    const userData = formatJudgeResponse(judge);

    res.status(201).json({
      message: "Judge account created successfully!",
      user: userData,
      token: token,
    });
  } catch (error) {
    console.error("Judge Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const judgeLogin = async (req, res) => {
  try {
    const { judgeIdOrUsername, password } = req.body;

    let judge = await Judge.findOne({ username: judgeIdOrUsername }).select("+password");
    if (!judge) {
      judge = await Judge.findOne({ judgeId: judgeIdOrUsername }).select("+password");
    }

    if (!judge) {
      return res.status(404).json({ message: "Judge not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, judge.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const token = generateToken(judge._id, judge.email, judge.username);
    const userData = formatJudgeResponse(judge);

    res.status(200).json({
      message: "Login successful!",
      user: userData,
      token: token,
    });
  } catch (error) {
    console.error("Judge Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCasesForJudge = async (req, res) => {
  try {
    const { username } = req.params;

    const cases = await Case.find({ judgeUsername: username }).sort({ filingDate: -1 });

    if (!cases || cases.length === 0) {
      return res.status(200).json({ message: "No cases found for this judge.", cases: [] });
    }

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases for judge:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBailAppeals = async (req, res) => {
  try {
    const { username } = req.params;

    const bailAppeals = await Case.find(
      { judgeUsername: username, bailStatus: "Pending to judge" },
      "caseId caseTitle detaineeName detaineeUsername groundsOfBail bailFilingDate judgeComments caseSummary status"
    ).sort({ filingDate: -1 });

    if (!bailAppeals || bailAppeals.length === 0) {
      return res.status(200).json({ message: "No bail appeals found for this judge.", bailAppeals: [] });
    }

    res.status(200).json(bailAppeals);
  } catch (error) {
    console.error("Error fetching bail appeals for judge:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDecidedCases = async (req, res) => {
  try {
    const { username } = req.params;

    const decidedCases = await Case.find(
      { judgeUsername: username, bailStatus: { $in: ["Accepted", "Declined"] } },
      "caseId caseTitle detaineeName detaineeUsername groundsOfBail bailFilingDate judgeComments caseSummary bailStatus"
    ).sort({ filingDate: -1 });

    if (!decidedCases || decidedCases.length === 0) {
      return res.status(200).json({ message: "No decided cases found for this judge.", decidedCases: [] });
    }

    res.status(200).json(decidedCases);
  } catch (error) {
    console.error("Error fetching decided cases for judge:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const bailDecision = async (req, res) => {
  try {
    const { caseId, status, comments } = req.body;

    if (!["Accepted", "Declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid bail status" });
    }

    const commentArray = comments ? comments.split(",").map(comment => comment.trim()) : [];

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      {
        bailStatus: status,
        judgeComments: commentArray,
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json({ message: "Bail decision updated successfully", case: updatedCase });
  } catch (error) {
    console.error("Error updating bail decision:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const judgeLogout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
