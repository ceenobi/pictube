import React, { lazy } from 'react'
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom'
import { Error, Root } from '../components'
import {
  Create,
  LandingPage,
  Password,
  Profile,
  Recover,
  Register,
  Reset,
  Signin,
} from '../pages'
import { useStateContext } from '../config/context'
import { ProtectedRoute } from './ProtectedRoute'
import Loader from '../utils/Loader'
const Home = lazy(() => import('../pages/Home'))
const Search = lazy(() => import('../pages/Search'))
const PinDetail = lazy(() => import('../pages/PinDetail'))

export default function Routespath() {
  const { userinfo } = useStateContext()
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />} errorElement={<Error />}>
        <Route
          index
          element={
            userinfo?.access_token ? (
              <React.Suspense fallback={<Loader />}>
                <Home />{' '}
              </React.Suspense>
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path='account'
          element={userinfo ? <Navigate to='/' replace /> : <Signin />}
        >
          <Route path='password' element={<Password />} />
        </Route>
        <Route
          path='account/register'
          element={userinfo ? <Navigate to='/' replace /> : <Register />}
        />
        <Route
          path='recover-password'
          element={userinfo ? <Navigate to='/' replace /> : <Recover />}
        />
        <Route path='reset-password' element={<Reset />} />
        <Route
          path='create-pin'
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />
        <Route
          path='pin/:pinId'
          element={
            <React.Suspense fallback={<Loader />}>
              <ProtectedRoute>
                <PinDetail />
              </ProtectedRoute>
            </React.Suspense>
          }
        />
        <Route
          path='user-profile/:username'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='search'
          element={
            <React.Suspense fallback={<Loader />}>
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            </React.Suspense>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    )
  )
  return <RouterProvider router={router} />
}
