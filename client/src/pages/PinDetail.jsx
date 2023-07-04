import { useCallback, useEffect, useReducer, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loader from '../utils/Loader'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'
import {
  dislikePinPost,
  getComments,
  getPinDetail,
  likePinPost,
} from '../config/api'
import { MdDownload } from 'react-icons/md'
import { AiFillHeart } from 'react-icons/ai'
import { Comment, Error } from '../components'
import { downloadImage } from '../utils/DownloadImage'
import { PinReducer, initialState } from '../reducers/pinReducer'
import { useStateContext } from '../config/context'
import {
  CommentPinReducer,
  initialState as initial,
} from '../reducers/commentReducer'

export default function PinDetail() {
  const { pinId } = useParams()
  const [data, setData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)
  const [state, dispatch] = useReducer(PinReducer, initialState)
  // const [comment, dispatch] = useReducer(CommentPinReducer, initial)
  const { userinfo } = useStateContext()
  const length = data?.image?.length

  const fetchPinDetail = useCallback(async () => {
    setLoading(true)
    await getPinDetail(pinId)
      .then((res) => {
        setData(res.data)
      })
      .catch((error) => {
        setError(error)
        toast.error(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [pinId])

  useEffect(() => {
    document.title = data?.title
    fetchPinDetail()
  }, [data?.title, fetchPinDetail])
  console.log('state', state)

  // const fetchComments = useCallback(async () => {
  //   dispatchB({ type: 'COMMENT_REQUEST' })
  //   getComments(pinId)
  //     .then((res) => {
  //       dispatch({ type: 'COMMENT_SUCCESS', payload: res.data })
  //     })
  //     .catch((error) => {
  //       dispatchB({ type: 'COMMENT_ERROR', payload: error })
  //       toast.error(error.message)
  //     })
  //     .finally(() => {
  //       dispatchB({ type: 'END_REQUEST' })
  //     })
  // }, [pinId])

  // useEffect(() => {
  //   fetchComments()
  // }, [fetchComments])

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
    fetchPinDetail()
  }
  const handleDislikePin = async () => {
    await dislikePinPost(pinId, userinfo?.user?._id, userinfo?.access_token)
    dispatch({
      type: 'DISLIKE_PIN_SUCCESS',
      payload: userinfo?.user?._id,
    })
    fetchPinDetail()
  }

  if (error) return <Error />

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
              <div className='d-flex justify-content-center align-items-start mx-auto w-100 h-100 position-relative'>
                {data?.image?.length > 1 && (
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
                {data?.image?.map((image, i) => (
                  <div key={i} className='pinId'>
                    {i === current && (
                      <Image
                        src={image}
                        alt='imgpic'
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          position: 'relative',
                        }}
                        title={data?.title}
                        className='rounded-4'
                      />
                    )}
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={6}>
              <>
                <h1 className='fs-3 fw-bold mb-4'>{data?.title}</h1>
                <p>{data?.description}</p>
                <div className='d-flex justify-content-between align-items-center mb-0'>
                  <Link to={`/user-profile/${data?.username}`}>
                    <div className='d-flex gap-1 align-items-center'>
                      <Image
                        src={data?.userImg}
                        alt={data?.username}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '100%',
                        }}
                      />
                      <span className='fw-bold text-black'>
                        {data?.username}
                      </span>
                    </div>
                  </Link>
                  <div className='d-flex align-items-center gap-2 py-2'>
                    {data?.image?.map((image, i) => (
                      <div key={i}>
                        {i === current && (
                          <MdDownload
                            color='black'
                            size='25px'
                            type='button'
                            title='download image'
                            onClick={() => downloadImage(data?._id, image)}
                          />
                        )}
                      </div>
                    ))}
                    <div
                      onClick={
                        data?.likes?.includes(userinfo?.user?._id)
                          ? handleDislikePin
                          : handleLikePin
                      }
                    >
                      {data?.likes?.includes(userinfo?.user?._id) ? (
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
                  {data?.likes?.length} likes
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
