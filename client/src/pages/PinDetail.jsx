import { useCallback, useEffect, useReducer, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loader from '../utils/Loader'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'
import { dislikePinPost, getPinDetail, likePinPost } from '../config/api'
import { MdDownload } from 'react-icons/md'
import { AiFillHeart } from 'react-icons/ai'
import { Comment, Error } from '../components'
import { downloadImage } from '../utils/DownloadImage'
import { PinReducer, initialState } from '../reducers/pinReducer'
import { useStateContext } from '../config/context'

export default function PinDetail() {
  const { pinId } = useParams()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)
  const [state, dispatch] = useReducer(PinReducer, initialState)
  const { userinfo } = useStateContext()
  const length = state?.pin?.image?.length

  const fetchPinDetail = useCallback(async () => {
    setLoading(true)
    await getPinDetail(pinId)
      .then((res) => {
        dispatch({
          type: 'PIN_DETAIL',
          payload: res.data,
        })
      })
      .catch((error) => {
        toast.error(error.message)
        dispatch({
          type: 'PIN_ERROR',
          payload: error,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [pinId])

  useEffect(() => {
    document.title = state?.pin?.title
    fetchPinDetail()
  }, [state?.pin?.title, fetchPinDetail])

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1)
  }

  const handleLikePin = async () => {
    await likePinPost(pinId, userinfo?.user?._id, userinfo?.access_token)
    dispatch({
      type: 'LIKE_PIN_SUCCESS',
      payload: userinfo?.user?._id,
    })
  }
  const handleDislikePin = async () => {
    await dislikePinPost(pinId, userinfo?.user?._id, userinfo?.access_token)
    dispatch({
      type: 'DISLIKE_PIN_SUCCESS',
      payload: userinfo?.user?._id,
    })
  }

  if (state?.errorMessage !== null) return <Error />

  return (
    <section className='sec'>
      <Container fluid='xl' className='mx-auto py-5 px-3'>
        {loading ? (
          <div style={{ height: '50px' }}>
            <Loader title='fetching pin details' />
          </div>
        ) : (
          <Row className='py-lg-3 w-100 mx-auto g-lg-5'>
            <Col lg={6} className='mb-4'>
              <div className='d-flex justify-content-center align-items-start mx-auto w-100 h-75'>
                {state?.pin?.image?.map((image, i) => (
                  <div key={i} className='pinId  position-relative'>
                    {i === current && (
                      <>
                        <Image
                          src={image}
                          alt='imgpic'
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'fill',
                            position: 'relative',
                          }}
                          title={state?.pin?.title}
                          className='rounded-4'
                        />
                        {state?.pin?.image?.length > 1 && (
                          <>
                            <FaArrowAltCircleLeft
                              className='position-absolute top-50 start-0 translate-middle text-black z-2'
                              size='1.8rem'
                              type='button'
                              onClick={prevSlide}
                            />
                            <FaArrowAltCircleRight
                              className='position-absolute top-50 start-100 translate-middle text-black z-2'
                              size='1.8rem'
                              type='button'
                              onClick={nextSlide}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={6}>
              <>
                <h1 className='fs-3 fw-bold mb-4'>{state?.pin?.title}</h1>
                <p>{state?.pin?.description}</p>
                <div className='d-flex align-items-center mb-0'>
                  <Link
                    to={`/user-profile/${state?.pin?.username}`}
                    className='flex-grow-1'
                  >
                    <div className='d-flex gap-1 align-items-center'>
                      <Image
                        src={state?.pin?.userImg}
                        alt={state?.pin?.username}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '100%',
                        }}
                      />
                      <span className='fw-bold text-black'>
                        {state?.pin?.username}
                      </span>
                    </div>
                  </Link>
                  <div className='d-flex align-items-center gap-2'>
                    {state?.pin?.image?.map((image, i) => (
                      <div key={i}>
                        {i === current && (
                          <MdDownload
                            color='black'
                            size='25px'
                            type='button'
                            title='download image'
                            onClick={() =>
                              downloadImage(state?.pin?._id, image)
                            }
                          />
                        )}
                      </div>
                    ))}
                    <div
                      onClick={
                        state?.pin?.likes?.includes(userinfo?.user?._id)
                          ? handleDislikePin
                          : handleLikePin
                      }
                    >
                      {state?.pin?.likes?.includes(userinfo?.user?._id) ? (
                        <AiFillHeart
                          color='red'
                          size='25px'
                          type='button'
                          title='You liked this post'
                        />
                      ) : (
                        <AiFillHeart
                          color='black'
                          size='25px'
                          type='button'
                          title='like this post'
                        />
                      )}
                    </div>
                  </div>
                </div>
                <p className='fw-bold mb-5 text-end'>
                  {state?.pin?.likes?.length} likes
                </p>
                <hr />
                <Comment pinId={pinId} />
              </>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  )
}
