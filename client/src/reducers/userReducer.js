export const initialState = {
  currentUser: null,
  token: '',
  loading: false,
  errorMessage: null,
  saveUser: '',
}

export const AuthReducer = (state, action) => {
  console.log('pinned dispatched', action)
  switch (action.type) {
    case 'AUTH_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        currentUser: action.payload?.user,
        token: action.payload?.access_token,
        loading: false,
        saveUser: localStorage.setItem(
          'userinfo',
          JSON.stringify(action.payload)
        ),
      }
    case 'LOGOUT':
      return {
        ...state,
        currentUser: '',
        token: '',
        savedUser: localStorage.removeItem('userinfo'),
      }
    case 'AUTH_ERROR':
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.error,
      }
    default:
      throw new Error()
  }
}
