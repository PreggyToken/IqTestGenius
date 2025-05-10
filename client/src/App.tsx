import { useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HomePage from "@/pages/home-page";
import TestPage from "@/pages/test-page";
import ResultsPage from "@/pages/results-page";
import NotFound from "@/pages/not-found";

import { useUserData } from "@/hooks/use-user-data";
import { useTestData } from "@/hooks/use-test-data";

function App() {
  const [location, setLocation] = useLocation();
  const { userData, setUserData, resetUserData } = useUserData();
  const { 
    questions, 
    answers, 
    currentQuestion, 
    testResult,
    setAnswers,
    setCurrentQuestion,
    setQuestions,
    setTestResult,
    resetTestData
  } = useTestData();

  // Handler to navigate to test page after form submission
  const handleStartTest = (data: any, photoFile: File) => {
    console.log("Start test with data:", data, photoFile);
    // First save the user data
    setUserData({ ...data, photoFile });
    // Then navigate to the test page
    setTimeout(() => {
      setLocation("/test");
    }, 100);
  };

  // Handler to navigate to results page after test completion
  const handleCompleteTest = () => {
    setLocation("/results");
  };

  // Handler for restarting the test
  const handleRestartTest = () => {
    resetUserData();
    resetTestData();
    setLocation("/");
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
          <Switch>
            <Route path="/">
              <HomePage onSubmit={handleStartTest} />
            </Route>
            
            <Route path="/test">
              {userData ? (
                <TestPage 
                  userData={userData}
                  questions={questions}
                  currentQuestion={currentQuestion}
                  answers={answers}
                  setAnswers={setAnswers}
                  setCurrentQuestion={setCurrentQuestion}
                  setQuestions={setQuestions}
                  setTestResult={setTestResult}
                  onComplete={handleCompleteTest}
                />
              ) : (
                <div className="redirect-message">
                  {setLocation("/")}
                </div>
              )}
            </Route>
            
            <Route path="/results">
              {testResult ? (
                <ResultsPage 
                  userData={userData}
                  testResult={testResult}
                  answers={answers}
                  onRestart={handleRestartTest}
                />
              ) : (
                <div className="redirect-message">
                  {setLocation("/")}
                </div>
              )}
            </Route>
            
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </main>
        
        <Footer />
      </div>
    </TooltipProvider>
  );
}

export default App;
