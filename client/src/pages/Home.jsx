import { useEffect, useState } from 'react'
import { getPins } from '../config/api'
import toast from 'react-hot-toast'
import { Container } from 'react-bootstrap'
import Loader from '../utils/Loader'
import { Card, Error, SearchBox } from '../components'

export default function Home() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Home'
    setLoading(true)
    getPins()
      .then((res) => {
        setData(res.data)
      })
      .catch((error) => {
        setError(error)
        console.error(error)
        toast.error(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (error) return <Error />

  return (
    <section className='sec'>
      <Container fluid className='mx-auto py-5 px-3'>
        <div className='d-block d-md-none mb-4'>
          <SearchBox />
        </div>
        {loading ? (
          <Loader title='fetching pins' />
        ) : (
          <div className='d-flex justify-content-center flex-wrap gap-4 mt-md-4 mt-lg-0'>
            {data?.map((pin) => (
              <Card {...pin} key={pin._id} />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
