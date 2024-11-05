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
    const {body:{company, position},user:{userId}, params:{id:jobId}} = req

if(company === ' ' || position === ' '){
    throw new BadRequestError('Company or position fields cannot be empty')
}
    const job = await Job.findByIdAndUpdate({_id:jobId, createBy:userId}, req.body,
        {new:true, runValidators:true}
    )
    if(!job){
        throw new NotFoundError(`No job with job id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
    res.send("delete job")
}



module.exports = {
    getAllJobs, getJob, createJob, updateJob, deleteJob
}
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzI3ODUyOWEyNDQ0NTI1MDAwN2YyYTkiLCJuYW1lIjoicGV0ZXIiLCJpYXQiOjE3MzA2NDMyNDEsImV4cCI6MTczMzIzNTI0MX0.1iuQwTeW6uYqAeyCkc6-B-wCUyqRaYbm0juKX4RW0ZQ