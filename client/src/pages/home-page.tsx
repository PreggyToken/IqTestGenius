import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "@shared/schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect } from "@/components/ui/form-field";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { COUNTRIES } from "@/lib/constants";

type HomePageProps = {
  onSubmit: (data: any, photoFile: File) => void;
};

const HomePage = ({ onSubmit }: HomePageProps) => {
  const { toast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      country: "",
      age: undefined,
      school: "",
      gender: "",
    },
  });
  
  const handleSubmit = (data: any) => {
    // If there's no photo, we'll create a placeholder empty File
    const fileToSubmit = photoFile || new File([], "placeholder.jpg", { type: "image/jpeg" });
    onSubmit(data, fileToSubmit);
  };
  
  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
  };
  
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-Binary" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];
  
  return (
    <div className="transition-all duration-300">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark mb-3">
          Welcome to GatsIQ Test
        </h2>
        <p className="text-neutral-700 max-w-2xl mx-auto">
          Discover your cognitive potential with our comprehensive IQ assessment powered by advanced AI technology.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-card p-6 md:p-8 max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-dark text-white flex items-center justify-center mr-4">
            <span className="text-lg">🧑</span>
          </div>
          <h3 className="text-xl font-semibold text-neutral-800">Personal Information</h3>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormInput 
              form={form} 
              name="name" 
              label="Full Name" 
              required
            />
            
            <FormSelect 
              form={form} 
              name="country" 
              label="Country" 
              options={COUNTRIES}
              required
            />
            
            <FormInput 
              form={form} 
              name="age" 
              label="Age" 
              type="number"
              required
            />
            
            <FormInput 
              form={form} 
              name="school" 
              label="Last School Attended" 
              required
            />
            
            <div className="space-y-4">
              <FormSelect 
                form={form} 
                name="gender" 
                label="Gender" 
                options={genderOptions}
              />
              
              <FileUpload 
                form={form} 
                name="photoFile" 
                label="Optional: Upload your photo" 
                accept="image/*"
                maxSize={5}
                onChange={handlePhotoChange}
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary-dark text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center">
                <span>Start IQ Test</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="text-sm text-neutral-500 text-center">
              By proceeding, you acknowledge and consent to the processing of your personal information in accordance with our{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>.
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HomePage;
