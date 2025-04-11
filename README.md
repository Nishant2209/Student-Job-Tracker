# Student Job Tracker

## Tech Stack
- **Frontend**: 
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Day Picker
  - Lucide Icons
  - React Hot Toast

- **Backend**: 
  - Node.js
  - Express
  - MongoDB (or any other database as per your implementation)

## Features
- User authentication (login and registration)
- Add, edit, and delete job applications
- Filter job applications by status (Applied, Interview, Offer, Rejected)
- Sort job applications by date (newest or oldest)
- Date range filtering for applications
- Responsive design for mobile and desktop

## Prerequisites
To run this project locally, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- A MongoDB database (or any other database you are using)

## Installation Commands
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/student-job-tracker.git
   cd student-job-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port specified in your configuration).

Note: If you are running backend(http://github.com/Nishant2209/Student-Job-Tracker-Backend) locally also then change the `BACKEND_URL` variable in src/services.tsx file.

## Folder Structure
```
student-job-tracker/
├── src/
│   ├── components/          # Reusable components (Navbar, JobForm, JobList, JobForm, AuthModal, DatePickerInput)
│   ├── services.tsx         # Backend url 
│   ├── types.ts             # TypeScript interfaces
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   ├── main.tsx             # Entry point of the application
│   └── vite-env.d.ts        # Type definitions for Vite
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
```
