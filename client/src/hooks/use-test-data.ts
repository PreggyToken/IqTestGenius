import { useState } from "react";
import { IQQuestion, IQAnswer, IQTestResult } from "@shared/schema";

export const useTestData = () => {
  const [questions, setQuestions] = useState<IQQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [answers, setAnswers] = useState<IQAnswer[]>([]);
  const [testResult, setTestResult] = useState<IQTestResult | null>(null);
  
  const resetTestData = () => {
    setQuestions([]);
    setCurrentQuestion(1);
    setAnswers([]);
    setTestResult(null);
  };
  
  return {
    questions,
    currentQuestion,
    answers,
    testResult,
    setQuestions,
    setCurrentQuestion,
    setAnswers,
    setTestResult,
    resetTestData,
  };
};
