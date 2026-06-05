import { useState } from 'react'
import Navigation from '../components/Navigation'
import ReminderCard from '../components/ReminderCard'

export default function ReminderCenter() {
  const [activeTab, setActiveTab] = useState('en')

  const reminders = {
    en: [
      {
        id: 1,
        patientName: 'John Doe',
        appointmentTime: '2024-06-10 10:00 AM',
        message: 'Hello John,\n\nYour appointment is tomorrow at 10:00 AM.\n\nPlease confirm or reschedule if needed.',
      },
      {
        id: 2,
        patientName: 'Jane Smith',
        appointmentTime: '2024-06-10 02:00 PM',
        message: 'Hello Jane,\n\nWe are looking forward to seeing you tomorrow at 2:00 PM.\n\nPlease confirm your attendance.',
      },
      {
        id: 3,
        patientName: 'Michael Brown',
        appointmentTime: '2024-06-11 09:00 AM',
        message: 'Hello Michael,\n\nYour appointment is scheduled for tomorrow at 9:00 AM.\n\nConfirm or reschedule here.',
      },
    ],
    sw: [
      {
        id: 1,
        patientName: 'John Doe',
        appointmentTime: '2024-06-10 10:00 AM',
        message: 'Habari John,\n\nMga muhtasari wako ni kesho saa 10:00 asubuhi.\n\nTafadhali thibitisha au badilisha wakati ikiwa inahitajika.',
      },
      {
        id: 2,
        patientName: 'Jane Smith',
        appointmentTime: '2024-06-10 02:00 PM',
        message: 'Habari Jane,\n\nTunatarajia kukuona kesho saa 2:00 asubuhi.\n\nTafadhali thibitisha mahضوre yako.',
      },
      {
        id: 3,
        patientName: 'Michael Brown',
        appointmentTime: '2024-06-11 09:00 AM',
        message: 'Habari Michael,\n\nMga muhtasari wako yamepangwa kesho saa 9:00 asubuhi.\n\nThibitisha au badilisha hapa.',
      },
    ],
  }

  const currentReminders = reminders[activeTab] || []

  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reminder Center</h1>

          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('en')}
              className={`px-6 py-3 font-medium border-b-2 transition ${
                activeTab === 'en'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveTab('sw')}
              className={`px-6 py-3 font-medium border-b-2 transition ${
                activeTab === 'sw'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Swahili
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentReminders.map(reminder => (
            <div key={reminder.id}>
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900">{reminder.patientName}</h3>
                <p className="text-sm text-gray-500">{reminder.appointmentTime}</p>
              </div>
              <ReminderCard
                message={reminder.message}
                language={activeTab}
                onConfirm={() => alert('Appointment confirmed')}
                onReschedule={() => alert('Reschedule initiated')}
              />
            </div>
          ))}
        </div>

        {currentReminders.length === 0 && (
          <div className="card">
            <div className="card-body text-center py-12">
              <p className="text-gray-500">No reminders to send</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
