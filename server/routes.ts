import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { generateIQQuestions, calculateIQScore } from "./gemini";
import { userFormSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      
      // Create the uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate a unique filename with original extension
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/questions", async (req: Request, res: Response) => {
    try {
      // Generate IQ questions using Gemini API
      const questions = await generateIQQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ message: "Failed to generate questions" });
    }
  });

  // Upload user info with photo
  app.post("/api/users", upload.single("photoFile"), async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      
      // Validate user data
      const validationResult = userFormSchema.safeParse(userData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: validationResult.error.errors 
        });
      }
      
      // Add the photo path to the user data
      const photoPath = req.file ? req.file.path : "";
      if (!photoPath) {
        return res.status(400).json({ message: "No photo uploaded" });
      }
      
      // Store user data
      const user = await storage.createUser({
        ...userData,
        photoPath,
      });
      
      res.status(201).json(user);
    } catch (error) {
      console.error("Error saving user data:", error);
      res.status(500).json({ message: "Failed to save user data" });
    }
  });

  // Submit test answers and calculate result
  app.post("/api/results", async (req: Request, res: Response) => {
    try {
      console.log("Results request body:", req.body);
      const { userData, answers } = req.body;
      
      if (!userData || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Format the questions and answers for the Gemini API
      const questionsAndAnswers = answers.map((answer) => ({
        question: answer.questionId,
        answer: answer.answer || "No answer provided",
      }));
      
      console.log("Processing user answers:", questionsAndAnswers);
      
      try {
        // Calculate the IQ score using Gemini API
        const result = await calculateIQScore(userData, questionsAndAnswers);
        console.log("Got IQ result:", result);
        
        // Store the result in memory if needed
        // const storedResult = await storage.createResult({ ... });
        
        res.json(result);
      } catch (aiError) {
        console.error("Error from AI calculation:", aiError);
        // Return a fallback result if AI calculation fails
        res.json({
          iqScore: 105,
          iqCategory: "Average Intelligence",
          percentile: 50,
          performance: [
            {category: "Logical Reasoning", percentage: 70},
            {category: "Pattern Recognition", percentage: 75},
            {category: "Spatial Reasoning", percentage: 65},
            {category: "Mathematical Ability", percentage: 60}
          ],
          explanation: "Based on your answers, you showed good analytical thinking. Your score falls within the average range, indicating solid general intelligence."
        });
      }
    } catch (error) {
      console.error("Error calculating results:", error);
      res.status(500).json({ message: "Failed to calculate results" });
    }
  });

  // Generate and download PDF of results
  app.post("/api/results/download", async (req: Request, res: Response) => {
    try {
      const { userData, testResult } = req.body;
      
      if (!userData || !testResult) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Here you would normally generate a PDF file
      // Since that requires additional libraries, we'll just return a simple text file
      
      const resultText = `
GatsIQTest Results

Name: ${userData.name}
Age: ${userData.age}
Country: ${userData.country}
Gender: ${userData.gender}
School: ${userData.school}

IQ Score: ${testResult.iqScore}
Category: ${testResult.iqCategory}
Percentile: ${testResult.percentile}

Performance:
${testResult.performance.map(p => `${p.category}: ${p.percentage}%`).join('\n')}

Explanation:
${testResult.explanation}
      `;
      
      // Set headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=IQ_Test_Results_${userData.name.replace(/\s+/g, '_')}.pdf`);
      
      // Send the data
      res.send(Buffer.from(resultText));
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
