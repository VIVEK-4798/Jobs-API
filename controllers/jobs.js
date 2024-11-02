const Job = require('../models/Job');
const { StatusCode } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
    res.send("Get all jobs")
}
const getJob = async (req, res) => {
    res.send("Get job")
}
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.json(req.body)
    res.Status(StatusCode.CREATED).json({job})
}
const updateJob = async (req, res) => {
    res.send("update job")
}
const deleteJob = async (req, res) => {
    res.send("delete job")
}



module.exports = {
    getAllJobs, getJob, createJob, updateJob, deleteJob
}