export const initialState = {
  comments: [],
  addComment: '',
  loading: false,
  errorMessage: null,
}

export const CommentPinReducer = (state, action) => {
  console.log('pin comment dispatched', action)
  switch (action.type) {
    case 'COMMENT_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'COMMENT_SUCCESS':
      return {
        ...state,
        loading: false,
        comments: action.payload,
      }
    case 'COMMENT_ADDSUCCESS':
      return {
        ...state,
        loading: false,
        addComment: action.payload,
      }
    case 'COMMENT_ERROR':
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.error,
      }
    case 'END_REQUEST':
      return {
        ...state,
        loading: false,
        addComment: '',
      }
    default:
      throw new Error()
  }
}
