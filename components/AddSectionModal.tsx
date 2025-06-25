import React, { useState } from 'react';
import { X, Plus, GraduationCap, Briefcase, Target, Calendar, Trophy, AlignCenterVertical as Certificate, Globe, BookOpen, Heart, Languages, Award, Building } from 'lucide-react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'core' | 'recommended' | 'additional';

interface SectionItem {
  name: string;
  icon: React.ElementType;
  completed: boolean;
  recommended?: boolean;
  onClick: () => void;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('core');

  if (!isOpen) return null;

  // Mock data for sections (in real app, these would come from props or context)
  const coreSection: SectionItem[] = [
    { name: 'Add education', icon: GraduationCap, completed: false, onClick: () => alert('Education form coming soon!') },
    { name: 'Add position', icon: Briefcase, completed: false, onClick: () => alert('Experience form coming soon!') },
    { name: 'Add services', icon: Target, completed: false, onClick: () => alert('Services form coming soon!') },
    { name: 'Add career break', icon: Calendar, completed: false, onClick: () => alert('Career break form coming soon!') }
  ];

  const recommendedSection: SectionItem[] = [
    { name: 'Add featured', icon: Trophy, completed: false, recommended: true, onClick: () => alert('Featured section coming soon!') },
    { name: 'Add licenses & certifications', icon: Certificate, completed: false, recommended: true, onClick: () => alert('Certifications form coming soon!') },
    { name: 'Add projects', icon: Globe, completed: false, recommended: true, onClick: () => alert('Projects form coming soon!') },
    { name: 'Add courses', icon: BookOpen, completed: false, recommended: true, onClick: () => alert('Courses form coming soon!') },
    { name: 'Add recommendations', icon: Heart, completed: false, recommended: true, onClick: () => alert('Recommendations coming soon!') }
  ];

  const additionalSection: SectionItem[] = [
    { name: 'Add volunteer experience', icon: Heart, completed: false, onClick: () => alert('Volunteer form coming soon!') },
    { name: 'Add publications', icon: BookOpen, completed: false, onClick: () => alert('Publications form coming soon!') },
    { name: 'Add patents', icon: Award, completed: false, onClick: () => alert('Patents form coming soon!') },
    { name: 'Add honors & awards', icon: Trophy, completed: false, onClick: () => alert('Honors form coming soon!') },
    { name: 'Add test scores', icon: Target, completed: false, onClick: () => alert('Test scores form coming soon!') },
    { name: 'Add languages', icon: Languages, completed: false, onClick: () => alert('Languages form coming soon!') },
    { name: 'Add organizations', icon: Building, completed: false, onClick: () => alert('Organizations form coming soon!') },
    { name: 'Add causes', icon: Heart, completed: false, onClick: () => alert('Causes form coming soon!') }
  ];

  const tabs = [
    { 
      id: 'core' as TabType, 
      label: 'Core', 
      description: 'Start with the basics. Filling out these sections will help you be discovered by recruiters and people you may know',
      sections: coreSection 
    },
    { 
      id: 'recommended' as TabType, 
      label: 'Recommended', 
      description: 'Completing these sections will increase your credibility and give you access to more opportunities',
      sections: recommendedSection 
    },
    { 
      id: 'additional' as TabType, 
      label: 'Additional', 
      description: 'Add even more personality to your profile. These sections will help you grow your network and build more relationships',
      sections: additionalSection 
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const handleSectionClick = (section: SectionItem) => {
    section.onClick();
    onClose(); // Close modal after clicking a section
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add to profile</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Choose sections to enhance your professional profile
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentTab && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {currentTab.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {currentTab.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentTab.sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => handleSectionClick(section)}
                    className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-brand-primary dark:hover:border-brand-ninja-gold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-brand-primary bg-opacity-10 dark:bg-brand-ninja-gold dark:bg-opacity-10 rounded-lg mr-3 group-hover:bg-opacity-20">
                      <section.icon className="w-5 h-5 text-brand-primary dark:text-brand-ninja-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {section.name}
                        </span>
                        {section.completed && (
                          <div className="ml-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {section.recommended && (
                          <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0">
                            Rec
                          </span>
                        )}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0 group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold transition-colors" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Complete more sections to increase your profile strength and visibility
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;