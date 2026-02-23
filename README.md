# Online Assignment Submission & Grading System

A frontend-only React.js web application for assignment submission and grading. Uses mock data and simulated role-based login (Teacher/Student).

**Important:** If you get a white/blank page, try moving this project to a folder path **without spaces** (e.g. `C:\Projects\assignment-app`). Paths with spaces can cause issues on Windows.

## Features

- **Landing Page**: Role selection (Teacher / Student)
- **Teacher Dashboard**: Create assignments, view and grade submissions
- **Student Dashboard**: View assignments, submit work, check grades

## Tech Stack

- React 18 (functional components + hooks)
- React Router v6
- Vite
- Plain CSS (no Tailwind)

## Project Structure

```
src/
  components/     # Reusable UI components
  context/        # App state (assignments, submissions, grades)
  pages/          # Route pages
  App.js
  index.jsx
  styles.css
```

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
```

## Usage

1. Click **Login as Teacher** or **Login as Student**
2. **Teacher**: Create assignments, grade submissions
3. **Student**: Submit assignments, view grades

All data is stored in React state (no backend). Refresh clears mock data changes.
