import { useState, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

type FormInputProps = {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
};

export const FormInput = ({ form, name, label, placeholder = " ", type = "text", className, required = false }: FormInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              type={type}
              className={cn(
                "w-full border border-neutral-300 rounded-lg p-4 pt-5 pb-3 focus:outline-none focus:ring-2 focus:ring-primary transition input-with-floating-label",
                className
              )}
              required={required}
            />
          </FormControl>
          <FormLabel className="floating-label absolute text-neutral-500 left-4 top-4 pointer-events-none">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormMessage className="text-xs mt-1" />
        </FormItem>
      )}
    />
  );
};

type SelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = {
  form: any;
  name: string;
  label: string;
  options: SelectOption[];
  className?: string;
  required?: boolean;
};

export const FormSelect = ({ form, name, label, options, className, required = false }: FormSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger 
                className={cn(
                  "w-full border border-neutral-300 rounded-lg p-4 pt-5 pb-3 focus:outline-none focus:ring-2 focus:ring-primary transition h-auto text-left input-with-floating-label",
                  className
                )}
              >
                <SelectValue placeholder=" " />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormLabel className="floating-label absolute text-neutral-500 left-4 top-4 pointer-events-none">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-neutral-500" />
          </div>
          <FormMessage className="text-xs mt-1" />
        </FormItem>
      )}
    />
  );
};
