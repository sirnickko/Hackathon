# AfyaConnect AI - Healthcare SaaS Frontend

Modern React + Tailwind CSS healthcare management application with support for both doctors and patients.

## Features

- **Doctor Dashboard**: AI-prioritized patient queue with risk assessment
- **Appointment Management**: Full CRUD operations with confirmation and rescheduling
- **AI Triage Dashboard**: Visualize Gemini-generated risk assessments
- **Reminder Center**: Multilingual reminders (English & Swahili)
- **Patient Dashboard**: Personal appointment management and status tracking
- **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Axios
- Vite

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:3000/api
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.js       # Axios instance
│   │   ├── auth.js         # Auth endpoints
│   │   └── appointments.js # Appointment endpoints
│   ├── components/
│   │   ├── Navigation.jsx
│   │   ├── StatCard.jsx
│   │   ├── RiskBadge.jsx
│   │   ├── AppointmentTable.jsx
│   │   └── ...
│   ├── hooks/
│   │   └── useAuth.js      # Auth context and hook
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── AppointmentManagementPage.jsx
│   │   ├── TriageDashboard.jsx
│   │   ├── ReminderCenter.jsx
│   │   └── PatientDashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /auth/login` - Login user

### Appointments
- `GET /appointments` - List appointments
- `GET /doctor/feed` - Get doctor dashboard data
- `POST /appointments/:id/respond` - Confirm/decline appointment
- `POST /appointments/:id/reschedule` - Reschedule appointment
- `POST /appointments/:id/reminder` - Send reminder
- `GET /patients/:id/appointments` - Get patient appointments

## Design System

### Colors
- Primary: `#0066CC`
- Success: `#10B981`
- Warning: `#F59E0B`
- Danger: `#EF4444`

### Component Classes
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Card container
- `.input-field` - Input field
- `.badge-high-risk` - High risk badge
- `.badge-medium-risk` - Medium risk badge
- `.badge-low-risk` - Low risk badge

## License

MIT
