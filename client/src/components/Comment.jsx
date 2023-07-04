/* eslint-disable react/prop-types */
import { useEffect, useReducer, useCallback } from 'react'
import toast from 'react-hot-toast'
import { MdDelete } from 'react-icons/md'
import { CommentPinReducer, initialState } from '../reducers/commentReducer'
import { deleteComment, getComments, postComment } from '../config/api'
import Loader from '../utils/Loader'
import { Button, Form } from 'react-bootstrap'
import { useStateContext } from '../config/context'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'

export default function Comment({ pinId }) {
  const [state, dispatch] = useReducer(CommentPinReducer, initialState)
  const { userinfo } = useStateContext()

  const fetchComments = useCallback(async () => {
    dispatch({ type: 'COMMENT_REQUEST' })
    getComments(pinId)
      .then((res) => {
        dispatch({ type: 'COMMENT_SUCCESS', payload: res.data })
      })
      .catch((error) => {
        dispatch({ type: 'COMMENT_ERROR', payload: error })
        toast.error(error.message)
      })
      .finally(() => {
        dispatch({ type: 'END_REQUEST' })
      })
  }, [pinId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const userId = userinfo?.user?._id
  const image = userinfo?.user?.image
  const username = userinfo?.user?.username
  const comment = state.addComment

  const delComment = async (pinnId, commentId, token) => {
    await deleteComment(pinnId, commentId, token)
      .then((res) => {
        if (res.status === 200) {
          toast.success('Comment deleted successfully')
          fetchComments()
        }
      })
      .catch((error) => {
        dispatch({ type: 'COMMENT_ERROR', payload: error })
        toast.error(error.message)
      })
      .finally(() => {
        dispatch({ type: 'END_REQUEST' })
      })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    dispatch({ type: 'COMMENT_REQUEST' })
    try {
      const res = await postComment(
        { userId, pinId, comment, image, username },
        userinfo?.access_token
      )
      if (res.status === 200) {
        toast.success('Comment Posted successfully')
        fetchComments()
      }
    } catch (error) {
      console.error(error)
      dispatch({ type: 'COMMENT_ERROR', payload: error })
      toast.error(error.message)
    } finally {
      dispatch({ type: 'END_REQUEST' })
    }
  }

  return (
    <div className='mt-6'>
      <h1 className='fw-bold fs-5'>{`${state.comments?.length} comments`}</h1>
      {state.errorMesage !== initialState && <p>{state.errorMesage}</p>}
      {state.comments?.length > 0 ? (
        <>
          {state.loading === true ? (
            <Loader title='Fetching comments..' />
          ) : (
            <div
              className='h-[300px] overflow-y-scroll scrollbody'
              style={{ height: '350px'}}
            >
              {state.comments?.map((item) => (
                <div
                  className='d-flex align-items-center justify-content-between mb-1'
                  key={item._id}
                >
                  <div className='d-flex align-items-center justify-content-center gap-2'>
                    <Link to={`/user-profile/${item?.username}`}>
                      <img
                        src={
                          item?.image ||
                          'https://res.cloudinary.com/ceenobi/image/upload/v1685317438/pngwing.com_gksesf.png'
                        }
                        alt={item?.username}
                        style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '100%',
                        }}
                      />
                    </Link>
                    <div className='mb-1'>
                      <div className='d-flex gap-2'>
                        <Link to={`/user-profile/${item?.username}`}>
                          <p className='small fw-bold text-black mb-0'>
                            {item?.username}
                          </p>
                        </Link>
                        <div className='small text-secondary'>
                          {format(item?.createdAt)}
                        </div>
                      </div>
                      <p className='small mb-0'>{item?.comment}</p>
                    </div>
                  </div>
                  {userId === item?.userId ? (
                    <MdDelete
                      size='20px'
                      type='button'
                      title='delete this comment'
                      onClick={() =>
                        delComment(pinId, item?._id, userinfo?.access_token)
                      }
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>Be the first one to comment.</p>
      )}
      <div className='mt-5'>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label>Add comment</Form.Label>
            <Form.Control
              as='textarea'
              rows={2}
              required
              placeholder='Leave a comment... 😃'
              value={state.addComment}
              onChange={(event) =>
                dispatch({
                  type: 'COMMENT_ADDSUCCESS',
                  payload: event.target.value,
                })
              }
            />
          </Form.Group>
          <div className='d-flex justify-content-end'>
            <Button
              type='submit'
              className='font-semibold link py-2 px-3 rounded text-white'
            >
              {state.loading === true ? 'Posting' : 'Post'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
