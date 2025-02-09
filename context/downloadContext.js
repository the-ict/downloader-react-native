import { createContext, useReducer } from "react"

export const downloadContext = createContext()

let initialState = {
    videos: [],
    activeQuery: {},
    querysChanging: false,
    downloadProgress: {},
}

const reducer = (state, action) => {
    switch (action.type) {
        case "add":
            return {
                ...state,
                videos: [...state.videos, action.payload]
            }
        case "querysChanging":
            return {
                ...state,
                querysChanging: action.payload
            }
        case "downloadProgress":
            return {
                ...state,
                downloadProgress: {
                    ...state.downloadProgress,
                    [action.payload.id]: action.payload.progress
                }
            }
        case "activeQueryUpdate":
            return {
                ...state,
                activeQuery: action.payload
            }
        default:
            return state;
    }
}

export const DownloadProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <downloadContext.Provider value={{
            state, dispatch
        }}>
            {children}
        </downloadContext.Provider>
    )
}