import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

export default function LandingPage() {
  return (
    <section className='sec'>
      <div className='hero d-flex justify-content-center align-items-center flex-column'>
        <Container className='mx-auto py-5 px-3'>
          <h1 className='text-center font-bold leading-snug text-white'>
            Get your next idea.
          </h1>
          <h1 className='font-bold leading-snug text-white text-center h1-mini'>
            See posts, Be inspired.
          </h1>
          <div className='d-flex justify-content-center mt-5'>
            <Link
              to='/account'
              className='rounded text-decoration-none link py-2 px-3 text-white '
            >
              Get started
            </Link>
          </div>
        </Container>
      </div>
      <div
        style={{ marginTop: '6rem', maxWidth: '576px' }}
        className='mx-auto px-3 py-4 px-lg-0'
      >
        <p className='text-center fs-5'>
          Pictube is a really easy way to supercharge your experience and get
          friends to know what&#34;s up with you. View pictures, like and
          comment on. Have fun!
        </p>
      </div>
    </section>
  )
}
