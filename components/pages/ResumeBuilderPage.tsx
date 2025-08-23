// pages/ResumeBuilderPage.tsx
import { ResumeProvider } from "../../contexts/ResumeContext";
import ResumeForm from "../ResumeBuilder/ResumeForm";
import ResumePreview from "../ResumeBuilder/ResumePreview";
import DownloadButton from "../ResumeBuilder/DownloadButton";
import { useResume } from "../../contexts/ResumeContext";

function ResumeBuilderContent() {
  const { setTemplate } = useResume();

  return (
//    <ResumeProvider>
      <div className="grid grid-cols-2 h-screen">
        <div className="overflow-y-auto">
          <ResumeForm />
        </div>
        <div className="overflow-y-auto p-4 bg-gray-100">
          <div id="resume-preview">
            <ResumePreview />
          </div>
          <DownloadButton />
        </div>
      </div>
//    </ResumeProvider>
  );
}

export default function ResumeBuilderPage() {
  return (
    <ResumeProvider>
      <ResumeBuilderContent />
    </ResumeProvider>
  );
}
