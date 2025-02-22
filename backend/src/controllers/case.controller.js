import { Case } from "../models/case.model.js";  
import { Judge } from "../models/judge.model.js"; 
import { Lawyer } from "../models/lawyer.model.js"; 
import { Detainee } from "../models/detainee.model.js"; 

export const caseRegister = async (req, res) => {
    try {
        // Check if case already exists
        const existingCase = await Case.findOne({ caseId: req.body.caseId });
        if (existingCase) return res.status(400).json({ message: "Case already exists" });

        // Define required fields
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

        // Ensure that `judgeId` and `lawyerId` are stored as integers
        const judgeId = parseInt(req.body.judgeId, 10);
        const lawyerId = parseInt(req.body.lawyerId, 10);

        if (isNaN(judgeId)) {
            return res.status(400).json({ message: "Invalid Judge ID. It should be an integer." });
        }
        if (isNaN(lawyerId)) {
            return res.status(400).json({ message: "Invalid Lawyer ID. It should be an integer." });
        }

        // Fetch judge details using judgeId
        const judgeDetails = await Judge.findOne({ judgeId });
        if (!judgeDetails) {
            return res.status(404).json({ message: "Judge not found" });
        }

        // Check if "Justice" is in the judge's name, and add if not
        let judgeName = judgeDetails.name;
        if (!judgeName.startsWith("Justice")) {
            judgeName = `Justice ${judgeName}`;
        }

        // Fetch lawyer details using lawyerId
        const lawyerDetails = await Lawyer.findOne({ lawyerId });
        if (!lawyerDetails) {
            return res.status(404).json({ message: "Lawyer not found" });
        }

        // Fetch detainee details using detaineeUsername (if provided)
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

            judgeId, // Store as integer
            judgeName: judgeDetails ? judgeDetails.name : "",
            judgeUsername: judgeDetails ? judgeDetails.username : "", 

            filingDate: req.body.filingDate,
            hearingDates: req.body.hearingDates,
            policeStation: req.body.policeStation,
            caseSummary: req.body.caseSummary,
            groundsOfBail: req.body.groundsOfBail,

            lawyerId,  // Store as integer
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

export default caseRegister;