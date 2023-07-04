import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <Navbar />
      <main
        className='w-100 bg-white'
        style={{ minHeight: '92vh' }}
      >
        <Outlet />
      </main>
    </>
  )
}
