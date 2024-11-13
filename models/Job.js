const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['applied', 'interviewed', 'rejected', 'offer'],
      default: 'applied', 
    },
    applicationDate: {
      type: Date,
      required: [true, 'Please provide application date'],
    },
    notes: {
      type: String,
      maxlength: 500, 
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
