/* eslint-disable react/prop-types */
import Spinner from 'react-bootstrap/Spinner'

function Loader({ title }) {
  return (
    <div>
      <div className='d-flex justify-content-center align-items-center'>
        <Spinner animation='grow' role='status' style={{ color: '#6469ff' }}>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
      <p className='text-center'>{title}</p>
    </div>
  )
}

export default Loader
