import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { IQQuestion, IQAnswer, IQTestResult } from "@shared/schema";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type TestPageProps = {
  userData: any;
  questions: IQQuestion[];
  currentQuestion: number;
  answers: IQAnswer[];
  setAnswers: (answers: IQAnswer[]) => void;
  setCurrentQuestion: (questionNumber: number) => void;
  setQuestions: (questions: IQQuestion[]) => void;
  setTestResult: (result: IQTestResult) => void;
  onComplete: () => void;
};

const TestPage = ({
  userData,
  questions,
  currentQuestion,
  answers,
  setAnswers,
  setCurrentQuestion,
  setQuestions,
  setTestResult,
  onComplete,
}: TestPageProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [shortAnswer, setShortAnswer] = useState<string>("");
  
  // Fetch questions if not already loaded
  useEffect(() => {
    const fetchQuestions = async () => {
      if (questions.length === 0) {
        setIsLoading(true);
        try {
          const response = await apiRequest('GET', '/api/questions', undefined);
          const data = await response.json();
          setQuestions(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch questions:", error);
          toast({
            title: "Error",
            description: "Failed to load IQ test questions. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    };
    
    fetchQuestions();
  }, []);
  
  // Load previous answer when navigating between questions
  useEffect(() => {
    if (questions.length > 0 && currentQuestion > 0) {
      const currentQuestionId = questions[currentQuestion - 1].id;
      const existingAnswer = answers.find(a => a.questionId === currentQuestionId);
      
      if (existingAnswer) {
        if (questions[currentQuestion - 1].type === "multiple_choice") {
          setSelectedOption(existingAnswer.answer);
          setShortAnswer("");
        } else {
          setShortAnswer(existingAnswer.answer);
          setSelectedOption("");
        }
      } else {
        setSelectedOption("");
        setShortAnswer("");
      }
    }
    
    if (initialLoad && questions.length > 0) {
      setInitialLoad(false);
    }
  }, [currentQuestion, questions, answers, initialLoad]);
  
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      saveCurrentAnswer();
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleNext = () => {
    saveCurrentAnswer();
    
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question - submit test
      submitTest();
    }
  };
  
  const saveCurrentAnswer = () => {
    if (questions.length === 0 || currentQuestion === 0) return;
    
    const currentQuestionObj = questions[currentQuestion - 1];
    let answerValue = "";
    
    if (currentQuestionObj.type === "multiple_choice") {
      answerValue = selectedOption;
    } else {
      answerValue = shortAnswer;
    }
    
    // Don't save empty answers
    if (!answerValue) return;
    
    const currentQuestionId = currentQuestionObj.id;
    const existingAnswerIndex = answers.findIndex(a => a.questionId === currentQuestionId);
    
    if (existingAnswerIndex !== -1) {
      // Update existing answer
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = {
        questionId: currentQuestionId,
        answer: answerValue,
      };
      setAnswers(updatedAnswers);
    } else {
      // Add new answer
      setAnswers([
        ...answers,
        {
          questionId: currentQuestionId,
          answer: answerValue,
        },
      ]);
    }
  };
  
  const submitTest = async () => {
    saveCurrentAnswer();
    
    // Validate if all questions are answered
    if (answers.length < questions.length) {
      toast({
        title: "Incomplete Test",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/results', {
        userData,
        answers,
      });
      
      const result = await response.json();
      setTestResult(result);
      setIsLoading(false);
      onComplete();
    } catch (error) {
      console.error("Failed to submit test:", error);
      toast({
        title: "Error",
        description: "Failed to submit your test. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-neutral-700">
          {questions.length === 0 ? "Loading questions..." : "Processing your results..."}
        </p>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return null;
  }
  
  const currentQuestionObj = questions[currentQuestion - 1];
  const progress = (currentQuestion / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length;
  
  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">
            Question <span>{currentQuestion}</span> of {questions.length}
          </span>
          <span className="text-sm font-medium text-neutral-700">
            <span>{Math.round(progress)}</span>% Complete
          </span>
        </div>
        <Progress value={progress} />
      </div>
      
      {/* Question Container */}
      <Card className="bg-white rounded-xl shadow-card">
        <CardContent className="p-6 md:p-8">
          <div className="question-item">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4">
              {currentQuestionObj.question}
            </h3>
            
            {currentQuestionObj.type === "multiple_choice" && (
              <div className="space-y-3 my-6">
                {(currentQuestionObj.options || []).map((option, index) => (
                  <label 
                    key={index}
                    className={`flex items-center border ${
                      selectedOption === option 
                        ? "border-primary bg-primary-light/10" 
                        : "border-neutral-300"
                    } p-4 rounded-lg cursor-pointer hover:bg-primary-light/10 transition-all`}
                  >
                    <input 
                      type="radio" 
                      name={`q${currentQuestion}`} 
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => setSelectedOption(option)}
                      className="mr-3 h-5 w-5 text-primary focus:ring-primary"
                    />
                    <span className="text-neutral-800">{option}</span>
                  </label>
                ))}
              </div>
            )}
            
            {currentQuestionObj.type === "short_answer" && (
              <div className="space-y-4 my-6">
                <label htmlFor={`q${currentQuestion}-answer`} className="text-sm font-medium text-neutral-700">
                  Enter your answer:
                </label>
                <Input
                  id={`q${currentQuestion}-answer`}
                  value={shortAnswer}
                  onChange={(e) => setShortAnswer(e.target.value)}
                  placeholder="Type your answer here"
                  className="w-full border border-neutral-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 1}
                variant="outline"
                className="px-6 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-100 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center"
              >
                {isLastQuestion ? (
                  <>
                    Complete Test
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;
