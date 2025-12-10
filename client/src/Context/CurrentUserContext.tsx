import { createContext, useState, Dispatch, ReactNode } from "react";

type CurrentUserContextType = [
    currentUser: string | null,
    setCurrentUser: Dispatch<React.SetStateAction<string | null>>,
]
type CurrentUserProviderProps = {
    children: ReactNode;
}

export const CurrentUserContext = createContext<CurrentUserContextType | null>(null);

const CurrentUserProvider = ({children}: CurrentUserProviderProps) => {
    const [ currentUser, setCurrentUser ] = useState<string | null>(null);
    return (
        <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
            {children}
        </CurrentUserContext.Provider>
    )
}

export default CurrentUserProvider;