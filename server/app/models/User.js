import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const userSchema = new Schema({
    name: String,
    nameEn: String,
    phone: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
}, { timestamps: true });

export default model('User', userSchema);