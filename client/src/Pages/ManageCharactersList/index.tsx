import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import styled from "styled-components";

type Character = {
    _id: string,
    name: string,
    author: string,
    createdAt: string,
    lastEdit: string,
    story: string,
    quotes: string[],
}

const ManageCharactersList = () => {
    const navigate = useNavigate();
    const context = useContext(CurrentUserContext);
    if (!context) return ("CurrentUserContext is null");
    const [ currentUser, setCurrentUser ] = context;
    const [ allUserCharacters, setAllUserCharacters ] = useState<Character[] | null>(null);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const [ sortNameAsc, setSortNameAsc ] = useState<boolean>(true);
    const [ sortDateAsc, setSortDateAsc ] = useState<boolean>(true);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }

        const fetchCharacters = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/characters`);
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    //only keep characters that are created by the user
                    const userCharacters = data.data.filter((character: Character) => {
                        return character.author === currentUser
                    });
                    setAllUserCharacters(userCharacters);
                }
            } catch (error: any) {
                setErrorMessage(error.message);
            }
        }
        fetchCharacters();
    },[currentUser])

    //Sorting handlers
    const handleSortByName = () => {
        if (!allUserCharacters) return;
        const sorted = [...allUserCharacters].sort((a, b) => {
            return sortNameAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        setAllUserCharacters(sorted);
        setSortNameAsc(!sortNameAsc);
    }

    const parseDDMMYYYY = (dateString: string) => {
        const [ day, month, year] =dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    }

    const handleSortByDate = () => {
        if (!allUserCharacters) return;
        const sorted = [...allUserCharacters].sort((a, b) => {
            const dateA = parseDDMMYYYY(a.createdAt).getTime();
            const dateB = parseDDMMYYYY(b.createdAt).getTime();
            return sortDateAsc ? dateA - dateB : dateB - dateA;
        });
        setAllUserCharacters(sorted);
        setSortDateAsc(!sortDateAsc);
    }

    if (!allUserCharacters) {
        return (
            <LoadingContainer>
                <img src="/fire.gif" />
                <p>Loading...</p>
            </LoadingContainer>
        )
    }

    return (
        <>
            <HeaderRow>
                <span>Character<button onClick={handleSortByName}>{sortNameAsc ? "▲" : "▼"}</button></span>
                <span>Created<button onClick={handleSortByDate}>{sortDateAsc ? "▼" : "▲"}</button></span>
            </HeaderRow>
            {
                allUserCharacters.map((character) => {
                    return (
                        <CharacterRow key={character._id}>
                            <span><Link to={`/manage/character/${character._id}`}  className="nameLink">{character.name}</Link></span>
                            <p>{character.createdAt}</p>
                        </CharacterRow>
                    )
                    
                })
            }
        </>
    )
}

export default ManageCharactersList;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
    gap: 1rem;
    p {
        font-weight: bold;
    }
`
const HeaderRow = styled.div`
    display: grid;
    grid-template-columns: 7fr 2fr;
    gap: 1rem;
    padding: 0.5rem;
    border: 0.1rem solid #2E2B2B;
    font-weight: bold;
    background-color: #A68B6E;
    button {
        background-color: #2E2B2B;
        color: #D4AF37;
        width: 1rem;
        height: 1rem;
        padding: 0;
        margin-left: 0.25rem;
    }
`
const CharacterRow = styled.div`
    display: grid;
    grid-template-columns: 7fr 2fr;
    gap: 1rem;
    padding: 0.5rem;
    border-bottom: 0.1rem dashed #2E2B2B;
    &:hover {
        background-color: #A68B6E;
    }
    span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    }
    .nameLink {
        color: #6C3483;
        font-weight: bold;
    }
`