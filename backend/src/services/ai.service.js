const { GoogleGenAI } = require("@google/genai");
const { z, json } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
function normalizeQuestions(arr) {
  if (!Array.isArray(arr)) return [];

  return arr.map((item) => {
    if (typeof item === "string") {
      return {
        question: item,
        intention: "Evaluate understanding of the topic",
        answer: "Explain the concept clearly with examples and best practices",
      };
    }
    return item;
  });
}

function normalizeSkillGaps(arr) {
  if (!Array.isArray(arr)) return [];

  return arr.map((item) => {
    if (typeof item === "string") {
      return {
        skill: item,
        severity: "medium",
      };
    }
    return item;
  });
}

function normalizePreparation(arr) {
  if (!Array.isArray(arr)) return [];

  return arr.map((item, index) => {
    if (typeof item === "string") {
      return {
        day: index + 1,
        focus: item,
        tasks: ["Study the topic", "Practice coding examples"],
      };
    }
    return item;
  });
}

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 to 100 indicating how well the candidate's  profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The Technical question can be asked in the interview "),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question , what points to cover,what approach to take etc",
          ),
      }),
    )
    .describe(
      "Technical Questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The Technical question can be asked in the interview "),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question , what points to cover,what approach to take etc",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of skill gap "),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity i.e  how important is this skill for the job",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan ,starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan e.g system design , mock interview ,data structures",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan e.g read a specific book ,practice leet code",
          ),
      }),
    )
    .describe(
      "A day wise preparation plan for the candidate to follow the order for the interview effectively",
    ),
    title:z.string().describe("The title of the job for which the interview report is generated ")
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an AI interview preparation assistant.

Return ONLY valid JSON.

Each element in technicalQuestions and behavioralQuestions MUST be an object:

{
 "question": "string",
 "intention": "string",
 "answer": "string"
}

Each skillGap must be:

{
 "skill": "string",
 "severity": "low | medium | high"
}

Each preparationPlan item must be:

{
 "day": number,
 "focus": "string",
 "tasks": ["string"]
}

Generate:
- matchScore
- 5 technicalQuestions
- 5 behavioralQuestions
- 3 skillGaps
- 7 preparationPlan days

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });
  const data = JSON.parse(response.text);

// normalize bad AI responses
data.technicalQuestions = normalizeQuestions(data.technicalQuestions);
data.behavioralQuestions = normalizeQuestions(data.behavioralQuestions);
data.skillGaps = normalizeSkillGaps(data.skillGaps);
data.preparationPlan = normalizePreparation(data.preparationPlan);

// now validate
const parsed = interviewReportSchema.safeParse(data);

if (!parsed.success) {
  console.error("AI RESPONSE INVALID:", parsed.error);
  throw new Error("Invalid AI response format");
}

return parsed.data;
}
module.exports = generateInterviewReport;
