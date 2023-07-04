/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
export default function UserPageLayout({ header, children, validateUser }) {
  return (
    <section className='sec py-4 d-flex align-items-center justify-content-center login-bg'>
      <div className='mx-auto d-flex justify-content-center align-items-center flex-column py-5 px-4 bg-white shadow rounded-3 formA'>
        {validateUser ? (
          <img
            src={validateUser?.image}
            alt={validateUser?.username}
            className='border shadow-md'
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            className='link p-4 d-flex align-items-center justify-content-center'
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '100%',
            }}
          >
            <Link to='/' className='fs-3 text-white text-decoration-none'>
              P
            </Link>
          </div>
        )}
        <h1 className='mt-4 text-capitalize h1-mini'>{header}</h1>
        {children}
      </div>
    </section>
  )
}
