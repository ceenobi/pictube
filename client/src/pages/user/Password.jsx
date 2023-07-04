import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useReducer } from 'react'
import registerOptions from '../../utils/FormValidate'
import UserPageLayout from '../../components/UserPageLayout'
import { AuthReducer, initialState } from '../../reducers/userReducer'
import { getUser, loginUser } from '../../config/api'
import { useStateContext } from '../../config/context'
import Loader from '../../utils/Loader'

export default function Password() {
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  const [validateUser, setValidateUser] = useState(null)
  const { getUserDetails } = useStateContext()
  const redirect = location.search ? location.search.split('=')[1] : '/'
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const username = sessionStorage.getItem('username')

  useEffect(() => {
    document.title = 'Sign in'
    const usernameCheck = async () => {
      const res = await getUser(username)
      if (res.status === 200) {
        setValidateUser(res.data)
      }
    }
    usernameCheck()
  }, [username])

  useEffect(() => {
    if (state !== initialState) {
      getUserDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const onSubmitHandler = async ({ password }, e) => {
    e.preventDefault()
    dispatch({ type: 'AUTH_REQUEST' })
    await loginUser({ username, password })
      .then((res) => {
        console.log('passres', res)
        dispatch({ type: 'AUTH_SUCCESS', payload: res.data })
        toast.success(res.data.msg)
        navigate(redirect)
      })
      .catch((error) => {
        dispatch({ type: 'AUTH_ERROR', payload: error })
        toast.error('Password does not match')
        console.error(error)
      })
  }

  return (
    <UserPageLayout
      header={`Hi, ${validateUser?.username}`}
      validateUser={validateUser}
    >
      {state.loading === true ? (
        <Loader title='Signing you in' />
      ) : (
        <Form className='mt-4 w-100' onSubmit={handleSubmit(onSubmitHandler)}>
          <Form.Group className='mb-4' controlId='password'>
            <Form.Control
              type='password'
              placeholder='Password'
              className='mb-0'
              {...register(`password`, registerOptions.password)}
            />
            {errors?.password?.message && (
              <span className='text-danger small'>
                {errors.password.message}
              </span>
            )}
            <Button
              className='font-semibold link py-2 px-3 rounded text-white w-100 mt-4 mb-4'
              type='submit'
            >
              Sign in
            </Button>
            <p className='text-sm text-secondary text-center'>
              Forgot your password?{' '}
              <Link to='/recover-password' className='text-danger font-bold'>
                Recover now
              </Link>
            </p>
          </Form.Group>
        </Form>
      )}
    </UserPageLayout>
  )
}
