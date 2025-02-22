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
        type: Array,
        required: true, // array of integers
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
        type: Number, // integer
        required: true,
    },
    judgeName:{
        type: String,
        required: false,
    },
    judgeUsername:{
        type: String,
        required: false,
    },
    filingDate:{
        type: Date,
        required: true,
    },
    hearingDates:{
        type: Array,
        required: true, // array of dates
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
    detaineeUsername:{
        type: String,
        required: false,
    },
    detaineeName:{
        type: String,
        required: false,
    },
    bailFilingDate:{
        type: Date,
        required: false,
    },
    groundsOfBail:{
        type: Array, // array of strings
        required: true,
    },
    judgeComments:{
        type: Array, // array of strings
        required: false,
    },
    severityOfOffence:{
        type: String,
        required: false,
    },
    lawyerId:{
        type: Number, // lawyer BAR Council id
        required: false,
    },
    lawyerUsername:{
        type: String,
        required: false,
    },
    lawyerName:{
        type: String,
        required: false,
    },
    aiRecommendation:{
        type: String,
        required: false,
    },
});

export const Case = mongoose.model('Case', caseSchema);