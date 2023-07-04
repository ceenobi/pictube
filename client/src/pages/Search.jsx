import { useEffect, useState } from 'react'
import { Container, Button, Row, Col } from 'react-bootstrap'
import { getPinsBySearch, getPins } from '../config/api'
import Loader from '../utils/Loader'
import { CardSearch, Error } from '../components'
import { useNavigate } from 'react-router-dom'

export default function Search() {
  const query = new URLSearchParams(location.search)
  const queryParams = query.get('q')
  const [result, setResult] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [tag, setTag] = useState(queryParams)
  const navigate = useNavigate()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const searchRequest = async () => {
        document.title = `Search result for "${queryParams}"`
        setLoading(true)
        getPinsBySearch(queryParams)
          .then((res) => {
            setResult(res.data)
          })
          .catch((error) => {
            console.error(error)
            setError(error)
          })
          .finally(() => {
            setLoading(false)
          })
      }
      searchRequest()
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [queryParams])

  useEffect(() => {
    const params = new URLSearchParams()
    if (tag) {
      params.append('q', tag)
    } else {
      params.delete('q')
    }
    navigate({ search: params.toString() })
  }, [tag, navigate])

  useEffect(() => {
    setLoading(true)
    getPins()
      .then((res) => {
        setData(res.data)
      })
      .catch((error) => {
        setError(error)
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const getAllTags = data?.flatMap((item) => item.tags)
  const filterPinsWithTags = [
    ...getAllTags.filter((item, i) => {
      return getAllTags.indexOf(item) === i && item.length > 0
    }),
  ]

  const shuffleTags = () => {
    const shuffled = [...filterPinsWithTags].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 30)
  }
  const getRandomTags = shuffleTags()

  if (error) return <Error />

  return (
    <>
      <section className='sec'>
        <Container fluid='xl' className='mx-auto py-5 px-3'>
          <div className='d-flex flex-wrap gap-3 overflow-x-scroll scrollbody mb-4'>
            {getRandomTags?.map((tagg, i) => (
              <Button
                key={i}
                variant='none'
                className={
                  queryParams === tagg
                    ? 'rounded-4 link px-3 py-1 text-white'
                    : 'rounded-4 bg-secondary-subtle px-3 py-1'
                }
                onClick={() => setTag(tagg)}
              >
                {tagg}
              </Button>
            ))}
          </div>
          {loading && <Loader title={`searching for "${queryParams}"`} />}
          <>
            {result?.length > 0 ? (
              <>
                <p className='my-4'>
                  We found {result?.length} result for &quot;
                  <b>{queryParams}</b>&quot;
                </p>
                <Row className='gy-4'>
                  {result?.map((pin) => (
                    <Col key={pin._id} xs={6} md={3}>
                      <CardSearch {...pin} />
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <p className='text-center mt-5 py-5'>
                Sorry, we couldn&apos;t find any search for{' '}
                <span className='fw-bold'>&quot;{queryParams}&quot;</span>
              </p>
            )}
          </>
        </Container>
      </section>
    </>
  )
}
