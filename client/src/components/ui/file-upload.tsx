import { useState, useRef, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";

type FileUploadProps = {
  form: any;
  name: string;
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  required?: boolean;
  onChange?: (file: File | null) => void;
};

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ form, name, label, accept = "image/*", maxSize = 5, className, required = false, onChange }, ref) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      
      if (file) {
        // Check file size
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > maxSize) {
          form.setError(name, {
            type: "manual",
            message: `File size should not exceed ${maxSize}MB`,
          });
          if (fileRef.current) fileRef.current.value = "";
          return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        form.setValue(name, file, { shouldValidate: true });
        if (onChange) onChange(file);
      } else {
        setPreview(null);
        form.setValue(name, null, { shouldValidate: true });
        if (onChange) onChange(null);
      }
    };
    
    const handleRemove = () => {
      setPreview(null);
      form.setValue(name, null, { shouldValidate: true });
      if (fileRef.current) fileRef.current.value = "";
      if (onChange) onChange(null);
    };
    
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field: { value, onChange, ...rest } }) => (
          <FormItem className={cn("border border-dashed border-neutral-300 rounded-lg p-6 bg-neutral-100", className)}>
            <div className="text-center">
              <ImagePlus className="h-10 w-10 text-neutral-500 mx-auto mb-2" />
              <FormLabel className="block text-neutral-700 mb-2">{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
              <p className="text-xs text-neutral-500 mb-4">JPEG, PNG or GIF (max. {maxSize}MB)</p>
              
              <FormControl>
                <input 
                  type="file"
                  accept={accept}
                  ref={fileRef}
                  className="hidden"
                  onChange={handleFileChange}
                  required={required}
                  {...rest}
                />
              </FormControl>
              
              <Button 
                type="button" 
                className="inline-block px-6 py-2.5 bg-primary text-white rounded-md cursor-pointer hover:bg-primary-dark transition"
                onClick={() => fileRef.current?.click()}
              >
                Browse Files
              </Button>
            </div>
            
            {preview && (
              <div className="mt-4">
                <div className="w-full flex justify-center">
                  <div className="relative w-32 h-32 rounded-md overflow-hidden">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      className="absolute top-1 right-1 bg-neutral-900/70 text-white rounded-full p-1 hover:bg-neutral-900 transition h-6 w-6"
                      onClick={handleRemove}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <FormMessage className="text-xs mt-2 text-center" />
          </FormItem>
        )}
      />
    );
  }
);

FileUpload.displayName = "FileUpload";
