/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const token = localStorage.getItem('userinfo')
  if (!token) {
    return <Navigate to='/' state={{ from: location }} replace />
  }
  return children
}
