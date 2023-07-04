import { useCallback, useEffect, useReducer, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { deletePin, getUserProfileAndPins } from '../../config/api'
import { useStateContext } from '../../config/context'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { CardMini, CardSearch, Error, UpdateProfile } from '../../components'
import Loader from '../../utils/Loader'
import { PinReducer, initialState } from '../../reducers/pinReducer'

export default function Profile() {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(PinReducer, initialState)
  const { userinfo } = useStateContext()

  const fetchUserProfile = useCallback(async () => {
    setLoading(true)
    await getUserProfileAndPins(username, userinfo?.access_token)
      .then((res) => {
        setData(res.data)
      })
      .catch((error) => {
        setError(error)
        console.log(error)
        toast.error('There was an error getting this user')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userinfo?.access_token, username])

  useEffect(() => {
    fetchUserProfile()
    document.title = `Profile ${data?.username} `
  }, [data?.username, fetchUserProfile])

  const deleteYourPin = async (pinId) => {
    await deletePin(pinId, userinfo?.access_token)
      .then((res) => {
        dispatch({ type: 'DELETE_PIN_SUCCESS', payload: res.data })
        fetchUserProfile()
      })
      .catch((error) => {
        dispatch({ type: 'PIN_ERROR', payload: error })
        toast.error('Unable to delete pin')
      })
      .finally(() => {
        console.log(state)
      })
  }

  if (error) return <Error error={error} />

  return (
    <section className='sec'>
      <Container fluid='xl' className='mx-auto py-5 px-3'>
        {loading ? (
          <Loader title='Fetching profile...' />
        ) : (
          <>
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <Image
                src={data?.image}
                className='rounded-circle mb-4 object-fit-cover'
                style={{ width: '100px', height: '100px' }}
              />
              <h1 className='fs-3 fw-bold text-capitalize'>{data?.username}</h1>
              <p>{data?.email}</p>
              <p>
                <b>About me:</b> {data?.bio}
              </p>
              <UpdateProfile data={data} />
            </div>
            <hr />
            <div className='my-4'>
              <h1 className='fs-5 mb-4 fw-bold'>
                {data?._id === userinfo?.user?._id
                  ? 'Your pins'
                  : `${data?.username.toUpperCase()} pins`}
              </h1>
              {data?.pin?.length > 0 ? (
                <Row className='gy-4'>
                  {data?.pin?.map((item) => (
                    <Col key={item._id} xs={6} md={3}>
                      <CardMini {...item} deleteYourPin={deleteYourPin} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>Oops! Sorry, but you have no pin yet. Start posting.</p>
              )}
            </div>
            <div className='mt-5'>
              <h1 className='fs-5 mb-4 fw-bold'>
                {' '}
                {data?._id === userinfo?.user?._id
                  ? 'Your liked pins'
                  : `${data?.username.toUpperCase()} liked pins`}
              </h1>
              {data?.likedPins?.length > 0 ? (
                <Row className='gy-4'>
                  {data?.likedPins?.map((item) => (
                    <Col key={item._id} xs={6} md={3}>
                      <CardSearch {...item} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>
                  Oops! Sorry, but you have yet to like a user pin. Start
                  liking!
                </p>
              )}
            </div>
          </>
        )}
      </Container>
    </section>
  )
}
