/* eslint-disable react/prop-types */
import { Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdOutlineDownloadForOffline } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import { downloadImage } from '../utils/DownloadImage'
import { useStateContext } from '../config/context'

export function Card({ _id, image, title }) {
  return (
    <div className='cardBox w-100 h-auto rounded-4'>
      <Link to={`/pin/${_id}`} className='rounded-4'>
        <Image className='w-100 h-100 rounded-4' src={image[0]} alt={title} />
      </Link>
      <div className='d-flex justify-content-end card_options p-2 focus-content'>
        <MdOutlineDownloadForOffline
          size='25px'
          type='button'
          color='white'
          onClick={() => downloadImage(_id, image[0])}
        />
      </div>
    </div>
  )
}
export function CardMini({ _id, image, title, userId, deleteYourPin }) {
  const { userinfo } = useStateContext()
  return (
    <div className='cardBox w-100 h-auto rounded-4'>
      <Link to={`/pin/${_id}`} className='rounded-4'>
        <Image className='w-100 h-100 rounded-4' src={image[0]} alt={title} />
      </Link>
      {userinfo?.user?._id === userId && (
        <div className='d-flex justify-content-end card_options py-2 px-4 focus-content'>
          <AiFillDelete
            size='22px'
            type='button'
            color='white'
            onClick={() => deleteYourPin(_id)}
          />
        </div>
      )}
    </div>
  )
}
export function CardSearch({ _id, image, title }) {
  return (
    <div className='cardBox w-100 h-auto rounded-4'>
      <Link to={`/pin/${_id}`} className='rounded-4'>
        <Image className='w-100 h-100 rounded-4' src={image[0]} alt={title} />
      </Link>
    </div>
  )
}
