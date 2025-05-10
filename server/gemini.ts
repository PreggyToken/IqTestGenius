import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateIQQuestions() {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  try {
    const prompt = `Generate 8 IQ test questions that assess logical reasoning, pattern recognition, and problem-solving abilities. 
    Include a mix of multiple choice (with 4 options each) and short answer questions. 
    For multiple choice questions, include the options as an array. 
    For short answer questions, don't include options.
    Format the response as a JSON array of objects with the following structure:
    [
      {
        "id": "unique-id",
        "type": "multiple_choice",
        "question": "question text",
        "options": ["option 1", "option 2", "option 3", "option 4"]
      },
      {
        "id": "unique-id",
        "type": "short_answer",
        "question": "question text"
      }
    ]
    Ensure each question id is unique. Make sure each question is challenging but fair, suitable for an adult IQ assessment.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the text
    const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from the response");
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    return questions;
  } catch (error) {
    console.error("Error generating IQ questions:", error);
    throw error;
  }
}

export async function calculateIQScore(userData: any, questionsAndAnswers: any) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  try {
    // Prepare the questions and answers string
    const qaString = questionsAndAnswers.map((qa: any) => 
      `Question: ${qa.question}\nUser's Answer: ${qa.answer}`
    ).join("\n\n");

    // Create the prompt with user data and answers
    const prompt = `You're an IQ assessment expert. Given a user's answers to IQ test questions, calculate an estimated IQ score, provide an analysis, and generate a detailed explanation.

User Information:
- Name: ${userData.name}
- Age: ${userData.age}
- Gender: ${userData.gender}
- Country: ${userData.country}
- Education: ${userData.school}

Questions and Answers:
${qaString}

Based on this information, please:
1. Calculate an estimated IQ score (between 85-145)
2. Determine the IQ category based on the score
3. Calculate the percentile (what percentage of the population has a lower score)
4. Provide performance percentages for different cognitive categories (Logical Reasoning, Pattern Recognition, Spatial Reasoning, Mathematical Ability)
5. Write a detailed explanation of the results (3-4 paragraphs)

Format your response as a JSON object with this structure:
{
  "iqScore": 123,
  "iqCategory": "Superior Intelligence",
  "percentile": 92,
  "performance": [
    {"category": "Logical Reasoning", "percentage": 88},
    {"category": "Pattern Recognition", "percentage": 92},
    {"category": "Spatial Reasoning", "percentage": 85},
    {"category": "Mathematical Ability", "percentage": 90}
  ],
  "explanation": "Detailed multi-paragraph explanation of the results."
}

Ensure the explanation is personalized based on the user's information and performance.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from the response");
    }
    
    const iqResult = JSON.parse(jsonMatch[0]);
    return iqResult;
  } catch (error) {
    console.error("Error calculating IQ score:", error);
    throw error;
  }
}
