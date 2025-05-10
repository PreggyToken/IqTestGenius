export const COUNTRIES = [
  { value: "united-states", label: "United States" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "japan", label: "Japan" },
  { value: "china", label: "China" },
  { value: "india", label: "India" },
  { value: "brazil", label: "Brazil" },
  { value: "mexico", label: "Mexico" },
  { value: "italy", label: "Italy" },
  { value: "spain", label: "Spain" },
  { value: "russia", label: "Russia" },
  { value: "south-korea", label: "South Korea" },
  { value: "netherlands", label: "Netherlands" },
  { value: "sweden", label: "Sweden" },
  { value: "switzerland", label: "Switzerland" },
  { value: "south-africa", label: "South Africa" },
  { value: "other", label: "Other" },
];

export const IQ_CATEGORIES = [
  { min: 0, max: 69, name: "Intellectually Impaired" },
  { min: 70, max: 79, name: "Borderline Impaired" },
  { min: 80, max: 89, name: "Below Average" },
  { min: 90, max: 109, name: "Average Intelligence" },
  { min: 110, max: 119, name: "Above Average" },
  { min: 120, max: 129, name: "Superior Intelligence" },
  { min: 130, max: Infinity, name: "Very Superior Intelligence" },
];

export const GEMINI_PROMPTS = {
  QUESTIONS: `Generate 8 IQ test questions that assess logical reasoning, pattern recognition, and problem-solving abilities. 
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
  Ensure each question id is unique. Make sure each question is challenging but fair, suitable for an adult IQ assessment.`,

  CALCULATE_SCORE: `You're an IQ assessment expert. Given a user's answers to IQ test questions, calculate an estimated IQ score, provide an analysis, and generate a detailed explanation.

User Information:
- Name: {{name}}
- Age: {{age}}
- Gender: {{gender}}
- Country: {{country}}
- Education: {{school}}

Questions and Answers:
{{questions_and_answers}}

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

Ensure the explanation is personalized based on the user's information and performance.`
};
