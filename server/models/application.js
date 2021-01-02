const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    _id: {
      type: mongoose.ObjectId,
      required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
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
      location: {
        type: String,
        required: false,
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
      interviewTime: {
          type: Date,
          required: false,
          default: Date.now,
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
      notes: {
        type: Array,
        note: {
          type: String,
          required: false,
        },
        required: false,
      }
  })

  module.exports = mongoose.model("Application", applicationSchema);