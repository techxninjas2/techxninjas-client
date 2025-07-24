# 🌐 TechXNinjas – The Student-Centric Tech Community Platform

Welcome to the official repository of **TechXNinjas**, a student-first community
platform built to empower learners across India (and beyond) with tech
resources, events, articles, courses, and collaboration opportunities — all
under one roof.

---

<details>
  <summary><strong>📑 Table of Contents</strong></summary>
  
- [🚀 What is TechXNinjas?](#-what-is-techxninjas)
- [🧩 Key Features](#-key-features)
    - [✅ Public Features](#-public-features)
    - [🔐 Logged-in User Features](#-logged-in-user-features)
- [⚙️ Tech Stack](#️-tech-stack)
- [📋 GSSoC 2025 Contributor Task Board](#-gssoc-2025-contributor-task-board)
- [🔑 Environment Variables](#-environment-variables)
- [🧪 How to Run Locally](#-how-to-run-locally)
- [🤝 Contribution Guide](#-contribution-guide)
- [💬 Join Our Community Discussions!](#-join-our-community-discussions)
- [👨‍💻 Maintainers](#-maintainers)
- [📄 License](#-license)

</details>

---

## 🚀 What is TechXNinjas?

**TechXNinjas** is a full-fledged, production-ready community platform that:

- Showcases student-centric **events**, **hackathons**, **giveaways**, and more.
- Publishes valuable **articles**, **technical blogs**, and **career tips**.
- Offers community-built and mentor-led **courses** for learning.
- Features **creator dashboards** and **user profiles**.
- Encourages **collaboration** and real-world **open-source** exposure.

This platform is already deployed and being used live by thousands of students
across colleges and universities.

---

## 🧩 Key Features

### ✅ Public Features:

- 🎯 **Homepage** with live announcements and CTAs
- 📰 **Articles & Blogs** page with filters and individual article pages
- 🎓 **Courses** page with detailed overviews
- 📅 **Events** page showcasing upcoming & past events with detail view
- 📤 **Contact Us** form for queries
- 👨‍💼 **Public User Profiles** for members, contributors, and mentors
- 📃 **Static Pages**: About Us, Privacy Policy, Terms, etc.

### 🔐 Logged-in User Features:

- 🧑 **User Dashboard** with saved content, uploads, and details
- 📈 **Creator Dashboard** for article/course submission
- ✍️ Article/Course **submission editor** (in development)

---

## 📁 Project Folder Structure

Overview of the main directories and files used in this project:

techxninjas-client/
├── .github/                                 # GitHub-specific settings
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md                    # Bug report issue template
│       ├── feature_request.md               # Feature request template
│       └── other---general-issue.md         # General issue template
│
├── components/                              # Reusable UI components and pages
│   ├── auth/                                # Authentication-related components
│   │   ├── AuthModal.tsx                    # Modal for login/register
│   │   ├── ForgotPasswordForm.tsx           # Forgot password form
│   │   ├── LoginForm.tsx                    # Login form UI
│   │   └── RegisterForm.tsx                 # Register form UI
│
│   ├── layout/                              # Common layout components
│   │   ├── Footer.tsx                       # Site footer
│   │   ├── FormattedText.tsx                # Renders HTML-safe rich text
│   │   ├── Header.tsx                       # Top navigation/header
│   │   ├── SearchHeader.tsx                 # Search bar header
│   │   └── Sidebar.tsx                      # Sidebar navigation
│
│   ├── pages/                               # Page-level UI components
│   │   ├── ArticleDetailPage.tsx            # Page to show detailed article content
│   │   ├── ArticlePage.tsx                  # List of articles or blogs
│   │   ├── ContactUsPage.tsx                # Contact form and details
│   │   ├── CourseDetailPage.tsx             # Detailed view of a course
│   │   ├── CoursePage.tsx                   # Course listing page
│   │   ├── CreaterDashboardPage.tsx         # Dashboard for content creators
│   │   ├── EventDetailPage.tsx              # Event detail view
│   │   ├── EventsPage.tsx                   # List of all events
│   │   ├── HomePage.tsx                     # Homepage
│   │   ├── PrivacyPolicyPage.tsx            # Privacy policy content
│   │   ├── PublicProfilePage.tsx            # View other users’ public profiles
│   │   ├── TermsOfServicePage.tsx           # Terms and conditions
│   │   └── UserProfilePage.tsx              # User's personal profile dashboard
│
│   ├── AddSectionModal.tsx                  # Modal to add a section
│   ├── AnimatedCounter.tsx                  # Animated numeric counter
│   ├── CodingBackground.tsx                 # Coding animation background
│   ├── CreatorApplicationModal.tsx          # Modal for creator application
│   ├── EditProfileModal.tsx                 # Modal for editing profile
│   ├── ErrorBoundary.tsx                    # Error fallback UI
│   ├── EventCard.tsx                        # Compact event preview card
│   ├── EventDetailHeader.tsx                # Header section for event detail page
│   ├── icons.tsx                            # Centralized icons
│   ├── LazyImage.tsx                        # Lazy loading images
│   ├── MentorsSlider.tsx                    # Mentor profiles carousel
│   ├── OptimizedArticleCard.tsx             # Performance-tuned article card
│   ├── OptimizedEventCard.tsx               # Performance-tuned event card
│   ├── RevealOnScroll.tsx                   # Scroll-triggered animation
│   ├── ReviewSection.tsx                    # User reviews/testimonials section
│   ├── ScrollToTop.tsx                      # Auto-scroll to top on nav
│   ├── ScrollToTopButton.tsx                # Button to scroll up
│   ├── TechFactGenerator.tsx                # Generates fun tech facts
│   ├── TestimonialsSlider.tsx               # Carousel for user testimonials
│   ├── ThemeToggle.tsx                      # Dark/light mode toggle
│   ├── usePageTitle.tsx                     # Hook to update page title
│   ├── VirtualizedList.tsx                  # Efficient long list renderer
│   └── WhatsAppButton.tsx                   # WhatsApp CTA floating button
│
├── context/                                 # Global context providers
│   ├── AuthContext.tsx                      # Authentication state provider
│   └── ThemeContext.tsx                     # Theme (light/dark) context
│
├── hooks/                                   # Custom React hooks
│   ├── useDebounce.ts                       # Debounce hook for inputs
│   └── useInfiniteScroll.ts                 # Infinite scroll for lists
│
├── lib/                                     # External clients or libraries
│   └── supabaseClient.ts                    # Supabase DB client setup
│
├── node_modules/                            # Auto-generated packages (ignored by Git)
│
├── public/                                  # Static files like images and SEO
│   ├── icons/                               # Icon set
│   ├── seo/                                 # SEO-related assets
│   ├── .well-known/                         # Site ownership and verification files
│   ├── browserconfig.xml                    # Browser config for Windows tiles
│   ├── humans.txt                           # Humans.txt with credits
│   ├── manifest.json                        # Web app manifest
│   ├── robots.txt                           # Robots exclusion protocol
│   └── sitemap.xml                          # Sitemap for SEO
│
├── services/                                # API service handlers
│   ├── articleInteractionService.ts         # Track article likes, comments etc.
│   ├── articleService.ts                    # Fetch articles from backend
│   ├── contactService.ts                    # Handles contact form submission
│   ├── courseService.ts                     # Fetch courses
│   ├── eventService.ts                      # Fetch events
│   ├── geminiService.ts                     # Gemini API integration
│   ├── homeService.ts                       # Data for homepage
│   ├── profileSectionService.ts             # Modular profile section fetcher
│   ├── profileService.ts                    # Profile data service
│   ├── reviewService.ts                     # Fetch and submit reviews
│   └── viewTrackingService.ts               # Track user views
│
├── utils/                                   # Utility/helper functions
│   ├── imageOptimization.ts                 # Resize & optimize images
│   └── performance.ts                       # Measure and enhance performance
│
├── .env.local                               # Environment variables (local)
├── .gitignore                               # Files/folders to ignore by Git
├── App.tsx                                  # App root component
├── CODE_OF_CONDUCT.md                       # Open source code of conduct
├── constants.ts                             # Shared constant values
├── CONTRIBUTING.md                          # Contribution guidelines
├── index.css                                # Global CSS (Tailwind base)
├── index.html                               # Main HTML template
├── index.tsx                                # App entry point
├── LICENSE                                  # License file
├── metadata.json                            # Metadata and manifest info
├── package-lock.json                        # Locked package versions
├── package.json                             # Project dependencies and scripts
├── postcss.config.js                        # PostCSS config (used with Tailwind)
├── README.md                                # Project documentation
├── SECURITY.md                              # Security policy
├── tailwind.config.js                       # Tailwind CSS config
├── techxninjas_logo.png                     # App logo
├── tsconfig.json                            # TypeScript config
├── types.ts                                 # Shared TypeScript types
├── vercel.json                              # Vercel deployment settings
├── vite.config.ts                           # Vite build tool config

## ⚙️ Tech Stack

| Category            | Technology                              |
| ------------------- | --------------------------------------- |
| **Frontend**        | React.js (TypeScript)                   |
| **Routing**         | React Router DOM                        |
| **Styling**         | Tailwind CSS                            |
| **Backend/API**     | Supabase (PostgreSQL)                   |
| **Hosting**         | Vercel                                  |
| **Auth**            | Supabase Auth                           |
| **SEO & Analytics** | Meta tags, Open Graph, Google Analytics |

## 📋 GSSoC 2025 Contributor Task Board

Track all open tasks, progress, and completed contributions on our live board:  
👉 [![Project Board](https://img.shields.io/badge/Project-View%20Board-blue?style=for-the-badge)](https://github.com/users/techxninjas/projects/1/views/4)

We regularly update this board with new issues, assignments, and progress – check here before picking an issue!

## 🔑 Environment Variables

To run the project locally, create a `.env.local` file and include:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🧪 How to Run Locally

1. **Clone the Repository**

```bash
git clone https://github.com/techxninjas/techxninjas-client.git
cd techxninjas
```

2. **Install Dependencies**

```bash
npm install
```

3. **Add Environment Variables**

Create a `.env.local` file and paste your Supabase/EmailJS keys as described
above.

4. **Run the Project**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

---

## 🤝 Contribution Guide

We are open to meaningful contributions from developers, designers, and content
creators!

### You can contribute to:

- Bug fixes
- New feature implementation
- UI/UX improvements
- Responsive & accessibility enhancements
- Content (articles, tech blogs, etc.)

### Steps:

1. Fork the repo
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m "Add feature"`
4. Push to your fork: `git push origin feature-name`
5. Create a pull request from your fork’s branch

---

## 💬 Join Our Community Discussions!
We’re using GitHub Discussions to build a strong community for GSSoC 2025 and beyond!

👉 [Click here to ask questions, introduce yourself, or share ideas!](https://github.com/techxninjas/techxninjas-client/discussions)


---

## 👨‍💻 Maintainers

- **Aadil Latif** – [LinkedIn](https://www.linkedin.com/in/iaadillatif/)

Feel free to reach out for discussions, suggestions, or contributions!

---

## 📄 License

This project is licensed under the [GPL-3.0 license](LICENSE)

---

**Made with ❤️ for students, by students.**

---