import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/**
 *@description service to generate interview Report
 */

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();

  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 *@description service to get interview report by id
 *
 *
 */

export const getInterviewReportById = async (interviewID) => {
  const response = await api.get(`/api/interview/report/${interviewID}`);
  return response.data;
};
/**
 *@description service to get all interview reports of the user
 */

export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview");
  return response.data;
};
