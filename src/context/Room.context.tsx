import React, { createContext, ReactNode, useReducer, useContext } from 'react'

// Define the shape of our context state
interface Message {
    time: string
    content: string
    username: string
}

interface RoomState {
    people: string[]
    messages: Message[]
    roomId: string
}

interface RoomContextProps extends RoomState {
    addPerson: (username: string) => void
    removePerson: (username: string) => void
    addMessage: (message: Message) => void
    setRoomId: (id: string) => void
}

const initialState: RoomState = {
    people: [],
    messages: [],
    roomId: ''
}

type Action =
    | { type: 'ADD_PERSON'; payload: string }
    | { type: 'REMOVE_PERSON'; payload: string }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'SET_ROOM'; payload: string }

function roomReducer(state: RoomState, action: Action): RoomState {
    switch (action.type) {
        case 'ADD_PERSON':
            return {
                ...state,
                people: [...state.people, action.payload],
            };
        case 'REMOVE_PERSON':
            return {
                ...state,
                people: state.people.filter(person => person !== action.payload),
            };
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case 'SET_ROOM':
            return {
                ...state,
                roomId: action.payload,
            };
        default:
            return state;
    }
}

// Create context with default values
const RoomContext = createContext<RoomContextProps>({
    ...initialState,
    addPerson: () => {},
    removePerson: () => {},
    addMessage: () => {},
    setRoomId: ()=>{}
});

interface RoomProviderProps {
    children: ReactNode;
}

// Context provider component
export function RoomProvider({ children }: RoomProviderProps) {
    const [state, dispatch] = useReducer(roomReducer, initialState);

    const addPerson = (username: string) => {
        dispatch({ type: 'ADD_PERSON', payload: username });
    };

    const removePerson = (username: string) => {
        dispatch({ type: 'REMOVE_PERSON', payload: username });
    };

    const addMessage = (message: Message) => {
        dispatch({ type: 'ADD_MESSAGE', payload: message });
    };

    const setRoomId = (id: string) => {
        dispatch({ type: 'SET_ROOM', payload: id });
    };

    return (
        <RoomContext.Provider value={{ ...state, addPerson, removePerson, addMessage, setRoomId }}>
            {children}
        </RoomContext.Provider>
    );
}

// Custom hook to use the RoomContext
export const useRoomContext = () => {
    return useContext(RoomContext)
}