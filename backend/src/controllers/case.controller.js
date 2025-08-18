import { Case } from "../models/case.model.js";  
import { Judge } from "../models/judge.model.js"; 
import { Lawyer } from "../models/lawyer.model.js"; 
import { Detainee } from "../models/detainee.model.js";
import { axiosInstance } from "../utils/axios.js";

export const caseRegister = async (req, res) => {
    try {
        const existingCase = await Case.findOne({ caseId: req.body.caseId });
        if (existingCase) return res.status(400).json({ message: "Case already exists" });

        const requiredFields = [
            'caseId',
            'caseTitle',
            'bnsSections',
            'courtName',
            'judgeId',
            'filingDate',
            'hearingDates',
            'policeStation',
            'caseSummary',
            'groundsOfBail',
            'lawyerId'
        ];

        const judgeId = parseInt(req.body.judgeId, 10);
        const lawyerId = parseInt(req.body.lawyerId, 10);

        if (isNaN(judgeId)) {
            return res.status(400).json({ message: "Invalid Judge ID. It should be an integer." });
        }
        if (isNaN(lawyerId)) {
            return res.status(400).json({ message: "Invalid Lawyer ID. It should be an integer." });
        }

        const judgeDetails = await Judge.findOne({ judgeId });
        if (!judgeDetails) {
            return res.status(404).json({ message: "Judge not found" });
        }

        let judgeName = judgeDetails.name;
        if (!judgeName.startsWith("Justice")) {
            judgeName = `Justice ${judgeName}`;
        }

        const lawyerDetails = await Lawyer.findOne({ lawyerId });
        if (!lawyerDetails) {
            return res.status(404).json({ message: "Lawyer not found" });
        }

        let detaineeDetails = null;
        if (req.body.detaineeUsername) {
            detaineeDetails = await Detainee.findOne({ username: req.body.detaineeUsername });
            if (!detaineeDetails) {
                return res.status(404).json({ message: "Detainee not found" });
            }
        }

        const newCase = new Case({
            caseId: req.body.caseId,
            caseTitle: req.body.caseTitle,
            bnsSections: req.body.bnsSections,
            courtName: req.body.courtName,

            judgeId, 
            judgeName: judgeDetails ? judgeDetails.name : "",
            judgeUsername: judgeDetails ? judgeDetails.username : "", 

            filingDate: req.body.filingDate,
            hearingDates: req.body.hearingDates,
            policeStation: req.body.policeStation,
            caseSummary: req.body.caseSummary,
            groundsOfBail: req.body.groundsOfBail,

            lawyerId,  
            lawyerUsername: lawyerDetails ? lawyerDetails.username : "",
            lawyerName: lawyerDetails ? lawyerDetails.name : "",  
            
            aiRecommendation: req.body.aiRecommendation || '', 

            detaineeUsername: req.body.detaineeUsername,
            detaineeName: detaineeDetails ? detaineeDetails.name : "",

            bailFilingDate: req.body.bailFilingDate, 
            judgeComments: req.body.judgeComments || [], 
            severityOfOffence: req.body.severityOfOffence || '', 
        });

        await newCase.save();

        res.status(201).json({ message: "Case registered successfully", case: newCase });

    } catch (error) {
        console.error(error);
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
      caseSummary: caseDetails.caseSummary,
      groundsOfBail: caseDetails.groundsOfBail,
      judgeComments: caseDetails.judgeComments,
      caseTitle: caseDetails.caseTitle,
      bnsSections: caseDetails.bnsSections,
      casePoints: caseDetails.casePoints,
    };

    const response = await axiosInstance.post('/find-similar-cases', payload);

    const { aiAssistance, bailDecision, similarCases } = response.data;

    const similarCaseIds = similarCases.map(c => c.caseId);
    const similarCaseDetails = await Case.find({ caseId: { $in: similarCaseIds } });

    const enrichedSimilarCases = similarCases.map(sc => {
      const details = similarCaseDetails.find(cd => cd.caseId === sc.caseId);
      return {
        similarityPercentage: sc.similarityPercentage,
        ...details.toObject()
      };
    });

    res.status(200).json({
      aiAssistance,
      bailDecision,
      currentCase: caseDetails,
      similarCases: enrichedSimilarCases
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing case', error: error.message });
  }
};