const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
async function generateInterviewReportController(req, res) {
  const resumeFile = req.file;

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
module.exports = { generateInterviewReportController };
