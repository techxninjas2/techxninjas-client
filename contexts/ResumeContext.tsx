import { createContext, useContext, useState, ReactNode } from "react";

export type ResumeData = {
  firstName: string;
  surname: string;
  city: string;
  country: string;
  pinCode: string;
  phone: string;
  email: string;
  education: string;
  skills: string;
  projects: string;
  experienceRole: string;
  experienceCompany: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  degree: string;
  institution: string;
  eduStart: string;
  eduEnd: string;
  Projdescription: string;
};

type ResumeContextType = {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  template: string;
  setTemplate: (template: string) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    firstName: "",
    surname: "",
    city: "",
    country: "",
    pinCode: "",
    phone: "",
    email: "",
    education: "",
    skills: "",
    projects: "",
    experienceRole: "",
    experienceCompany: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    degree: "",
    institution: "",
    eduStart: "",
    eduEnd: "",
    Projdescription: "",
  });

  const [template, setTemplate] = useState("template1");

  return (
    <ResumeContext.Provider
      value={{ resumeData, setResumeData, template, setTemplate }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used inside ResumeProvider");
  return ctx;
};
