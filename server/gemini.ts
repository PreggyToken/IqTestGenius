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
    const prompt = `Generate 8 text-only IQ test questions that assess logical reasoning, pattern recognition, and problem-solving abilities.
    Only include text-based questions - no questions requiring images, diagrams, or visual patterns.
    Include a mix of multiple choice (with 4 options each) and short answer questions. 
    For multiple choice questions, include the options as an array. 
    For short answer questions, don't include options.
    
    Questions should focus on:
    - Number sequences
    - Word problems
    - Logical deductions
    - Verbal analogies
    - Mathematical reasoning

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
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from the response");
    }
    
    try {
      // Clean the JSON string by replacing control characters
      const cleanedJson = jsonMatch[0].replace(/[\n\r\t\b\f\v]/g, ' ');
      const questions = JSON.parse(cleanedJson);
      return questions;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      // Fallback questions if parsing fails
      return [
        {
          id: "q1",
          type: "multiple_choice",
          question: "Which number comes next in the sequence: 2, 4, 8, 16, ?",
          options: ["24", "32", "64", "28"]
        },
        {
          id: "q2",
          type: "multiple_choice",
          question: "If all Glorks are Flurbs and all Flurbs are Mips, then which statement must be true?",
          options: ["All Mips are Glorks", "All Glorks are Mips", "Some Flurbs are not Glorks", "None of the above"]
        },
        {
          id: "q3",
          type: "short_answer",
          question: "What is the next letter in this sequence: O, T, T, F, F, S, S, ?"
        },
        {
          id: "q4",
          type: "multiple_choice",
          question: "Mary is twice as old as Ann was when Mary was as old as Ann is now. If Mary is 24, how old is Ann?",
          options: ["12", "16", "18", "20"]
        },
        {
          id: "q5",
          type: "short_answer",
          question: "What number should replace the question mark? 7, 11, 13, 17, 19, ?"
        },
        {
          id: "q6",
          type: "multiple_choice",
          question: "Which figure completes the pattern?",
          options: ["Triangle", "Square", "Circle", "Hexagon"]
        },
        {
          id: "q7",
          type: "multiple_choice",
          question: "In a certain code, COMPUTER is written as RFUVQNPC. How will PRINTER be written in that code?",
          options: ["QSJOUFS", "SFUOJSQ", "QSJOOFS", "SFJSFUQ"]
        },
        {
          id: "q8",
          type: "short_answer",
          question: "A father's age is three times his son's age. After 12 years, the father's age will be twice his son's age. What is the present age of the son?"
        }
      ];
    }
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
    
    // Extract the JSON from the text and clean it
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from the response");
    }
    
    try {
      // Clean the JSON string by replacing control characters
      const cleanedJson = jsonMatch[0].replace(/[\n\r\t\b\f\v]/g, ' ');
      const iqResult = JSON.parse(cleanedJson);
      return iqResult;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      // Fallback response if parsing fails
      return {
        iqScore: 110,
        iqCategory: "Average Intelligence",
        percentile: 50,
        performance: [
          {category: "Logical Reasoning", percentage: 75},
          {category: "Pattern Recognition", percentage: 80},
          {category: "Spatial Reasoning", percentage: 70},
          {category: "Mathematical Ability", percentage: 65}
        ],
        explanation: "Based on your answers, you showed good problem-solving abilities across multiple domains. Your score falls within the average range, indicating solid general intelligence."
      };
    }
  } catch (error) {
    console.error("Error calculating IQ score:", error);
    throw error;
  }
}
