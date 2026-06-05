import client from './client'

export const getAppointments = (filters = {}) => {
  return client.get('/appointments', { params: filters })
}

export const getDoctorFeed = () => {
  return client.get('/doctor/feed')
}

export const respondToAppointment = (appointmentId, response) => {
  return client.post(`/appointments/${appointmentId}/respond`, { response })
}

export const confirmAppointment = (appointmentId) => {
  return respondToAppointment(appointmentId, 'CONFIRMED')
}

export const rescheduleAppointment = (appointmentId, newTime) => {
  return client.post(`/appointments/${appointmentId}/reschedule`, { newTime })
}

export const sendReminder = (appointmentId, language = 'en') => {
  return client.post(`/appointments/${appointmentId}/reminder`, { language })
}

export const getPatientAppointments = (patientId) => {
  return client.get(`/patients/${patientId}/appointments`)
}
