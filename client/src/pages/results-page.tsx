import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IQTestResult, IQAnswer } from "@shared/schema";
import { Download, Share, Trophy, PieChart, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type ResultsPageProps = {
  userData: any;
  testResult: IQTestResult;
  answers: IQAnswer[];
  onRestart: () => void;
};

const ResultsPage = ({ userData, testResult, answers, onRestart }: ResultsPageProps) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const response = await apiRequest('POST', '/api/results/download', {
        userData,
        testResult,
        answers,
      });
      
      // Create a blob from the PDF Stream
      const blob = await response.blob();
      // Create a link to download it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `IQ_Test_Results_${userData.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      toast({
        title: "Success",
        description: "Your results have been downloaded successfully.",
      });
    } catch (error) {
      console.error("Failed to download results:", error);
      toast({
        title: "Error",
        description: "Failed to download your results. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsDownloading(false);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My IQ Test Results',
        text: `I just completed an IQ test and scored ${testResult.iqScore}! Check out GatsIQTest to discover your IQ.`,
        url: window.location.href,
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        toast({
          title: "Error",
          description: "Failed to share your results. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(
        `I just completed an IQ test and scored ${testResult.iqScore}! Check out GatsIQTest to discover your IQ. ${window.location.href}`
      ).then(() => {
        toast({
          title: "Success",
          description: "Results link copied to clipboard.",
        });
      });
    }
  };
  
  return (
    <div>
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-light mb-4">
          <Trophy className="h-10 w-10 text-primary-dark" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark mb-2">
          Your IQ Test Results
        </h2>
        <p className="text-neutral-700 max-w-2xl mx-auto">
          Thank you for completing the GatsIQ Test. Your assessment has been analyzed.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* IQ Score Card */}
        <Card className="row-span-2 flex flex-col">
          <CardContent className="p-6 md:p-8 flex-1 flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-neutral-800 mb-6">Your Estimated IQ Score</h3>
              
              <div className="relative inline-block">
                {/* Circular progress indicator */}
                <div className="w-48 h-48 rounded-full border-8 border-primary-light flex items-center justify-center mb-4 relative">
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-primary" 
                    style={{ 
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(testResult.percentile * 0.01 * Math.PI * 2)}% ${50 - 50 * Math.sin(testResult.percentile * 0.01 * Math.PI * 2)}%, ${testResult.percentile > 75 ? '100% 0%' : '50% 0%'})`,
                      transform: 'rotate(0deg)'
                    }}
                  ></div>
                  <div className="text-4xl font-bold text-secondary-dark">{testResult.iqScore}</div>
                </div>
                <div className="absolute top-6 left-6 w-36 h-36 rounded-full border-4 border-white"></div>
              </div>
              
              <div className="mt-4">
                <div className="text-xl font-semibold text-neutral-900">{testResult.iqCategory}</div>
                <p className="text-neutral-600 mt-2">Your score is higher than <span>{testResult.percentile}</span>% of the population</p>
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between mb-4">
                <span className="text-sm text-neutral-600">Average</span>
                <span className="text-sm text-neutral-600">Exceptional</span>
              </div>
              <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min(100, (testResult.iqScore - 85) * 100 / 60)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-neutral-600">85</span>
                <span className="text-sm text-neutral-600">100</span>
                <span className="text-sm text-neutral-600">115</span>
                <span className="text-sm text-neutral-600">130</span>
                <span className="text-sm text-neutral-600">145+</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Analysis Card */}
        <Card>
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-primary" />
              Performance Analysis
            </h3>
            
            <div className="space-y-6">
              {testResult.performance.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Explanation Card */}
        <Card>
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-primary" />
              Result Explanation
            </h3>
            
            <div className="text-neutral-700 space-y-4">
              {testResult.explanation.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition flex items-center justify-center"
        >
          <Download className="mr-2 h-5 w-5" />
          {isDownloading ? "Preparing PDF..." : "Download Results PDF"}
        </Button>
        
        <Button 
          onClick={handleShare}
          variant="outline"
          className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition flex items-center justify-center"
        >
          <Share className="mr-2 h-5 w-5" />
          Share Results
        </Button>
      </div>
      
      <div className="mt-6 text-center">
        <Button 
          onClick={onRestart}
          variant="link"
          className="text-neutral-600 hover:text-primary"
        >
          Take the test again
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
