import { useForm } from 'react-hook-form'
import { Button, Form } from 'react-bootstrap'
import toast from 'react-hot-toast'
import UserPageLayout from '../../components/UserPageLayout'
import registerOptions from '../../utils/FormValidate'
import { resetPassword } from '../../config/api'
import { useNavigate, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Error } from '../../components'

export default function Reset() {
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const username = sessionStorage.getItem('username')

  useEffect(() => {
    document.title = 'Reset password'
    const createSession = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/auth/createResetSession`
        )
        if (res.status !== 200)
          return <Navigate to={`/account/password`} replace={true} />
      } catch (error) {
        console.error(error)
        setError(error)
      }
    }
    createSession()
  }, [])

  if (error) return <Error />

  const onSubmit = async ({ password, confirmPassword }, e) => {
    e.preventDefault()
    try {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
      } else {
        const res = await resetPassword({ username, password })
        console.log('respassword', res)
        if (res.status === 201) {
          toast.success('Password reset successful')
          navigate('/account/password')
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('There was a problem reseting your password')
    }
  }

  return (
    <UserPageLayout header='Reset'>
      <Form
        className='mt-4'
        style={{ minWidth: '300px' }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Form.Group className='mb-4' controlId='password'>
          <Form.Control
            type='password'
            placeholder='Password'
            className='mb-0'
            {...register(`password`, registerOptions.password)}
          />
          {errors?.password?.message && (
            <span className='text-danger small'>{errors.password.message}</span>
          )}
        </Form.Group>
        <Form.Group className='mb-4' controlId='confirmPassword'>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            className='mb-0'
            {...register(`confirmPassword`, { required: 'please fill' })}
          />
          {errors?.confirmPassword?.message && (
            <span className='text-danger small'>
              {' '}
              {'passwords must not be empty'}
            </span>
          )}
        </Form.Group>
        <Button
          className='font-semibold link py-2 px-3 rounded text-white w-100 mb-4'
          type='submit'
        >
          Reset
        </Button>
      </Form>
    </UserPageLayout>
  )
}
