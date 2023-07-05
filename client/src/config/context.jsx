/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react'

export const StateContext = createContext()

export const StateProvider = ({ children }) => {
  const [userinfo, setUserInfo] = useState(null)

  const getUserDetails = async () => {
    const user = localStorage.getItem('userinfo')
    setUserInfo(JSON.parse(user) || null)
  }
  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <StateContext.Provider
      value={{
        userinfo,
        setUserInfo,
        getUserDetails,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
