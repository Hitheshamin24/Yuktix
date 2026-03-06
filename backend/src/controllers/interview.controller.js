const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 *
 *
 * @description controller to generate interview report based on user self description resume job
 */
async function generateInterviewReportController(req, res) {
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });
  if (typeof interviewReportByAi.technicalQuestions === "string") {
    interviewReportByAi.technicalQuestions = JSON.parse(
      `[${interviewReportByAi.technicalQuestions}]`,
    );
  }

  if (typeof interviewReportByAi.behavioralQuestions === "string") {
    interviewReportByAi.behavioralQuestions = JSON.parse(
      `[${interviewReportByAi.behavioralQuestions}]`,
    );
  }

  if (typeof interviewReportByAi.skillGaps === "string") {
    interviewReportByAi.skillGaps = JSON.parse(
      `[${interviewReportByAi.skillGaps}]`,
    );
  }

  if (typeof interviewReportByAi.preparationPlan === "string") {
    interviewReportByAi.preparationPlan = JSON.parse(
      `[${interviewReportByAi.preparationPlan}]`,
    );
  }

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });
  res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
}

async function getInterviewReportByIdController(res, req) {
  const interviewId = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: "interview report not found" });
  }
  res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
}

/**
 * @description controller to get all interview report of logged in user
 *
 *
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
    
  res.status(200).json({
    message: "Interview reports fetched successfully",
    interviewReports,
  });

}
module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
};
