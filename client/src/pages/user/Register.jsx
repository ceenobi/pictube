import { useForm } from 'react-hook-form'
import { useEffect, useReducer } from 'react'
import toast from 'react-hot-toast'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link, useNavigate } from 'react-router-dom'
import registerOptions from '../../utils/FormValidate'
import UserPageLayout from '../../components/UserPageLayout'
import { registerUser } from '../../config/api'
import { AuthReducer, initialState } from '../../reducers/userReducer'
import { useStateContext } from '../../config/context'
import Loader from '../../utils/Loader'

export default function Register() {
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  const { getUserDetails } = useStateContext()
  const redirect = location.search ? location.search.split('=')[1] : '/'
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
     document.title = 'Register'
    if (state !== initialState) {
      getUserDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const onSubmitHandler = async ({ username, email, password }, e) => {
    e.preventDefault()
    dispatch({ type: 'AUTH_REQUEST' })
    await registerUser({ username, email, password })
      .then((res) => {
        console.log('reg', res)
        dispatch({ type: 'AUTH_SUCCESS', payload: res.data })
        toast.success(res.data.msg)
        navigate(redirect)
      })
      .catch((error) => {
        dispatch({ type: 'AUTH_ERROR', payload: error })
        toast.error('User already exists')
        console.error(error)
      })
  }

  return (
    <UserPageLayout header='Register'>
      {state.loading === true ? (
        <Loader title='Registering...' />
      ) : (
        <Form
          className='mt-4 w-100 px-2'
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <Form.Group className='mb-3' controlId='username'>
            <Form.Control
              type='text'
              placeholder='Username'
              className='mb-0'
              {...register(`username`, registerOptions.username)}
            />
            {errors?.username?.message && (
              <span className='text-danger small'>
                {errors.username.message}
              </span>
            )}
          </Form.Group>
          <Form.Group className='mb-3' controlId='email'>
            <Form.Control
              type='email'
              placeholder='Email'
              className='mb-0'
              {...register(`email`, registerOptions.email)}
            />
            {errors?.email?.message && (
              <span className='text-danger small'>{errors.email.message}</span>
            )}
          </Form.Group>
          <Form.Group className='mb-3' controlId='password'>
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
          </Form.Group>
          <Button
            className='font-semibold link py-2 px-3 rounded text-white w-100 mt-4 mb-4'
            type='submit'
          >
            Register
          </Button>
          <p className='text-center font-bold text-black'>OR</p>
          <p className='text-sm text-secondary text-center'>
            Registered already?{' '}
            <Link to='/account' className='text-danger font-bold'>
              Get back in
            </Link>
          </p>
        </Form>
      )}
    </UserPageLayout>
  )
}
