import React, { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { jsPDF } from 'jspdf';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import CodeBlock from '@tiptap/extension-code-block';
import { useAuth } from '../../contexts/AuthContext';
import { getUserResumes, saveResume, getResumeById, deleteResume } from '../../services/resumeService';
import { Resume, ResumeData, Experience, Education } from '../../types';
import ResumePreview from '../ResumePreview';
import useDebounce from '../../hooks/useDebounce';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import html2canvas from 'html2canvas';

const TiptapEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, BulletList, OrderedList, ListItem, CodeBlock],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="mt-4">
      <div className="flex space-x-2 mb-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`} title="Bold">
          B
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`} title="Italic">
          I
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`} title="Bullet List">
          •
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`} title="Numbered List">
          1.
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`px-2 py-1 rounded ${editor.isActive('codeBlock') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}`} title="Code Block">
          &lt;/&gt;
        </button>
      </div>
      <EditorContent editor={editor} className="bg-white dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-600 rounded-md prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100" />
    </div>
  );
};

interface CustomSection {
  id: string;
  title: string;
  description: string;
}

type ResumeFormData = Resume['data'] & {
  customSections: CustomSection[];
  profileImage?: string;
};

const dummyData: ResumeFormData = {
  personal: {
    name: 'John Doe',
    professionalTitle: 'Software Engineer',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: 'New York, NY',
    linkedin: 'linkedin.com/in/johndoe',
    portfolio: 'johndoe.com',
    summary: 'A passionate developer with experience in building web applications using modern technologies.'
  },
  experience: [
    {
      title: 'Software Engineer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: 'Developing and maintaining web applications using React and Node.js.'
    }
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'University of Technology',
      location: 'New York, NY',
      startDate: '2016',
      endDate: '2020',
      gpa: '3.8'
    }
  ],
  skills: [{ skill: 'JavaScript' }, { skill: 'React' }, { skill: 'Node.js' }, { skill: 'HTML/CSS' }],
  projects: [
    {
      name: 'E-commerce Platform',
      description: 'Developed a full-stack e-commerce application.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      outcomes: 'Increased user engagement by 30%'
    }
  ],
  certifications: [
    {
      name: 'AWS Certified Developer',
      organization: 'Amazon Web Services',
      dateObtained: '2022',
      expirationDate: '2025'
    }
  ],
  languages: [
    {
      name: 'English',
      proficiency: 'Native'
    },
    {
      name: 'Spanish',
      proficiency: 'Intermediate'
    }
  ],
  volunteerWork: [
    {
      organization: 'Local Food Bank',
      role: 'Volunteer Coordinator',
      dates: '2018 - Present',
      description: 'Organized food drives and managed volunteer schedules.'
    }
  ],
  awards: [
    {
      name: 'Employee of the Year',
      issuer: 'Tech Innovations Inc.',
      date: '2022',
      description: 'Recognized for outstanding performance.'
    }
  ],
  publications: [
    {
      title: 'Advances in Web Development',
      publisher: 'Tech Journal',
      date: '2023',
      url: 'techjournal.com/article'
    }
  ],
  references: [
    {
      name: 'Jane Smith',
      relationship: 'Former Manager',
      contact: 'jane.smith@example.com'
    }
  ],
  customSections: [
    {
      id: 'custom1',
      title: 'Hobbies',
      description: 'Reading, Hiking, Coding'
    }
  ],
  profileImage: 'https://via.placeholder.com/150'
};

const ResumeBuilderPage: React.FC = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [fontStyle, setFontStyle] = useState<string>('Arial');
  const [headingColor, setHeadingColor] = useState<string>('#000000');
  const previewRef = useRef<HTMLDivElement>(null);
  const defaultOrder: SectionKey[] = ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'volunteerWork', 'awards', 'publications', 'references', 'customSections'];
  const defaultVisible = defaultOrder.reduce((acc, s) => ({...acc, [s]: true}), {}) as { [key in SectionKey]: boolean };
  type SectionKey = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'volunteerWork' | 'awards' | 'publications' | 'references' | 'customSections';
  const [sectionsOrder, setSectionsOrder] = useState<SectionKey[]>(defaultOrder);
  const [visibleSections, setVisibleSections] = useState<{ [key in SectionKey]: boolean }>(defaultVisible);
  const { register, control, handleSubmit, reset, watch } = useForm<ResumeFormData>();
  const formData = watch();
  const debouncedFormData = useDebounce(formData, 2000);
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray<ResumeFormData, 'experience'>({ control, name: 'experience' });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray<ResumeFormData, 'education'>({ control, name: 'education' });
  const { fields: skillsFields, append: appendSkill, remove: removeSkill } = useFieldArray<ResumeFormData, 'skills'>({ control, name: 'skills' });
  const { fields: customSectionsFields, append: appendCustomSection, remove: removeCustomSection } = useFieldArray<ResumeFormData, 'customSections'>({ control, name: 'customSections' });
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control, name: 'projects' });
  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({ control, name: 'certifications' });
  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({ control, name: 'languages' });
  const { fields: volunteerFields, append: appendVolunteer, remove: removeVolunteer } = useFieldArray({ control, name: 'volunteerWork' });
  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({ control, name: 'awards' });
  const { fields: publicationFields, append: appendPublication, remove: removePublication } = useFieldArray({ control, name: 'publications' });
  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({ control, name: 'references' });
  const templates = [
    'TechStack Pro', 'Code Minimalist', 'Executive Edge', 'Corporate Classic',
    'Creative Canvas', 'Portfolio Showcase', 'Medical Professional', 'Clinical Focus',
    'Brand Builder', 'Sales Champion', 'Academic Scholar', 'Teaching Excellence',
    'Legal Authority', 'Service Excellence'
  ] as const;
  const fontOptions = ['Arial', 'Times New Roman', 'Helvetica', 'Garamond', 'Calibri', 'Georgia', 'Courier New', 'Verdana', 'Lato', 'Roboto', 'Inter', 'Source Sans Pro', 'JetBrains Mono', 'Open Sans', 'Playfair Display', 'Montserrat', 'Nunito Sans', 'Poppins', 'Oswald', 'Roboto Condensed', 'Crimson Text', 'Source Serif Pro', 'Merriweather'];

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  useEffect(() => {
    if (selectedResume) {
      setSelectedTemplate(selectedResume.template);
      reset(selectedResume.data);
      setSectionsOrder((selectedResume.data.sectionsOrder || defaultOrder) as SectionKey[]);
      setVisibleSections((selectedResume.data.visibleSections || defaultVisible) as { [key in SectionKey]: boolean });
    }
  }, [selectedResume, reset]);

  useEffect(() => {
    const autoSave = async () => {
      if (selectedResume && debouncedFormData) {
        const updatedResume = { ...selectedResume, data: { ...debouncedFormData, sectionsOrder, visibleSections }, template: selectedTemplate };
        const saved = await saveResume(updatedResume);
        if (!selectedResume.id && saved.id) {
          setSelectedResume(saved);
        }
      }
    };
    autoSave();
  }, [debouncedFormData, selectedTemplate, sectionsOrder, visibleSections]);

  const fetchResumes = async () => {
    if (user) {
      const userResumes = await getUserResumes(user.id);
      setResumes(userResumes);
    }
  };

  const onSubmit = async (data: ResumeFormData) => {
    if (user && selectedResume) {
      const updatedResume = { ...selectedResume, data, template: selectedTemplate };
      await saveResume(updatedResume);
      fetchResumes();
    }
  };

  const handleTemplateSelect = (template: string) => {
    const placeholderData = {
      personal: {
        name: 'Your Full Name',
        professionalTitle: 'Your Professional Title',
        email: 'your.email@example.com',
        phone: '(123) 456-7890',
        address: 'City, State, ZIP Code',
        linkedin: 'linkedin.com/in/yourprofile',
        portfolio: 'yourportfolio.com',
        summary: '<p>Brief overview of your qualifications and career objectives.</p>'
      },
      experience: [{
        title: 'Job Title',
        company: 'Company Name',
        location: 'City, State',
        startDate: 'Month Year',
        endDate: 'Month Year or Present',
        description: '<ul><li>Achievement or responsibility</li><li>Another bullet point</li></ul>'
      }],
      education: [{
        degree: 'Degree Type',
        institution: 'Institution Name',
        location: 'City, State',
        startDate: 'Year',
        endDate: 'Year',
        gpa: '3.5 (optional)'
      }],
      skills: [{ skill: 'Skill 1' }, { skill: 'Skill 2' }],
      projects: [{
        name: 'Project Name',
        description: '<p>Project description</p>',
        technologies: ['Tech1', 'Tech2'],
        outcomes: 'Project outcomes and impact',
        url: 'projecturl.com (optional)'
      }],
      certifications: [{
        name: 'Certification Name',
        organization: 'Issuing Organization',
        dateObtained: 'Month Year',
        expirationDate: 'Month Year (optional)'
      }],
      languages: [{
        name: 'Language',
        proficiency: 'Proficiency Level (e.g., Native, Fluent)'
      }],
      volunteerWork: [{
        organization: 'Organization Name',
        role: 'Role',
        dates: 'Dates',
        description: '<p>Description of volunteer work</p>'
      }],
      awards: [{
        name: 'Award Name',
        issuer: 'Issuer',
        date: 'Date',
        description: 'Description (optional)'
      }],
      publications: [{
        title: 'Publication Title',
        publisher: 'Publisher',
        date: 'Date',
        url: 'URL (optional)'
      }],
      references: [{
        name: 'Reference Name',
        relationship: 'Relationship',
        contact: 'Contact Information'
      }],
      customSections: [{
        id: 'custom1',
        title: 'Custom Section Title',
        description: '<p>Custom content</p>'
      }]
    };
    const newResume: Partial<Resume> = {
      user_id: user ? user.id : 'demo-user-id',
      name: 'New Resume',
      data: placeholderData,
      template: template
    };
    setSelectedResume(newResume as Resume);
    setSelectedTemplate(template);
    reset(placeholderData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFormData = { ...formData, profileImage: reader.result as string };
        reset(newFormData);
      };
      reader.readAsDataURL(file);
    }
  };

  const createNewResume = () => {
    handleTemplateSelect('modern');
  };

  const selectResume = async (id: string) => {
    const resume = await getResumeById(id);
    setSelectedResume(resume);
    reset(resume.data);
  };

  const handleDelete = async (id: string) => {
    await deleteResume(id);
    fetchResumes();
    setSelectedResume(null);
  };

  function stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  const exportToPDF = async () => {
    if (previewRef.current) {
      const htmlElement = document.documentElement;
      const wasDark = htmlElement.classList.contains('dark');
      if (wasDark) {
        htmlElement.classList.remove('dark');
      }

      // Allow styles to update
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`resume-${selectedTemplate}.pdf`);
      } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Failed to export PDF. Please check the console for details.');
      } finally {
        if (wasDark) {
          htmlElement.classList.add('dark');
        }
      }
    } else {
      console.error('Preview reference is not available.');
      alert('Failed to export PDF. Preview is not available.');
    }
  };

  const exportToWord = async () => {
    // Similar to the PDF export, this is a simplified version.
    // A more robust solution would be to create a docx file with the correct styling.
    const children = [
      new Paragraph({
        alignment: 'center',
        children: [new TextRun({ text: formData.personal.name, bold: true, size: 48 })],
      }),
      new Paragraph({
        alignment: 'center',
        children: [new TextRun({ text: `${formData.personal.email} | ${formData.personal.phone} | ${formData.personal.address}`, size: 24 })],
      }),
      new Paragraph({
        children: [new TextRun({ text: formData.personal.summary, size: 24 })],
      }),
    ];

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `resume-${selectedTemplate}.docx`);
  };

  const getTemplateStyle = (template: string) => {
    const styles: { [key: string]: { fontFamily: string; color: string } } = {
      'TechStack Pro': { fontFamily: 'Source Sans Pro', color: '#2563EB' },
      'Code Minimalist': { fontFamily: 'Open Sans', color: '#10B981' },
      'Executive Edge': { fontFamily: 'Lato', color: '#1F2937' },
      'Corporate Classic': { fontFamily: 'Arial', color: '#374151' },
      'Creative Canvas': { fontFamily: 'Nunito Sans', color: '#EC4899' },
      'Portfolio Showcase': { fontFamily: 'Poppins', color: '#F59E0B' },
      'Medical Professional': { fontFamily: 'Open Sans', color: '#059669' },
      'Clinical Focus': { fontFamily: 'Source Sans Pro', color: '#DC2626' },
      'Brand Builder': { fontFamily: 'Lato', color: '#7C3AED' },
      'Sales Champion': { fontFamily: 'Roboto', color: '#DC2626' },
      'Academic Scholar': { fontFamily: 'Source Serif Pro', color: '#1D4ED8' },
      'Teaching Excellence': { fontFamily: 'Open Sans', color: '#059669' },
      'Legal Authority': { fontFamily: 'Times New Roman', color: '#1F2937' },
      'Service Excellence': { fontFamily: 'Lato', color: '#B45309' },
    };
    const style = styles[template] || {};
    return { ...style, fontFamily: fontStyle, color: headingColor };
  };

  const TemplatePreview: React.FC<{ templateName: string; onClick: () => void; }> = ({ templateName, onClick }) => {
    const style = getTemplateStyle(templateName);
    const templateDisplayName = templateName.charAt(0).toUpperCase() + templateName.slice(1);
    const isImageTemplate = templateName.includes('image');

    return (
      <div onClick={onClick} className="cursor-pointer group">
        <div
          className="p-4 border-2 rounded-lg transition-all transform group-hover:scale-105 group-hover:border-blue-500 bg-white shadow-md"
          style={{ ...style, fontSize: '10px' }}
        >
          {isImageTemplate && (
            <div className={`flex ${templateName === 'image-left' ? 'flex-row' : 'flex-row-reverse'}`}>
              <img src={dummyData.profileImage} alt="profile" className="w-16 h-16 rounded-full" />
              <div className="ml-4">
                <h3 className="font-bold text-lg" style={{ color: style.color }}>{dummyData.personal.name}</h3>
                <p>{dummyData.personal.email}</p>
              </div>
            </div>
          )}
          {!isImageTemplate && <h3 className="font-bold text-lg" style={{ color: style.color }}>{dummyData.personal.name}</h3>}
          {!isImageTemplate && <p>{dummyData.personal.email}</p>}
          <hr className="my-2" />
          <h4 className="font-bold">Experience</h4>
          <p>{dummyData.experience[0].title} at {dummyData.experience[0].company}</p>
          <h4 className="font-bold mt-2">Education</h4>
          <p>{dummyData.education[0].degree}</p>
          <h4 className="font-bold mt-2">Skills</h4>
          <p>{dummyData.skills.map(s => s.skill).join(', ')}</p>
          <h4 className="font-bold mt-2">{dummyData.customSections[0].title}</h4>
          <p>{dummyData.customSections[0].description}</p>
        </div>
        <p className="text-center mt-2 font-semibold text-gray-700 dark:text-gray-300">{templateDisplayName}</p>
      </div>
    );
  };

  const sectionComponents: { [key in SectionKey]: React.ReactNode } = {
    personal: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Personal Information <span title="Full name, professional title, contact details, LinkedIn, portfolio">?</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input 
              {...register('personal.name', { required: 'Name is required' })} 
              placeholder="Name" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
            />
            {formData.personal?.name === '' && <p className="text-red-500 text-sm mt-1">Name is required</p>}
          </div>
          <div>
            <input 
              {...register('personal.professionalTitle')} 
              placeholder="Professional Title" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div>
            <input 
              {...register('personal.email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} 
              placeholder="Email" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
            />
            {formData.personal?.email === '' && <p className="text-red-500 text-sm mt-1">Email is required</p>}
          </div>
          <div>
            <input 
              {...register('personal.phone', { required: 'Phone is required' })} 
              placeholder="Phone" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
            />
            {formData.personal?.phone === '' && <p className="text-red-500 text-sm mt-1">Phone is required</p>}
          </div>
          <div>
            <input 
              {...register('personal.address')} 
              placeholder="Address" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div>
            <input 
              {...register('personal.linkedin')} 
              placeholder="LinkedIn Profile" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div>
            <input 
              {...register('personal.portfolio')} 
              placeholder="Portfolio Website" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
            />
          </div>
        </div>
        <Controller
          name="personal.summary"
          control={control}
          render={({ field }) => (
            <TiptapEditor
              value={field.value || ''}
              onChange={field.onChange}
            />
          )}
        />
      </section>
    ),
    experience: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Experience <span title="Job title, company, dates, location, achievements">?</span></h3>
        {experienceFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                {...register(`experience.${index}.title`, { required: 'Title is required' })} 
                placeholder="Title" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
              <input 
                {...register(`experience.${index}.company`, { required: 'Company is required' })} 
                placeholder="Company" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
              <input 
                {...register(`experience.${index}.location`)} 
                placeholder="Location" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
              <input 
                {...register(`experience.${index}.startDate`, { required: 'Start Date is required' })} 
                placeholder="Start Date" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
              <input 
                {...register(`experience.${index}.endDate`)} 
                placeholder="End Date" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
            </div>
            <Controller
              name={`experience.${index}.description`}
              control={control}
              render={({ field }) => (
                <TiptapEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              )}
            />
            <button 
              type="button" 
              onClick={() => removeExperience(index)} 
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => appendExperience({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' })} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Experience
        </button>
      </section>
    ),
    education: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Education</h3>
        {educationFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                {...register(`education.${index}.degree`, { required: 'Degree is required' })} 
                placeholder="Degree" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
              <input 
                {...register(`education.${index}.institution`, { required: 'Institution is required' })} 
                placeholder="Institution" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
              <input 
                {...register(`education.${index}.location`)} 
                placeholder="Location" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
              <input 
                {...register(`education.${index}.startDate`, { required: 'Start Date is required' })} 
                placeholder="Start Date" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
              <input 
                {...register(`education.${index}.endDate`)} 
                placeholder="End Date" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
              <input 
                {...register(`education.${index}.gpa`)} 
                placeholder="GPA" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              />
            </div>
            <button 
              type="button" 
              onClick={() => removeEducation(index)} 
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => appendEducation({ degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' })} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Education
        </button>
      </section>
    ),
    skills: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Skills</h3>
        {skillsFields.map((field, index) => (
          <div key={field.id} className="mb-2 flex items-center">
            <input 
              {...register(`skills.${index}.skill`, { required: 'Skill is required' })} 
              placeholder="Skill" 
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
            />
            <button 
              type="button" 
              onClick={() => removeSkill(index)} 
              className="ml-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => appendSkill({ skill: '' })} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Skill
        </button>
      </section>
    ),
    projects: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Projects <span title="Project name, description, technologies used, outcomes/impact">?</span></h3>
        {projectFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
            <input {...register(`projects.${index}.name`)} placeholder="Project Name" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <Controller name={`projects.${index}.description`} control={control} render={({ field }) => <TiptapEditor value={field.value || ''} onChange={field.onChange} />} />
            <Controller name={`projects.${index}.technologies`} control={control} render={({ field }) => (
              <input value={field.value?.join(', ') || ''} onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} placeholder="Technologies (comma separated)" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            )} />
            <input {...register(`projects.${index}.outcomes`)} placeholder="Outcomes/Impact" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`projects.${index}.url`)} placeholder="Project URL (optional)" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <button type="button" onClick={() => removeProject(index)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendProject({ name: '', description: '', technologies: [], outcomes: '', url: '' })} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Add Project</button>
      </section>
    ),
    certifications: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Certifications <span title="Certification name, issuing organization, date obtained, expiration date">?</span></h3>
        {certificationFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register(`certifications.${index}.name`)} placeholder="Certification Name" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white" />
            <input {...register(`certifications.${index}.organization`)} placeholder="Issuing Organization" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white" />
            <input {...register(`certifications.${index}.dateObtained`)} placeholder="Date Obtained" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white" />
            <input {...register(`certifications.${index}.expirationDate`)} placeholder="Expiration Date (optional)" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white" />
            <button type="button" onClick={() => removeCertification(index)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors col-span-2">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendCertification({ name: '', organization: '', dateObtained: '', expirationDate: '' })} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Add Certification</button>
      </section>
    ),
    languages: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Languages <span title="Language name, proficiency level">?</span></h3>
        {languageFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register(`languages.${index}.name`)} placeholder="Language Name" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white" />
            <select {...register(`languages.${index}.proficiency`)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white">
              <option value="">Select Proficiency</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Native">Native</option>
            </select>
            <button type="button" onClick={() => removeLanguage(index)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors col-span-2">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendLanguage({ name: '', proficiency: '' })} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Add Language</button>
      </section>
    ),
    volunteerWork: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Volunteer Work</h3>
        {volunteerFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
            <input {...register(`volunteerWork.${index}.organization`)} placeholder="Organization Name" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`volunteerWork.${index}.role`)} placeholder="Role" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`volunteerWork.${index}.dates`)} placeholder="Dates (e.g., 2018 - Present)" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <Controller name={`volunteerWork.${index}.description`} control={control} render={({ field }) => <TiptapEditor value={field.value || ''} onChange={field.onChange} />} />
            <button type="button" onClick={() => removeVolunteer(index)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendVolunteer({ organization: '', role: '', dates: '', description: '' })} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Add Volunteer Work</button>
      </section>
    ),
    awards: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Awards</h3>
        {awardFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
            <input {...register(`awards.${index}.name`)} placeholder="Award Name" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`awards.${index}.issuer`)} placeholder="Issuer" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`awards.${index}.date`)} placeholder="Date" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <Controller name={`awards.${index}.description`} control={control} render={({ field }) => <TiptapEditor value={field.value || ''} onChange={field.onChange} />} />
            <button type="button" onClick={() => removeAward(index)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendAward({ name: '', issuer: '', date: '', description: '' })} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Add Award</button>
      </section>
    ),
    publications: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Publications</h3>
        {publicationFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
            <input {...register(`publications.${index}.title`)} placeholder="Publication Title" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`publications.${index}.publisher`)} placeholder="Publisher" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`publications.${index}.date`)} placeholder="Date" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`publications.${index}.url`)} placeholder="URL (optional)" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <button type="button" onClick={() => removePublication(index)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendPublication({ title: '', publisher: '', date: '', url: '' })} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Add Publication</button>
      </section>
    ),
    references: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">References</h3>
        {referenceFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
            <input {...register(`references.${index}.name`)} placeholder="Reference Name" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`references.${index}.relationship`)} placeholder="Relationship" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <input {...register(`references.${index}.contact`)} placeholder="Contact Information" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white mb-2" />
            <button type="button" onClick={() => removeReference(index)} className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendReference({ name: '', relationship: '', contact: '' })} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Add Reference</button>
      </section>
    ),
    customSections: (
      <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Custom Sections</h3>
        {customSectionsFields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
            <input
              {...register(`customSections.${index}.title`, { required: 'Title is required' })}
              placeholder="Section Title"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
            />
            <Controller
              name={`customSections.${index}.description`}
              control={control}
              render={({ field }) => (
                <TiptapEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              )}
            />
            <button
              type="button"
              onClick={() => removeCustomSection(index)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Remove Section
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendCustomSection({ id: `custom-${Date.now()}`, title: '', description: '' })}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Custom Section
        </button>
      </section>
    )
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Resume Builder</h1>
      {!selectedResume ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <button
            onClick={createNewResume}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Resume
          </button>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Multiple professionally designed templates with industry-specific options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map(template => (
                <TemplatePreview
                  key={template}
                  templateName={template}
                  onClick={() => handleTemplateSelect(template)}
                />
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Saved Resumes</h2>
            <ul className="space-y-4">
              {resumes.length === 0 ? (
                <li className="text-gray-500 dark:text-gray-400">No resumes created yet.</li>
              ) : (
                resumes.map(resume => (
                  <li key={resume.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <span className="text-gray-800 dark:text-white">{resume.name}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => selectResume(resume.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {selectedTemplate.includes('image') && (
              <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Profile Image</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
                />
                {formData.profileImage && (
                  <img src={formData.profileImage} alt="profile" className="mt-4 w-32 h-32 rounded-full" />
                )}
              </section>
            )}
            <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Font Style</h3>
              <select
                value={fontStyle}
                onChange={(e) => setFontStyle(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </section>
            <section className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Heading Color</h3>
              <input
                type="color"
                value={headingColor}
                onChange={(e) => setHeadingColor(e.target.value)}
                className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600"
              />
            </section>
            <DragDropContext onDragEnd={(result: DropResult) => {
              if (!result.destination) return;
              const newOrder = Array.from(sectionsOrder);
              const [removed] = newOrder.splice(result.source.index, 1);
              newOrder.splice(result.destination.index, 0, removed);
              setSectionsOrder(newOrder);
            }}>
              <Droppable droppableId="sections">
                {(provided: DroppableProvided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {sectionsOrder.map((section, index) => (
                      <Draggable key={section} draggableId={section} index={index} isDragDisabled={false}>
                        {(provided: DraggableProvided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="my-4">
                            <div className="flex items-center mb-2">
                              <span className="cursor-move mr-2">☰</span>
                              <h3 className="text-lg font-semibold">{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
                              <label className="ml-4">
                                Include
                                <input 
                                  type="checkbox" 
                                  checked={visibleSections[section] === true} 
                                  onChange={(e) => setVisibleSections({...visibleSections, [section]: Boolean(e.target.checked)})} 
                                  className="ml-2" 
                                />
                              </label>
                            </div>
                            {sectionComponents[section]}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Save Resume
            </button>
          </form>
          <div className="p-6 rounded-lg shadow-md border overflow-auto max-h-[80vh]">
            <div ref={previewRef} className="bg-white">
              <ResumePreview data={formData} template={selectedTemplate} fontStyle={fontStyle} headingColor={headingColor} />
            </div>
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={exportToPDF} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Export PDF
              </button>
              <button 
                onClick={exportToWord} 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Export Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderPage; 