import client from './client'

export const login = (email, password, role) => {
  return client.post('/auth/login', { email, password, role })
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}
