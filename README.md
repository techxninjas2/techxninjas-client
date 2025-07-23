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
├── .github/                            # GitHub issue templates and workflows
│ └── ISSUE_TEMPLATE/                   # Predefined templates (bug_report.md, etc.)
│
├── assets/                             # Static media used in the frontend
│ └── images/                           # Project-related images
│
├── components/                         # Reusable UI components
│ ├── auth/                             # Login, Register, ForgotPassword forms
│ ├── layout/                           # Header, Footer, Sidebar, etc.
│ └── pages/                            # Page content sections like Cards, Sliders, etc.
│
├── context/                            # React Context for global state (e.g., AuthContext)
├── hooks/                              # Custom React hooks
├── lib/                                # External service setups and configs
│ └── supabaseClient.ts                 # Supabase client initialization
│
├── pages/                              # Next.js routing pages
│ ├── index.tsx                         # Homepage
│ ├── about.tsx                         # About Us page
│ ├── contactUsPage.tsx                 # Contact page
│ ├── creatorDashboardPage.tsx          # Creator Dashboard
│ ├── articlesPage.tsx                  # Article listing
│ └── ...                               # Other pages like event, profile, course, etc.
│
├── public/                             # Publicly accessible static files
│ ├── icons/                            # SEO and app icons
│ ├── favicon.ico                       # Site favicon
│ └── manifest.json                     # PWA or metadata manifest
│
├── seo/                                # SEO configurations and structured metadata
├── services/                           # API calls and data-fetching functions
├── styles/                             # Tailwind and global CSS styles
├── utils/                              # General-purpose utility functions
│
├── .env.local                          # Local environment variables (excluded from Git)
├── App.tsx                             # Root App component
├── CODE_OF_CONDUCT.md                  # Community contribution rules
├── CONTRIBUTING.md                     # Steps and standards for contributors
├── SECURITY.md                         # Security guidelines and reporting
├── constants.ts                        # Centralized app-wide constants
├── index.tsx                           # App entry point
├── index.css                           # Global stylesheet
├── index.html                          # HTML shell (if using Vite)
├── metadata.json                       # Metadata (used in SEO or integrations)
├── next.config.js                      # Next.js configuration
├── package.json                        # Project metadata and scripts
├── package-lock.json                   # Dependency lockfile
├── postcss.config.js                   # PostCSS config (used with Tailwind)
├── tailwind.config.js                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
├── types.ts                            # Custom TypeScript types
├── vercel.json                         # Vercel deployment configuration
└── README.md                           # You’re reading it now!

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