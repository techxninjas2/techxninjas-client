import html2pdf from "html2pdf.js";

export default function DownloadButton() {
  const handleDownload = () => {
    const element = document.getElementById("resume-preview");
    if (element) {
      html2pdf().from(element).save("resume.pdf");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-4 bg-green-600 text-black px-4 py-2 rounded"
    >
      Download PDF
    </button>
  );
}
