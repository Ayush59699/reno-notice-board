# Reno Campus Notice Board

A robust, modern, and responsive Notice Board web application with full CRUD functionality, built using Next.js (Pages Router), Prisma ORM, and Tailwind CSS. It is fully prepared for MySQL deployment (e.g. TiDB Cloud).

## Tech Stack

- **Framework:** Next.js (Pages Router)
- **Database ORM:** Prisma
- **Database Provider:** MySQL (or PostgreSQL/Prisma Postgres via dynamic driver adapter)
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React

## Project Features

- **Responsive Notice Grid:** Adjusts gracefully between 1 column (mobile), 2 columns (tablet), and 3 columns (desktop).
- **CRUD Operations:**
  - **Create:** Publish a notice with a title, body content, category (Exam, Event, General), priority (Normal, Urgent), publish date, and an optional image URL.
  - **Read:** Display all notices ordered by priority (`Urgent` notices always display at the top with a pulsing red badge), and then sorted descending by `publishDate`.
  - **Update:** Edit notice details using the same reusable form preloaded with current values.
  - **Delete:** Delete notices with an overlay confirmation modal.
- **Server-Side Validation:** Ensures required inputs are present, date format is valid, and image URLs are sanitized on both client and server APIs.
- **Search & Filtering:** Dynamic client-side searching by text content and category filtering.
- **Dynamic Database Adapters:** Compatible with Prisma 7, utilizing native driver adapters (`@prisma/adapter-mariadb`, `@prisma/adapter-pg`, and `@prisma/extension-accelerate`) to work out-of-the-box with MySQL (TiDB Cloud) or Postgres (Neon/Supabase/Prisma Postgres).

---

## Getting Started & Local Development

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Install Dependencies
Clone the repository and install packages:
```bash
npm install
```

### 3. Database Configuration
Create a `.env` file in the root directory (Prisma 7 uses `prisma.config.ts` which reads from your environment variables):

```env
DATABASE_URL="mysql://your_db_user:your_db_password@your_db_host:3306/your_db_name"
```
*Note: If you choose to develop using a hosted PostgreSQL database (such as Neon or Supabase), the dynamic client adapter will automatically detect the `postgresql://` protocol and use the PostgreSQL driver adapter instead.*

### 4. Running Migrations
To push the schema structure to your database:
```bash
npx prisma db push
```

### 5. Running the Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment to Vercel

1. Commit your changes and push the repository to GitHub.
2. Link your GitHub repository to a new project in your **Vercel Dashboard**.
3. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your hosted database connection string.
4. Click **Deploy**. Vercel will build the Pages Router project.

---

## Evaluation Criteria Disclosures

### Where and How AI Was Used
AI (Google Gemini / Antigravity) was used as a pair programming assistant to:
- Structure the Pages Router directory (`pages/index.js`, `pages/api/notices/`, etc.).
- Draft the reusable components (`NoticeForm`, `NoticeCard`, `DeleteModal`, `Layout`).
- Address breaking changes in **Prisma 7**'s configuration structure by implementing dynamic driver adapters to support direct database connections (like TiDB MySQL) and Accelerate/Prisma Postgres protocols.

### What I Would Improve With More Time
- **Image Upload Hosting:** Integrate with an image storage provider (such as Cloudinary or Vercel Blob) to allow direct file uploads instead of only pasting URL strings.
- **Role-based Authentication:** Add role-based authentication (e.g. using NextAuth/Auth.js) to restrict notice creation, updating, and deletion to authorized faculty/admin roles, while keeping the board read-only for students.
- **Rich Text Editor:** Replace the textarea with a Markdown or WYSIWYG editor (like TipTap) to allow rich formatting (bold, italics, lists, links) in the notice body.
- **Real-time Notifications:** Add WebSocket/Server-Sent Events (SSE) support to instantly push new notices to active client dashboards without manual page updates.
