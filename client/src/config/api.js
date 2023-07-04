import axios from 'axios'
import { instance, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from './baseURL'

// export async function getUsername() {
//   const token = localStorage.getItem('access_token')
//   if (!token) return Promise.reject('Cannot find Token')
//   let decode = jwt_decode(token)
//   return decode
// }
// export const decodeUserId = async (id) => {
//   try {
//     const res = await instance.get(`/api/v1/auth/decodeId/${id}`)
//     return res
//   } catch (error) {
//     return { error: 'Cannot find user by the id' }
//   }
// }

export const authenticateUser = async (username) => {
  try {
    return await instance.post(`/api/v1/auth/authenticate`, { username })
  } catch (error) {
    return { error: "Can't find user" }
  }
}

export const getUser = async (username) => {
  try {
    const res = await instance.get(`/api/v1/auth/user/${username}`)
    return res
  } catch (error) {
    return { error: 'Password does not match' }
  }
}

export const registerUser = async (details) => {
  try {
    const res = await instance.post(`/api/v1/auth/register`, details)
    let { username, email } = details
    if (res.status === 201) {
      await instance.post(`/api/v1/auth/registerMail`, {
        username,
        userEmail: email,
        text: res.msg,
      })
    }
    return res
  } catch (error) {
    return { error: 'User already exists' }
  }
}

export const loginUser = async ({ username, password }) => {
  try {
    if (username) {
      const res = await instance.post('/api/v1/auth/login', {
        username,
        password,
      })
      return res
    }
  } catch (error) {
    return { error: "Password doesn't Match...!" }
  }
}

export const updateUser = async (profile) => {
  try {
    const token = localStorage.getItem('accessToken')
    const res = await instance.put('/api/v1/auth/updateuser', profile, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (error) {
    return { error: "Couldn't Update Profile...!" }
  }
}

export const generateOTP = async (username) => {
  try {
    const {
      data: { code },
      status,
    } = await instance.get('/api/v1/auth/generateOTP', { params: { username } })
    if (status === 201) {
      let {
        data: { email },
      } = await getUser(username)
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`
      await instance.post('/api/v1/auth/registerMail', {
        username,
        userEmail: email,
        text,
        subject: 'Password Recovery OTP',
      })
    }
    return Promise.resolve(code)
  } catch (error) {
    return { error: error }
  }
}

export const verifyOTP = async ({ username, code }) => {
  try {
    const { data, status } = await instance.get('/api/v1/auth/verifyOTP', {
      params: { username, code },
    })
    return { data, status }
  } catch (error) {
    return { error: error }
  }
}

export const resetPassword = async ({ username, password }) => {
  try {
    const res = await instance.put('/api/v1/auth/resetPassword', {
      username,
      password,
    })
    return res
  } catch (error) {
    return { error: error }
  }
}

export const getPins = async () => {
  try {
    const { data } = await instance.get('/api/v1/pin/pins')
    return { data }
  } catch (error) {
    return { error: 'could not fetch pins' }
  }
}

export const createPin = async (pin, token) => {
  try {
    const data = await instance.post('/api/v1/pin/create-pin', pin, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (error) {
    return { error: 'Sorry, could not create your pin' }
  }
}

export const deletePin = async (pinId, token) => {
  try {
    const data = await instance.delete(`api/v1/pin/${pinId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (error) {
    return { error: 'Sorry, could not delete pin' }
  }
}

export const getPinDetail = async (id) => {
  try {
    const data = await instance.get(`/api/v1/pin/pin-detail/${id}`)
    return data
  } catch (error) {
    return { error: 'Sorry, could not find this pin' }
  }
}

export const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  const data = await axios.post(CLOUDINARY_URL, formData)
  return data
}
export const postComment = async (
  { userId, pinId, comment, image, username },
  token
) => {
  try {
    const data = await instance.post(
      `/api/v1/pin/comment`,
      {
        userId,
        pinId,
        comment,
        image,
        username,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return data
  } catch (error) {
    return { error: 'Sorry, could not find comments for this pin' }
  }
}
export const getComments = async (pinId) => {
  try {
    const data = await instance.get(`/api/v1/pin/comment/${pinId}`)
    return data
  } catch (error) {
    return { error: 'Sorry, could not find comments for this pin' }
  }
}
export const deleteComment = async (pinId, commentId, token) => {
  try {
    const data = await instance.delete(
      `/api/v1/pin/comment/${pinId}/${commentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return data
  } catch (error) {
    return { error: error }
  }
}

export const likePinPost = async (pinId, userId, token) => {
  try {
    const data = await instance.put(`/api/v1/pin/${pinId}/like`, userId, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (error) {
    return { error: error }
  }
}
export const dislikePinPost = async (pinId, userId, token) => {
  try {
    const data = await instance.put(`/api/v1/pin/${pinId}/dislike`, userId, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (error) {
    return { error: error }
  }
}

export const getUserProfileAndPins = async (username, token) => {
  try {
    const res = await instance.get(`/api/v1/pin/user/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (error) {
    return error
  }
}

export const updateUserProfile = async (profile, token) => {
  try {
    const res = await instance.put(`/api/v1/auth/updateuser`, profile, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res
  } catch (error) {
    return { error: 'Could not update user details' }
  }
}
export const getPinsBySearch = async (searchParams) => {
  try {
    const res = await instance.get(`/api/v1/pin/search/?q=${searchParams}`)
    return res
  } catch (error) {
    return { error: 'Could not find your pin' }
  }
}
export const getPinsByTags = async (tagParams) => {
  try {
    const res = await instance.get(`/api/v1/pin/tags?tags=${tagParams}`)
    return res
  } catch (error) {
    return { error: 'Could not find your pin matching your tag' }
  }
}
