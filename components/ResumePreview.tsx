import React from 'react';
import { ResumeData, Experience, Education } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  template: string;
  fontStyle: string;
  headingColor: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, fontStyle, headingColor }) => {
  const getTemplateLayout = () => {
    const commonStyles = {
      fontFamily: fontStyle,
      '--heading-color': headingColor,
    } as React.CSSProperties;

    switch (template) {
      case 'TechStack Pro':
        return (
          <div className="flex prose" style={commonStyles}>
            <div className="w-1/3 bg-gray-100 dark:bg-gray-700 p-6 text-gray-900 dark:text-gray-100">
              {data.profileImage && <img src={data.profileImage} alt="profile" className="w-32 h-32 rounded-full mx-auto mb-6" />}
              <h2 className="text-2xl font-bold mb-2" style={{ color: headingColor }}>{data.personal.name}</h2>
              <h3 className="text-xl mb-4">{data.personal.professionalTitle}</h3>
              <div className="space-y-2 text-sm">
                <p>{data.personal.email}</p>
                <p>{data.personal.phone}</p>
                <p>{data.personal.address}</p>
                <p><a href={data.personal.linkedin}>LinkedIn</a></p>
                <p><a href={data.personal.portfolio}>Portfolio</a></p>
              </div>
              <h3 className="text-lg font-bold mt-6 mb-3" style={{ color: headingColor }}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">{skill.skill}</span>
                ))}
              </div>
            </div>
            <div className="w-2/3 p-6">
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: data.personal.summary }} />
              <h3 className="text-xl font-bold mt-6 mb-4" style={{ color: headingColor }}>Experience</h3>
              {data.experience.map((exp: Experience, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{exp.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                    </div>
                    <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              ))}
              <h3 className="text-xl font-bold mt-6 mb-4" style={{ color: headingColor }}>Education</h3>
              {data.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{edu.degree}</p>
                      <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                    </div>
                    <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">GPA: {edu.gpa}</p>}
                </div>
              ))}
              <h3 className="text-xl font-bold mt-6 mb-4" style={{ color: headingColor }}>Projects</h3>
              {data.projects?.map((proj, index) => (
                <div key={index} className="mb-6">
                  <p className="font-bold text-lg">{proj.name}</p>
                  <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: proj.description }} />
                  <p>Technologies: {proj.technologies.join(', ')}</p>
                  <p>Outcomes: {proj.outcomes}</p>
                  {proj.url && <p><a href={proj.url}>Project Link</a></p>}
                </div>
              ))}
              <h3 className="text-xl font-bold mt-6 mb-4" style={{ color: headingColor }}>Certifications</h3>
              {data.certifications?.map((cert, index) => (
                <div key={index} className="mb-4">
                  <p className="font-bold">{cert.name}</p>
                  <p>{cert.organization}</p>
                  <p>Obtained: {cert.dateObtained} {cert.expirationDate && ` - Expires: ${cert.expirationDate}`}</p>
                </div>
              ))}
              {data.customSections?.map((section, index) => (
                <div key={index} className="mt-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: headingColor }}>{section.title}</h3>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.description }} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'Code Minimalist':
        return (
          <div className="p-8 prose" style={commonStyles}>
            <header className="border-b-2 pb-4 mb-6" style={{ borderColor: headingColor }}>
              <h1 className="text-3xl font-bold mb-2" style={{ color: headingColor }}>{data.personal.name}</h1>
              <h2>{data.personal.professionalTitle}</h2>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{data.personal.email}</span>
                <span>{data.personal.phone}</span>
                <span>{data.personal.address}</span>
                <span><a href={data.personal.linkedin}>LinkedIn</a></span>
                <span><a href={data.personal.portfolio}>Portfolio</a></span>
              </div>
            </header>
            
            <div className="grid grid-cols-[2fr,1fr] gap-8">
              <div>
                <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: data.personal.summary }} />
                
                <section>
                  <h2 className="text-xl font-bold mb-4" style={{ color: headingColor }}>Experience</h2>
                  {data.experience.map((exp, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-bold">{exp.title}</h3>
                        <span className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{exp.company} • {exp.location}</p>
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
                    </div>
                  ))}
                </section>

                {data.customSections?.map((section, index) => (
                  <section key={index} className="mt-6">
                    <h2 className="text-xl font-bold mb-4" style={{ color: headingColor }}>{section.title}</h2>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.description }} />
                  </section>
                ))}
              </div>

              <div>
                <section className="mb-6">
                  <h2 className="text-xl font-bold mb-4" style={{ color: headingColor }}>Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{skill.skill}</span>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-4" style={{ color: headingColor }}>Education</h2>
                  {data.education.map((edu, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-bold">{edu.degree}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        );

      case 'Executive Edge':
        return (
          <div className="p-8 prose" style={commonStyles}>
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4" style={{ color: headingColor }}>{data.personal.name}</h1>
              <div className="flex justify-center gap-6 text-gray-600 dark:text-gray-400">
                <span>{data.personal.email}</span>
                <span>{data.personal.phone}</span>
                <span>{data.personal.address}</span>
              </div>
            </header>

            <div className="max-w-3xl mx-auto">
              <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: data.personal.summary }} />

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: headingColor }}>Professional Experience</h2>
                {data.experience.map((exp, index) => (
                  <div key={index} className="mb-8">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <span className="text-gray-500">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">{exp.company} • {exp.location}</p>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
                  </div>
                ))}
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: headingColor }}>Education</h2>
                {data.education.map((edu, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <h3 className="text-xl font-bold">{edu.degree}</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400">{edu.institution}</p>
                      </div>
                      <span className="text-gray-500">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    {edu.gpa && <p className="text-gray-600 dark:text-gray-400 mt-1">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: headingColor }}>Core Competencies</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {data.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-gray-100 rounded text-gray-700">{skill.skill}</span>
                  ))}
                </div>
              </section>

              {data.customSections?.map((section, index) => (
                <section key={index} className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: headingColor }}>{section.title}</h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.description }} />
                </section>
              ))}
            </div>
          </div>
        );

      case 'Corporate Classic':
        return (
          <div className="p-8 prose" style={commonStyles}>
            <header className="border-b-2 pb-4 mb-6" style={{ borderColor: headingColor }}>
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: headingColor }}>{data.personal.name}</h1>
                  <div className="text-gray-600 dark:text-gray-400">
                    <p>{data.personal.email} • {data.personal.phone}</p>
                    <p>{data.personal.address}</p>
                  </div>
                </div>
                {data.profileImage && (
                  <img src={data.profileImage} alt="profile" className="w-24 h-24 rounded" />
                )}
              </div>
            </header>

            <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: data.personal.summary }} />

            <section className="mb-6">
              <h2 className="text-2xl font-bold mb-4 border-b" style={{ color: headingColor, borderColor: headingColor }}>
                Professional Experience
              </h2>
              {data.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{exp.company} • {exp.location}</p>
                    </div>
                    <span className="text-gray-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              ))}
            </section>

            <div className="grid grid-cols-2 gap-6">
              <section>
                <h2 className="text-2xl font-bold mb-4 border-b" style={{ color: headingColor, borderColor: headingColor }}>
                  Education
                </h2>
                {data.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                    <p className="text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 border-b" style={{ color: headingColor, borderColor: headingColor }}>
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded text-gray-700">{skill.skill}</span>
                  ))}
                </div>
              </section>
            </div>

            {data.customSections?.map((section, index) => (
              <section key={index} className="mt-6">
                <h2 className="text-2xl font-bold mb-4 border-b" style={{ color: headingColor, borderColor: headingColor }}>
                  {section.title}
                </h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.description }} />
              </section>
            ))}
          </div>
        );

      // Add more template cases as needed...
      default:
        return (
          <div className="p-8 prose" style={commonStyles}>
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2" style={{ color: headingColor }}>{data.personal.name}</h1>
              <div className="text-gray-600 dark:text-gray-400">
                <p>{data.personal.email} • {data.personal.phone}</p>
                <p>{data.personal.address}</p>
              </div>
            </header>

            <div className="max-w-3xl mx-auto">
              <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: data.personal.summary }} />

              <section className="mb-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: headingColor }}>Experience</h2>
                {data.experience.map((exp, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold">{exp.title}</h3>
                      <span className="text-gray-500">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{exp.company} • {exp.location}</p>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
                  </div>
                ))}
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: headingColor }}>Education</h2>
                {data.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                    <p className="text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: headingColor }}>Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded text-gray-700">{skill.skill}</span>
                  ))}
                </div>
              </section>

              {data.customSections?.map((section, index) => (
                <section key={index} className="mt-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: headingColor }}>{section.title}</h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.description }} />
                </section>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden print:shadow-none print:bg-white" style={{ fontFamily: fontStyle }}>
      {getTemplateLayout()}
    </div>
  );
};

export default ResumePreview; 