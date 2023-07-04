import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { FiSearch } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'
import { useLocation, useNavigate} from 'react-router-dom'

export default function SearchBox() {
  const [show, setShow] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery) {
      navigate(`search/?q=${searchQuery}`)
    }
  }

  useEffect(() => {
    if (searchQuery !== '') {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [searchQuery])

  useEffect(() => {
    if (location.pathname === 'search') {
      navigate(`/?q=${searchQuery}`)
    }
  }, [location.pathname, navigate, searchQuery])

  return (
    <Form
      className='bg-secondary-subtle position-relative form-search'
      onSubmit={handleSubmit}
    >
      <FiSearch
        size='20px'
        color='gray'
        className='position-absolute top-50 translate-middle'
        type='submit'
        style={{ left: '30px' }}
      />

      <Form.Control
        type='text'
        placeholder='Search'
        className='bg-transparent py-2 searchbox'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {show ? (
        <AiOutlineClose
          type='button'
          className='position-absolute top-50 translate-middle'
          style={{ right: '0' }}
          size='20px'
          color='black'
          onClick={() => {
            setSearchQuery('')
          }}
        />
      ) : (
        ''
      )}
    </Form>
  )
}
