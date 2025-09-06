import { Case } from "../models/case.model.js";  
import { Judge } from "../models/judge.model.js"; 
import { Lawyer } from "../models/lawyer.model.js"; 
import { Detainee } from "../models/detainee.model.js";
import { axiosInstance } from "../utils/axios.js";

const generateRandomId = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const caseRegister = async (req, res) => {
    try {
        const {
            caseTitle,
            filingDate,
            courtName,
            policeStation,
            detaineeUsername,
            lawyerId: lawyerIdStr,
            judgeId: judgeIdStr,
            crimeType,
            bnsSections,
            severityOfOffence,
            allegedRole,
            caseSummary,
            accusedAge,
            medicalConditions,
            hasPermanentAddress,
            isEmployed,
            ownsProperty,
            hasLocalFamily,
            isSoleFamilyEarner,
            daysInDetention,
            hasPriorRecord,
            priorConvictionSections,
            historyOfViolence,
            holdsPassport,
            hasFinancialMeansToTravel,
            allegedOrganizedCrimeLinks,
            availableEvidence,
            witnessThreats,
            evidenceTampering,
        } = req.body;

        const caseId = generateRandomId(10);
        const existingCase = await Case.findOne({ caseId });
        if (existingCase) {
            return res.status(400).json({ message: "Generated Case ID already exists, please try again." });
        }
        
        if (caseSummary.length < 250) {
            return res.status(400).json({ message: "Case Summary must be at least 250 characters." });
        }

        const judgeId = parseInt(judgeIdStr, 10);
        if (isNaN(judgeId)) {
            return res.status(400).json({ message: "Invalid Judge ID. It must be an integer." });
        }

        const judgeDetails = await Judge.findOne({ judgeId });
        if (!judgeDetails) {
            return res.status(404).json({ message: "Judge not found" });
        }

        let lawyerDetails = null;
        let lawyerId = null;
        if (lawyerIdStr) {
            lawyerId = parseInt(lawyerIdStr, 10);
            if (isNaN(lawyerId)) {
                return res.status(400).json({ message: "Invalid Lawyer ID. It must be an integer." });
            }
            lawyerDetails = await Lawyer.findOne({ lawyerId });
            if (!lawyerDetails) {
                return res.status(404).json({ message: "Lawyer not found" });
            }
        }

        let detaineeDetails = null;
        if (detaineeUsername) {
            detaineeDetails = await Detainee.findOne({ username: detaineeUsername });
            if (!detaineeDetails) {
                return res.status(404).json({ message: "Detainee not found" });
            }
        }

        const casePoints = new Map([
            ["bnsSections", bnsSections.join(', ')],
            ["crimeType", crimeType],
            ["accusedAge", accusedAge],
            ["daysInDetention", daysInDetention],
            ["hasPriorRecord", String(hasPriorRecord)],
            ["priorConvictionSections", priorConvictionSections.join(', ')],
            ["hasPermanentAddress", String(hasPermanentAddress)],
            ["ownsProperty", String(ownsProperty)],
            ["isEmployed", String(isEmployed)],
            ["hasLocalFamily", String(hasLocalFamily)],
            ["holdsPassport", String(holdsPassport)],
            ["hasFinancialMeansToTravel", String(hasFinancialMeansToTravel)],
            ["availableEvidence", availableEvidence.join(', ')],
            ["witnessThreatReports", String(witnessThreats)],
            ["evidenceTamperingReports", String(evidenceTampering)],
            ["allegedOrganizedCrimeLinks", String(allegedOrganizedCrimeLinks)],
            ["historyOfViolence", String(historyOfViolence)],
            ["medicalConditions", medicalConditions || "None reported"],
            ["isSoleFamilyEarner", String(isSoleFamilyEarner)],
            ["allegedRoleInCrime", allegedRole],
        ]);

        const newCase = new Case({
            caseId,
            caseTitle,
            bnsSections,
            bailStatus: "",
            courtName,
            judgeId,
            filingDate,
            hearingDates: [],
            policeStation,
            caseSummary,
            casePoints,
            detaineeUsername: detaineeUsername || null,
            bailFilingDate: null,
            groundsOfBail: [],
            judgeComments: [],
            severityOfOffence,
            lawyerId,
            aiRecommendation: "",
        });

        await newCase.save();

        res.status(201).json({ message: "Case registered successfully", case: newCase });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getCaseProcessed = async (req, res) => {
  try {
    const { entity, caseid } = req.params;
    const caseDetails = await Case.findOne({ caseId: caseid });

    if (!caseDetails) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const payload = {
      ...req.body,
      entity,
      caseId: caseDetails.caseId,
      caseSummary: caseDetails.caseSummary,
      groundsOfBail: caseDetails.groundsOfBail,
      judgeComments: caseDetails.judgeComments,
      caseTitle: caseDetails.caseTitle,
      bnsSections: caseDetails.bnsSections,
      casePoints: caseDetails.casePoints ? Object.fromEntries(caseDetails.casePoints) : {},
    };


    const response = await axiosInstance.post('/find-similar-cases', payload);


    const aiAssistance = response?.data?.aiAssistance ?? null;
    const bailDecision = response?.data?.bailDecision ?? null;
    const similarCases = Array.isArray(response?.data?.similarCases) ? response.data.similarCases : [];


    let enrichedSimilarCases = [];
    if (similarCases.length) {
      const similarCaseIds = similarCases.map(c => c.caseId).filter(Boolean);
      const similarCaseDetails = await Case.find({ caseId: { $in: similarCaseIds } });
      enrichedSimilarCases = similarCases.map(sc => {
        const details = similarCaseDetails.find(cd => cd.caseId === sc.caseId);
        return details
          ? { similarityPercentage: sc.similarityPercentage, ...details.toObject() }
          : { ...sc };
      });
    }

    res.status(200).json({
      aiAssistance,
      bailDecision,
      currentCase: caseDetails,
      similarCases: enrichedSimilarCases
    });
  } catch (error) {
    console.error("Error in getCaseProcessed:", error);
    res.status(500).json({ message: 'Error processing case', error: error.message });
  }
};