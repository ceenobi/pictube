import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button, Form } from 'react-bootstrap'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import registerOptions from '../../utils/FormValidate'
import { authenticateUser } from '../../config/api'
import UserPageLayout from '../../components/UserPageLayout'

export default function Signin() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmitHandler = async ({ username }, e) => {
    e.preventDefault()
    try {
      const res = await authenticateUser(username)
      if (res.status !== 200) {
        toast.error("Can't find user")
      } else {
        sessionStorage.setItem('username', username)
        navigate('/account/password')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      {location.pathname === '/account/password' ? (
        <Outlet />
      ) : (
        <UserPageLayout header={'Get back in'}>
          <Form
            className='mt-4 w-100'
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <Form.Group className='mb-4' controlId='username'>
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

              <Button
                className='font-semibold link py-2 px-3 rounded text-white w-100 mt-4 mb-4'
                type='submit'
              >
                Next
              </Button>
              <p className='text-center font-bold text-black'>OR</p>
              <p className='text-sm text-secondary text-center'>
                Not registered yet?{' '}
                <Link to='/account/register' className='text-danger font-bold'>
                  Register
                </Link>
              </p>
            </Form.Group>
          </Form>
        </UserPageLayout>
      )}
    </>
  )
}
