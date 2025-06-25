
import { Event } from './types';

export const BRAND_NAME = "TechXNinjas";

// Gemini API Model Name
export const GEMINI_MODEL_TEXT_GENERATION = 'gemini-2.5-flash-preview-04-17';
// For image generation, if used: export const GEMINI_MODEL_IMAGE_GENERATION = 'imagen-3.0-generate-002';

export const WHATSAPP_COMMUNITY_LINK = "https://chat.whatsapp.com/KTGVdxdO5nTBsy53eG4zOr"; // Updated WhatsApp link

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'CodeCrush Hackathon 2024',
    organizer: 'TechXNinjas HQ',
    description: 'Join the ultimate coding challenge and build innovative solutions. Prizes, learning, and fun await!',
    mode: 'Online',
    tags: ['AI', 'Web Dev', 'Mobile', 'Blockchain'],
    deadline: '2024-09-15T23:59:59Z',
    registrationLink: '#',
    imageUrl: 'https://picsum.photos/seed/event1/400/200',
  },
  {
    id: '2',
    title: 'Intro to Quantum Computing Workshop',
    organizer: 'QuantumLeap Inc.',
    description: 'A beginner-friendly workshop to understand the fundamentals of quantum computing and its potential.',
    mode: 'Offline',
    tags: ['Quantum', 'Workshop', 'Physics'],
    deadline: '2024-08-30T23:59:59Z',
    registrationLink: '#',
    imageUrl: 'https://picsum.photos/seed/event2/400/200',
  },
  {
    id: '3',
    title: 'CyberSecurity Capture The Flag',
    organizer: 'SecureNet Community',
    description: 'Test your hacking skills in a thrilling CTF competition. Challenges for all skill levels.',
    mode: 'Hybrid',
    tags: ['CyberSecurity', 'CTF', 'Networking'],
    deadline: '2024-10-01T23:59:59Z',
    registrationLink: '#',
    imageUrl: 'https://picsum.photos/seed/event3/400/200',
  },
];

export const MOCK_TESTIMONIALS = [
  {
    name: 'Mohammad A.',
    designation: 'Intern @ Buddi AI',
    review: 'I started with zero idea about coding, but today I’m interning at a real tech company — thanks to TechXNinjas’ weekly sessions!',
    avatarUrl: `https://ui-avatars.com/api/?name=Mohammad+A&background=random&color=fff`
  },
  {
    name: 'Rahul R.',
    designation: 'MTS Backend @ Aquera',
    review: 'They don’t just teach, they walk with you through the learning path. I’ve never been more confident in my skills.',
    avatarUrl: `https://ui-avatars.com/api/?name=Rahul+R&background=random&color=fff`
  },
  {
    name: 'Santhosh M.',
    designation: 'DevOps @ DP World',
    review: 'The best part? No pressure. Just progress. The community is super supportive!',
    avatarUrl: `https://ui-avatars.com/api/?name=Santhosh+M&background=random&color=fff`
  }
];

export const MOCK_MENTORS = [
  { name: 'Sahil Chopra', role: 'SDE', company: 'SCI BI', avatarUrl: `https://ui-avatars.com/api/?name=Sahil+C&background=random&color=fff` },
  { name: 'Akshay Gagrani', role: 'SDE', company: 'Myntra', avatarUrl: `https://ui-avatars.com/api/?name=Akshay+G&background=random&color=fff` },
  { name: 'Ayushi S.', role: 'SDE 3', company: 'Microsoft', avatarUrl: `https://ui-avatars.com/api/?name=Ayushi+S&background=random&color=fff` },
  { name: 'Mohit Sharma', role: 'SDE 2', company: 'Amazon', avatarUrl: `https://ui-avatars.com/api/?name=Mohit+S&background=random&color=fff` },
  { name: 'Shantanu K.', role: 'SDE 2', company: 'Intuit', avatarUrl: `https://ui-avatars.com/api/?name=Shantanu+K&background=random&color=fff` },
];

// Add more constants as needed