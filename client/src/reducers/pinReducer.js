export const initialState = {
  pin: null,
  errorMessage: null,
}

export const PinReducer = (state, action) => {
  console.log('pin like dispatched', action)
  switch (action.type) {
    case 'LIKE_PIN_SUCCESS':
      return {
        ...state,
        pin: action.payload,
      }
    case 'DISLIKE_PIN_SUCCESS':
      return {
        ...state,
        pin: action.payload,
      }
    case 'DELETE_PIN_SUCCESS':
      return {
        ...state,
        pin: action.payload,
      }
    case 'PIN_ERROR':
      return {
        ...state,
        errorMessage: action.payload.error,
      }
    default:
      throw new Error()
  }
}
