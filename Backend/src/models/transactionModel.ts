const transactionSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    default: null,
  },
  amount: { type: Number, required: true },
  transactionType: {
    type: String,
    enum: ["Send Money", "Cash In", "Cash Out"],
  },
  transactionId: { type: String, unique: true, required: true },
  fee: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
