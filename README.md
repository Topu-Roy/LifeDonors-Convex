# LifeDonors Platform

[![LifeDonors Hero](https://github.com/Topu-Roy/LifeDonors-Convex/blob/main/public/og-image.png?raw=true)](https://lifedonors.vercel.app)

**LifeDonors** is a modern, privacy-focused blood donation management platform designed to connect people in need with voluntary blood donors in their community. Built with speed, safety, and visual excellence in mind, the platform provides real-time tracking of blood requests and donor availability.

## 🩸 Core Mission

Our goal is to bridges the gap between those who need blood and those who want to give it. By utilizing modern web technologies, we've created a platform that is not only functional but also intuitive and visually stunning—ensuring that help is just a few clicks away when every second counts.

## ✨ Key Features

- **Eligibility Checker**: An interactive tool that helps users determine their eligibility to donate based on vitals like age, BMI, and hemoglobin levels.
- **Urgent Blood Requests**: A searchable, filterable explorer to find nearby blood needs by location, blood type, and urgency.
- **Comprehensive Profiles**: Secure donor profiles that calculate donor metrics and track donation history.
- **Donor Dashboard**: A centralized hub for donors and requesters to manage their commitments and active requests.
- **Admin Controls**: A powerful interface for system administrators to monitor platform stats, manage seed data, and ensure platform health.
- **Privacy-First Design**: Built with data security at the core, ensuring health information is only accessible to relevant parties.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database & Backend**: [Convex](https://www.convex.dev/) (Real-time backend)
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Convex integration
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Lucide React](https://lucide.dev/)
- **State Management**: [Jotai](https://jotai.org/)
- **Runtime**: [Bun](https://bun.sh/)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A [Convex](https://www.convex.dev/) account and project.
- Environment variables configured for Better Auth and Convex.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Topu-Roy/LifeDonors-Convex.git
   cd LifeDonors-Convex
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Initialize Convex:**
   ```bash
   bun x convex dev
   ```

4. **Environment Variables:**
   Create a `.env.local` file and add the necessary credentials:
   ```env
   # Better Auth
   BETTER_AUTH_SECRET=your_secret
   BETTER_AUTH_URL=http://localhost:3000

   # Convex
   CONVEX_DEPLOYMENT=your_deployment_id
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   ```

5. **Start the development server:**
   ```bash
   bun dev
   ```

## 🧪 Seeding Data

For development and testing, you can use the built-in seeding scripts to populate your database with dummy requests and profiles:

```bash
# Generate and push seed data
bun seed:generate
```

Alternatively, use the **Admin Dashboard** (`/admin`) to trigger seeding or clear the database directly from the UI.

---

Built with ❤️ for a better community.
