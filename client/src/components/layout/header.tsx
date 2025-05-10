import { useLocation } from "wouter";
import { Brain } from "lucide-react";

const Header = () => {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary-dark" />
          <h1 className="text-2xl font-bold text-secondary-dark">
            GatsIQ<span className="text-primary">Test</span>
          </h1>
        </div>
        
        <div className="hidden sm:block">
          {location === "/test" && (
            <div className="text-neutral-700">
              <span className="font-medium">IQ Assessment</span>
            </div>
          )}
          
          {location === "/results" && (
            <div className="text-neutral-700">
              <span className="font-medium">Results</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
