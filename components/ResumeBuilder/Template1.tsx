import { ResumeData } from "../../contexts/ResumeContext";

export default function Template1({ data }: { data: ResumeData }) {
  return (
    <div className="p-8 bg-white text-black max-w-4xl mx-auto font-serif">
      {/* Header */}
      <header className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold">
          {data.firstName} {data.surname}
        </h1>
        <p className="text-sm mt-1">
          {data.email} | {data.phone} | {data.city}, {data.country} {data.pinCode}
        </p>
      </header>

      {/* Experience Section */}
      <section className="mb-6">
        <h2 className="font-bold text-lg border-b pb-1 mb-3">EXPERIENCE</h2>
        <div className="mb-4">
          <div className="flex justify-between">
            <span className="font-bold">{data.experienceCompany}</span>
            <span className="text-sm italic">
              {data.startDate} – {data.endDate}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="italic">{data.experienceRole}</span>
            <span className="text-sm">{data.location}</span>
          </div>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            {data.description?.split("\n").map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-6">
        <h2 className="font-bold text-lg border-b pb-1 mb-3">EDUCATION</h2>
        <div className="mb-4">
          <div className="flex justify-between">
            <span className="font-bold">{data.institution}</span>
            <span className="text-sm italic">
              {data.eduStart} – {data.eduEnd}
            </span>
          </div>
          <div className="italic">{data.degree}</div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-6">
        <h2 className="font-bold text-lg border-b pb-1 mb-3">PROJECTS</h2>
        <div>
          <div className="font-bold">{data.projects}</div>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            {data.Projdescription?.split("\n").map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="font-bold text-lg border-b pb-1 mb-3">SKILLS</h2>
        <p className="text-sm">{data.skills}</p>
      </section>
    </div>
  );
}

