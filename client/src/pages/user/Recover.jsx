import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import toast from 'react-hot-toast'
import UserPageLayout from '../../components/UserPageLayout'
import { generateOTP, verifyOTP } from '../../config/api'

export default function Recover() {
  const [OTP, setOTP] = useState()
  const navigate = useNavigate()

  const username = sessionStorage.getItem('username')

  useEffect(() => {
    document.title = 'Recover password'
    generateOTP(username).then((OTP) => {
      console.log(OTP)
      if (OTP) return toast.success('OTP has been send to your email!')
      return toast.error('Problem while generating OTP!')
    })
  }, [username])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      let { status } = await verifyOTP({ username, code: OTP })
      if (status === 201) {
        toast.success('Verified Successfully!')
        return navigate('/reset-password')
      }
    } catch (error) {
      return toast.error('Wrong OTP! Check email again!')
    }
  }

  const resendOTP = () => {
    let sentPromise = generateOTP(username)
    toast.promise(sentPromise, {
      loading: 'Sending...',
      success: <b>OTP has been send to your email!</b>,
      error: <b>Could not Send it!</b>,
    })

    sentPromise.then((OTP) => {
      console.log(OTP)
    })
  }

  return (
    <UserPageLayout header='Recovery'>
      <Form className='mt-4 w-100' onSubmit={onSubmitHandler}>
        <Form.Group className='mb-2' controlId='otp'>
          <Form.Label> Enter 6 digit OTP sent to your email address</Form.Label>
          <Form.Control
            type='text'
            placeholder='OTP PIN'
            className='mb-0'
            onChange={(e) => setOTP(e.target.value)}
          />
        </Form.Group>
        <Button
          className='font-semibold link py-2 px-3 rounded text-white w-100 mt-4 mb-4'
          type='submit'
        >
          Recover
        </Button>
        <div className='d-flex align-items-center justify-content-center gap-1 '>
          <span className='text-sm text-secondary text-center'>
            Did not get OTP?{' '}
          </span>
          <Button
            type='button'
            variant='none'
            className='text-danger font-semibold'
            onClick={resendOTP}
          >
            Resend
          </Button>
        </div>
      </Form>
    </UserPageLayout>
  )
}
