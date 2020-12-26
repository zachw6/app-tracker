const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  applications: {
    type: Array,
    applications: [{
      companyName: {
        type: String,
        required: true,
      },
      appliedDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
      position: {
        type: String,
        required: true,
      },
      interviewer: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: true,
        default: "Applied",
      },
      followUp: {
        type: Boolean,
        required: true,
        default: false,
      },
      documentsSubmitted: {
        type: Array,
        documents: {
          type: String,
          required: false,
        },
        required: false,
        default: [],
      },
      required: true,
    }],
    notes: {
      type: Array,
      note: {
        type: String,
        required: false,
      },
      required: false,
      default: "Feel free to take any notes about the job position or interviews you have done!",
    },
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
