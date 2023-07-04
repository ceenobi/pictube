/* eslint-disable react/prop-types */
import { Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function Error() {
  const navigate = useNavigate()
  return (
    <section className='sec'>
      <Container className='mx-auto py-5 px-4'>
        <h1 className='fs-4 mt-5'>
          Sorry, there was a problem processing your request 😣
        </h1>
        <Button
          className='font-semibold link py-2 px-3 rounded text-white mt-4 mb-4'
          onClick={() => navigate('/')}
        >
          Go back
        </Button>
      </Container>
    </section>
  )
}
