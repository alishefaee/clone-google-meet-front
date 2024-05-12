// UsernameContext.tsx
import React, {createContext, useState, ReactNode, useEffect} from 'react'

// Define the shape of the context value
interface UsernameContextProps {
    username: string
    setUsername: (username: string) => void
}

// Create the context with a default value
export const UsernameContext = createContext<UsernameContextProps>({
    username: '',
    setUsername: () => {},
})

// Define the props type for the provider
interface UsernameProviderProps {
    children: ReactNode
}

// Create a provider component
export function UsernameProvider({ children }: UsernameProviderProps) {
    const [username, setUsername] = useState<string>('')



    return (
        <UsernameContext.Provider value={{ username, setUsername }}>
            {children}
        </UsernameContext.Provider>
    )
}
