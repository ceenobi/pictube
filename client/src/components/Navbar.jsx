import { NavLink } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Dropdown from 'react-bootstrap/Dropdown'
import { useStateContext } from '../config/context'
import SearchBox from './SearchBox'

export default function Navbar() {
  const { userinfo, setLogOut } = useStateContext()

  return (
    <header
      className='position-fixed w-100 top-0 bg-white shadow-sm'
      style={{ zIndex: 10 }}
    >
      <Container
        fluid
        className='d-flex align-items-center justify-content-between p-3'
      >
        <NavLink to='/' className='font-bold display-5 logo text-black me-2'>
          Pictube
        </NavLink>
        {userinfo !== null ? (
          <>
            <div className='d-none d-md-block'>
              <SearchBox />
            </div>
            <div className='d-flex gap-1 gap-md-4 align-items-center'>
              <NavLink
                to='/create-pin'
                className='rounded text-decoration-none link py-2 px-3 text-white'
              >
                Create
              </NavLink>
              <Dropdown>
                <Dropdown.Toggle variant='none' id='dropdown-basic'>
                  <Image
                    src={userinfo?.user?.image}
                    alt={userinfo?.user?.username}
                    roundedCircle
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                    }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText className='text-capitalize fw-bold'>
                    {' '}
                    Hi, {userinfo?.user?.username}
                  </Dropdown.ItemText>
                  <Dropdown.Item
                    as={NavLink}
                    to={`/user-profile/${userinfo?.user?.username}`}
                  >
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={setLogOut}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </>
        ) : (
          <NavLink
            to='/account'
            className='rounded text-decoration-none link py-2 px-3 text-white'
          >
            Sign in
          </NavLink>
        )}
      </Container>
    </header>
  )
}
