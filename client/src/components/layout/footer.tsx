import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-primary-dark mr-2" />
            <span className="text-neutral-700 font-medium">
              GatsIQ<span className="text-primary">Test</span> © {new Date().getFullYear()}
            </span>
          </div>
          
          <div className="flex gap-6 text-sm text-neutral-600">
            <a href="#" className="hover:text-primary transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
