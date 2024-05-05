import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
import mongoose from 'mongoose';

const recordSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: null
    },
    recordId: {
        type: Number,
        unique: true, // Ensure uniqueness
        // required: true
    },
    insertDate: { type: String, default: '' },
    insertDatePr: { type: String, default: '' },
    removeDate: { type: String, default: '' },
    removeDatePr: { type: String, default: '' },
    dateDiff: { type: Number },
    patientName: {
        fa: String,
        en: String
    },
    patient: {
        age: String,
        smoker: Boolean,
        diabetic: Boolean,
        overweight: Boolean
    },
    implant: {
        bodytype: String,
        diameter: String,
        size: String,
        code: String
    },
    boneType: String,
    tooth: {
        jaw: String,
        number: Number
    },
    extraInfo: String,
    isReceived: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });


// Define a pre-save hook to auto-increment the userId field
// Define a pre-save hook to auto-increment the userId field
recordSchema.pre('save', async function (next) {
    const record = this;
    if (!record.isNew) {
        return next();
    }
    try {
        const counter = await Counter.findOneAndUpdate(
            { _id: 'recordId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        record.recordId = counter.seq;
        next();
    } catch (error) {
        next(error);
    }
});

// Create a Counter model to store the sequence
const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', CounterSchema);


export default model('Record', recordSchema);