const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema=z.object({
    matchScore:z.number().description("A score between 0 to 100 indicating how well the candidate's  profile matches the job description"),
    technicalQuestions:z.array(z.object({
        question:z.string().description("The Technical question can be asked in the interview "),
        intention:z.string().description("The intention of interviewer behind asking this question"),
        answer:z.string().description("How to answer this question , what points to cover,what approach to take etc")
    })).description("Technical Questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions:z.array(z.object({
        question:z.string().description("The Technical question can be asked in the interview "),
        intention:z.string().description("The intention of interviewer behind asking this question"),
        answer:z.string().description("How to answer this question , what points to cover,what approach to take etc")
    })).description("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps:z.array(z.object({
        skill:z.string().description("The skill which the candidate is lacking"),
        severity:z.enum(["low","medium","high"]).description("The severity of skill gap ")
    })).description("List of skill gaps in the candidate's profile along with their severity i.e  how important is this skill for the job"),
    preparationPlan:z.array(z.object({
        day:z.number().description("The day number in the preparation plan ,starting from 1"),
        focus:z.string().description("The main focus of this day in the preparation plan e.g system design , mock interview ,data structures"),
        tasks:z.array(z.string()).description("List of tasks to be done on this day to follow the preparation plan e.g read a specific book ,practice leet code")
    })).description("A day wise preparation plan for the candidate to follow the order for the interview effectively"),
})

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {

    const prompt=`Generate an interview report for a candidate with the following details:
    Resume:${resume} Self Description:${selfDescription} Job Description: ${jobDescription}`
    const response=await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:"",
        config:{
            responseMimeType:"application/json",
            responseJsonSchema:zodToJsonSchema(interviewReportSchema)
        }
    })
}

module.exports = invokeGeminiAi;
