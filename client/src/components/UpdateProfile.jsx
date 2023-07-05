/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useStateContext } from '../config/context'
import { updateUserProfile, uploadToCloudinary } from '../config/api'
import Loader from '../utils/Loader'
import { useNavigate } from 'react-router-dom'

export default function UpdateProfile({ data }) {
  const [show, setShow] = useState(false)
  const [imgPic, setImgPic] = useState('')
  const [imgLink, setImgLink] = useState('')
  const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { userinfo } = useStateContext()
  const navigate = useNavigate()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleUploadPic = useCallback(async () => {
    try {
      const upload = await uploadToCloudinary(imgPic)
      const profileImg = upload.data.secure_url
      setImgLink(profileImg)
    } catch (error) {
      console.error(error)
    }
  }, [imgPic])

  useEffect(() => {
    if (imgPic !== '') {
      handleUploadPic()
    }
  }, [handleUploadPic, imgPic])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedProfile = {
        userId: userinfo?.user?._id,
        username: username,
        image: imgLink,
        email: email,
        bio: bio,
        // password: password,
      }
      const res = await updateUserProfile(
        updatedProfile,
        userinfo?.access_token
      )
      if (res.status === 201) {
        toast.success('User profile updated successfully')
        localStorage.setItem('userinfo', JSON.stringify(res?.data))
        handleClose()
        navigate(0)
      }
    } catch (error) {
      console.error(error)
      setError(error)
      toast.error('There was a problem updating your profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {data?._id === userinfo?.user?._id && (
        <Button
          className='font-semibold link py-2 px-3 rounded text-white mb-4'
          onClick={handleShow}
        >
          Edit profile
        </Button>
      )}
      <Modal show={show} onHide={handleClose} backdrop='static' centered>
        <Modal.Header closeButton>
          <Modal.Title>Update your profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p>{error.message}</p>}
          {loading ? (
            <Loader />
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='formProfileUpload' className='mb-4 mt-5'>
                <Form.Control
                  type='file'
                  accept='image/png, image/jpeg'
                  placeholder='Upload profile image'
                  className='mb-1 rounded-0 bg-black text-white'
                  onChange={(e) => setImgPic(e.target.files[0])}
                />
                <p className='small'>choose your profile image</p>
              </Form.Group>
              <Form.Group controlId='formBasicUsername' className='mb-3 mt-4'>
                <Form.Control
                  type='text'
                  placeholder='Username'
                  className='mb-1 rounded-0'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicEmail' className='mt-4'>
                <Form.Control
                  type='email'
                  placeholder='Email'
                  className='mb-1 rounded-0'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              {/* <Form.Group controlId='formBasicPassword' className='mt-4'>
                <Form.Control
                  type='password'
                  placeholder='Password'
                  className='mb-1 rounded-0 '
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group> */}
              <Form.Group controlId='formBasicBio' className='mt-4'>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='About me'
                  className='mb-1 rounded-0'
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Form.Group>
              <div className='text-end mt-4'>
                <Button type='submit' variant='dark'>
                  Update
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
