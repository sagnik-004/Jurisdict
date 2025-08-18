import mongoose from 'mongoose';
const { Schema } = mongoose;

const caseSchema = new Schema({
    caseId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    caseTitle: {
        type: String,
        required: true,
        trim: true, 
    },
    bnsSections:{
        type: [],
        required: true, 
    },
    bailStatus:{
        type: String,
        enum: ["", "Pending to lawyer", "Pending to judge", "Accepted", "Declined"],
        default: "",
        required: false,
    },
    courtName:{
        type: String,
        required: true,
        trim: true,
    },
    judgeId:{
        type: Number,
        required: true,
    },
    filingDate:{
        type: Date,
        required: true,
    },
    hearingDates:{
        type: [],
        required: true,
    },
    policeStation:{
        type: String,
        required: true,
    },
    caseSummary:{
        type: String,
        required: true,
        minLength: 250,
    },
    casePoints: {
        type: Map,
        of: String,
        required: true
    },
    detaineeUsername:{
        type: String,
        required: false,
    },
    bailFilingDate:{
        type: Date,
        required: false,
    },
    groundsOfBail:{
        type: [], 
        required: true,
    },
    judgeComments:{
        type: [], 
        required: false,
    },
    severityOfOffence:{
        type: String,
        required: false,
    },
    lawyerId:{
        type: Number,
        required: false,
    },
    aiRecommendation:{
        type: String,
        required: false,
    },
}, { timestamps: true }, { strict: true });

export const Case = mongoose.model('Case', caseSchema);