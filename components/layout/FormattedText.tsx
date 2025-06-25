import React from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

interface FormatProps {
  content: string;
  className?: string;
}

const FormattedText: React.FC<FormatProps> = ({ content, className }) => {
  const cleanHTML = DOMPurify.sanitize(content);

  return <div className={className}>{parse(cleanHTML)}</div>;
};

export default FormattedText;