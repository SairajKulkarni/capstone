import mongoose from "mongoose";

const certificateSchema = mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  certName: { type: String, required: true },
  organization: { type: String, required: true },
  certificateId: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date },
  isVerified: { type: Boolean, required: true },
});

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
