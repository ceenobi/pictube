/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { AuthReducer, initialState } from '../reducers/userReducer'

export const StateContext = createContext()

export const StateProvider = ({ children }) => {
  const [userinfo, setUserInfo] = useState(null)
  const [state, dispatch] = useReducer(AuthReducer, initialState)

  const getUserDetails = async () => {
    const user = localStorage.getItem('userinfo')
    setUserInfo(JSON.parse(user) || null)
  }
  useEffect(() => {
    getUserDetails()
  }, [])

  const setLogOut = async () => {
    dispatch({ type: 'LOGOUT' })
    location.replace('/')
    console.log('logout', state)
  }

  return (
    <StateContext.Provider
      value={{
        userinfo,
        setUserInfo,
        getUserDetails,
        setLogOut,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
