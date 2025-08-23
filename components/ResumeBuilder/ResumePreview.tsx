// ResumePreview.tsx
import React from "react";
import { useResume } from "../../contexts/ResumeContext";
import Template1 from "./Template1";

const ResumePreview: React.FC = () => {
  const { resumeData } = useResume();

  return <Template1 data={resumeData} />;
};

export default ResumePreview;


