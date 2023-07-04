export const initialState = {
  title: '',
  tags: '',
  desc: '',
  selectedFile: [],
  selectedTags: [],
  loading: false,
  errorMessage: null,
}

export const CreatePinReducer = (state, action) => {
  console.log('pin create dispatched', action)
  switch (action.type) {
    case 'CREATE_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'CREATE_TAGS':
      return {
        ...state,
        tags: action.payload,
      }
    case 'RESET_TAGS':
      return {
        ...state,
        tags: '',
      }
    case 'CREATE_TITLE':
      return {
        ...state,
        title: action.payload,
      }
    case 'CREATE_DESC':
      return {
        ...state,
        desc: action.payload,
      }
    case 'CREATE_FILE':
      return {
        ...state,
        selectedFile: action.payload,
        loading: false,
      }
    case 'CREATE_SELECTEDTAGS':
      return {
        ...state,
        selectedTags: action.payload,
        loading: false,
      }
    case 'CREATE_ERROR':
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.error,
      }
    case 'END_REQUEST':
      return {
        ...state,
        loading: false,
      }
    default:
      throw new Error()
  }
}
