import { createContext, useState, ReactNode } from "react";

export const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

type CurrentUserContextType = [
    currentUser: string | null,
    setCurrentUser: (user: string | null) => void,
]
type CurrentUserProviderProps = {
    children: ReactNode;
}

const CurrentUserProvider = ({children}: CurrentUserProviderProps) => {
    const [ currentUser, setCurrentUser ] = useState<string | null>(null);
    return (
        <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
            {children}
        </CurrentUserContext.Provider>
    )
}

export default CurrentUserProvider;