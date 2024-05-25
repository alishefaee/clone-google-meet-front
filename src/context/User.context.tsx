import React, {createContext, useState, ReactNode, useEffect} from 'react'

interface UsernameContextProps {
    username: string
    setUsername: (username: string) => void
}

export const UsernameContext = createContext<UsernameContextProps>({
    username: '',
    setUsername: () => {},
})

interface UsernameProviderProps {
    children: ReactNode
}

export function UsernameProvider({ children }: UsernameProviderProps) {
    const [username, setUsername] = useState<string>('')

    return (
        <UsernameContext.Provider value={{ username, setUsername }}>
            {children}
        </UsernameContext.Provider>
    )
}
