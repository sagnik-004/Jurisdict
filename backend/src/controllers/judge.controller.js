import { Judge } from "../models/judge.model.js";
import { Case } from "../models/case.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generate.token.js";

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
      const field =
        existingUser.email === req.body.email
          ? "Email"
          : existingUser.username === req.body.username
          ? "Username"
          : "Judge ID";
      return res.status(400).json({ message: `${field} already registered!` });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const judge = new Judge({
      ...req.body,
      password: hashedPassword,
    });

    await judge.save();

    const token = generateToken(
      { judgeId: judge.judgeId },
      judge.email,
      judge.username
    );

    const userData = {
      name: judge.name,
      username: judge.username,
      judgeId: judge.judgeId,
    };

    res.status(201).json({
      message: "Judge account created successfully!",
      user: userData,
      token,
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

    const token = generateToken(
      { judgeId: judge.judgeId },
      judge.email,
      judge.username
    );

    const userData = {
      name: judge.name,
      username: judge.username,
      judgeId: judge.judgeId,
    };

    res.status(200).json({
      message: "Login successful!",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Judge Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOngoingCases = async (req, res) => {
  try {
    const { judgeid } = req.params;

    const judge = await Judge.findOne({ judgeId: judgeid });

    if (!judge) {
      return res.status(404).json({ message: "Judge not found", success: false });
    }

    if (!judge.caseIds || !judge.caseIds.length) {
      return res.status(200).json({ message: "No cases found for this judge.", cases: [] });
    }

    const cases = await Case.find({ caseId: { $in: judge.caseIds } }).sort({ filingDate: -1 });

    res.status(200).json({ message: "Cases fetched successfully", cases, success: true });
  } catch (error) {
    console.error("Error fetching cases for judge:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
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

export const decideBail = async(req, res) => {
  try {
    const { caseid } = req.params;
    const { bailDecision, judgeComments, aiResponse } = req.body;

    const commentsArray = judgeComments 
      ? judgeComments.split(";").map(c => c.trim()).filter(c => c !== "")
      : [];

    const updatedCase = await Case.findOneAndUpdate(
      { caseId : caseid },
      { bailStatus : bailDecision },
      { judgeComments: commentsArray },
      { aiRecommendation: aiResponse },
      { new : true }
    );

    if (! updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json({ message: "Bail decided", updatedCase });
    
  } catch (error) {
    console.error("Error deciding bail:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};