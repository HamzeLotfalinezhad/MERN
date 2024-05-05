import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const AdminSchema = new Schema({
    name: String,
    nameEn: String,
    phone: { type: String, unique: true },
    password: String,
    role: { type: String, default: "admin" }, // admin, manager, coordinator
}, { timestamps: true });

export default model('Admin', AdminSchema);