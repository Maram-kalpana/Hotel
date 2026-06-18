import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hotel_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const mockApi = {
  getFloors: () => Promise.resolve({ data: [] }),
  getRooms: () => Promise.resolve({ data: [] }),
  getCustomers: () => Promise.resolve({ data: [] }),
}

export default api
