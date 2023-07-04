import toast from 'react-hot-toast'
import { useStateContext } from '../config/context'
import { createPin, uploadToCloudinary } from '../config/api'
import { useNavigate } from 'react-router-dom'
import { useReducer, useState } from 'react'
import { CreatePinReducer, initialState } from '../reducers/createPinReducer'
import { Form, Container, Button } from 'react-bootstrap'
import Loader from '../utils/Loader'

export default function Create() {
  const [state, dispatch] = useReducer(CreatePinReducer, initialState)
  const [selectedTags, setSelectedTags] = useState([])
  const { userinfo } = useStateContext()
  const navigate = useNavigate()

  const addTags = (e) => {
    e.preventDefault()
    if (state.tags !== initialState) {
      setSelectedTags(
        selectedTags,
        dispatch({
          type: 'CREATE_SELECTEDTAGS',
          payload: selectedTags.push(state.tags),
        })
      )
      dispatch({
        type: 'RESET_TAGS',
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: 'CREATE_REQUEST' })
    let arrImg = []
    try {
      for (let i = 0; i < state.selectedFile.length; i++) {
        const upload = await uploadToCloudinary(state.selectedFile[i])
        const url = upload.data.secure_url
        arrImg.push(url)
      }
      const newPin = {
        userId: userinfo?.user?._id,
        title: state.title,
        tags: selectedTags,
        description: state.desc,
        image: arrImg,
      }
      const res = await createPin(newPin, userinfo?.access_token)
      if (res.status === 201) {
        toast.success('Pin Posted successfully')
        navigate('/')
      }
    } catch (error) {
      console.error(error)
      dispatch({ type: 'CREATE_ERROR', payload: error })
      toast.error(error.message)
    } finally {
      dispatch({ type: 'END_REQUEST' })
    }
  }

  return (
    <section className='sec'>
      <Container
        fluid='xl'
        className='mx-auto py-5 px-3 bg-white d-md-flex flex-column justify-content-start align-items-center'
        style={{ minHeight: '100vh' }}
      >
        <h1 className='mb-4'>Create a pin</h1>
        {state.loading === true ? (
          <Loader title='Posting...' />
        ) : (
          <Form
            className='d-lg-flex justify-content-center justify-content-md-around align-items-center gap-5 shadow-md p-2 p-lg-3 border border-2'
            onSubmit={handleSubmit}
          >
            <Form.Group
              controlId='formBasicUpload'
              className='mb-4 mt-5 w-100 '
            >
              <Form.Control
                type='file'
                required
                multiple
                accept='image/*'
                placeholder='Upload image'
                className='mb-1 rounded-0 bg-black text-white'
                onChange={(event) =>
                  dispatch({ type: 'CREATE_FILE', payload: event.target.files })
                }
              />
              <p className='small'>Upload images you want to use</p>
            </Form.Group>
            <div className='formResize'>
              <Form.Group controlId='formBasicTitle' className='mb-3 mt-5'>
                <Form.Control
                  type='text'
                  required
                  placeholder='Add your title'
                  className='mb-1 rounded-0 title'
                  value={state.title}
                  onChange={(event) =>
                    dispatch({
                      type: 'CREATE_TITLE',
                      payload: event.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group
                controlId='formBasicDescription'
                className='mb-3 mt-5'
              >
                <Form.Control
                  type='text'
                  required
                  placeholder='Tell everyone what your pin is all about 😃'
                  className='mb-1 rounded-0'
                  value={state.desc}
                  onChange={(event) =>
                    dispatch({
                      type: 'CREATE_DESC',
                      payload: event.target.value,
                    })
                  }
                />
              </Form.Group>
              <div>
                <Form.Group controlId='formBasicTag ' className='mb-3 mt-5'>
                  <Form.Control
                    type='text'
                    placeholder='Adding a tag helps others find your pin'
                    className='mb-3 rounded-0'
                    value={state.tags}
                    onChange={(event) =>
                      dispatch({
                        type: 'CREATE_TAGS',
                        payload: event.target.value,
                      })
                    }
                  />
                  <div className='d-flex gap-2 mb-0'>
                    {selectedTags.map((tag, i) => (
                      <p key={i} className='small fw-bold'>
                        {tag}
                      </p>
                    ))}
                  </div>
                  <div className='d-flex justify-content-end'>
                    <Button variant='dark' type='button' onClick={addTags}>
                      Add Tag
                    </Button>
                  </div>
                </Form.Group>
              </div>

              <Button
                className='font-semibold link py-2 px-3 rounded text-white w-100 mt-4 mb-4'
                type='submit'
              >
                Post
              </Button>
            </div>
          </Form>
        )}
      </Container>
    </section>
  )
}
