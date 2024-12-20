const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}
const getJob = async (req, res) => {
    const {user:{userId}, params:{id:jobId}} = req

    const job = await Job.findOne({
        _id:jobId, createdBy:userId
    })
    if(!job){
        throw new NotFoundError(`No job with job id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req, res) => {
  const {
    body: { companyName, position, applicationStatus, applicationDate, notes },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!companyName || !position || !applicationStatus || !applicationDate) {
    throw new BadRequestError(
      "Company Name, Position, Status, and Date fields are required."
    );
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { companyName, position, applicationStatus, applicationDate, notes },
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`Job with ID ${jobId} not found.`);
  }

  res.status(StatusCodes.OK).json({ job });
};


const deleteJob = async (req, res) => {
    const {user:{userId}, params:{id:jobId}} = req

    const job = await Job.findByIdAndRemove({
        _id:jobId,
        createdBy: userId
    })
    if(!job){
        throw new NotFoundError(`No job with job id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
}



module.exports = {
    getAllJobs, getJob, createJob, updateJob, deleteJob
}