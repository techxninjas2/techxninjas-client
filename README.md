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
├── .github/                     # GitHub issue/pull request templates
│   └── ISSUE_TEMPLATE/          # Markdown templates (bug_report.md, feature_request.md)
├── assets/                      # Static media used in the frontend
│   └── images/                  # Project-related images
├── components/                  # Modular and reusable UI elements
│   ├── auth/                    # Forms and components for authentication(login,register..)
│   ├── layout/                  # Structural components (Header, Footer, Sidebar)
│   ├── shared/                  # Common widgets (Buttons, Cards, Modals)
│   ├── dashboard/               # Admin/Editor dashboard components
│   └── editor/                  # Rich text editor components
├── context/                     # React Context APIs for managing global state
├── hooks/                       # Custom React hooks
├── lib/                         # Helper libraries, constants, API utilities
│   ├── axiosInstance.ts         # Axios setup for API calls
│   └── constants.ts             # Centralized constants
├── pages/                       # Next.js routing pages
│   ├── index.tsx                # Homepage
│   ├── about.tsx                # About us
│   ├── articles/                # Articles listing and detail pages
│   │   └── [slug].tsx           # Dynamic routing for individual articles
│   ├── contact.tsx              # Contact us page
│   ├── dashboard.tsx            # Admin dashboard view
│   └── editor.tsx(many more..)  # Page for article creation/editing
├── public/                      # Static assets for global use
│   ├── assets/                  # Images and icons
│   └── favicon.ico              # Website favicon
├── seo/                         # Metadata and structured data for SEO
├── styles/                      # Tailwind CSS config and global styles
├── utils/                       # Utility functions shared across components
├── .env.local                   # Environment variable definitions (ignored in repo)
├── App.tsx                      # App layout and router logic
├── CODE_OF_CONDUCT.md           # Contributor guidelines and expectations
├── LICENSE                      # License information
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # You’re reading it now!

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