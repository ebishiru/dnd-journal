import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

type Character = {
    _id: string,
    name: string,
    author: string,
    createdAt: string,
}

const CharactersList = () => {
    const [ allCharacters, setAllCharacters ] = useState<Character[] | null>(null);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const [ sortNameAsc, setSortNameAsc ] = useState(true);
    const [ sortAuthorAsc, setSortAuthorAsc ] = useState(true);
    const [ sortDateAsc, setSortDateAsc ] = useState(true);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/characters`);
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    setAllCharacters(data.data);
                }
            } catch (error: any) {
                setErrorMessage(error.message);
            }
        }
        fetchCharacters();
    }, [])

    //Sorting handlers
    const handleSortByName = () => {
        if (!allCharacters) return;
        const sorted = [...allCharacters].sort((a, b) => {
            return sortNameAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        setAllCharacters(sorted);
        setSortNameAsc(!sortNameAsc);
    }

    const handleSortByAuthor = () => {
        if (!allCharacters) return;
        const sorted = [...allCharacters].sort((a, b) => {
            return sortAuthorAsc ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author);
        });
        setAllCharacters(sorted);
        setSortAuthorAsc(!sortAuthorAsc);
    }

    const parseDDMMYYYY = (dateString: string) => {
        const [ day, month, year] =dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    }

    const handleSortByDate = () => {
        if (!allCharacters) return;
        const sorted = [...allCharacters].sort((a, b) => {
            const dateA = parseDDMMYYYY(a.createdAt).getTime();
            const dateB = parseDDMMYYYY(b.createdAt).getTime();
            return sortDateAsc ? dateA - dateB : dateB - dateA;
        });
        setAllCharacters(sorted);
        setSortDateAsc(!sortDateAsc);
    }

    if (!allCharacters) {
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
                <span>Author<button onClick={handleSortByAuthor}>{sortAuthorAsc ? "▲" : "▼"}</button></span>
                <span>Created<button onClick={handleSortByDate}>{sortDateAsc ? "▼" : "▲"}</button></span>
            </HeaderRow>
            {
                allCharacters.map((character) => {
                    return (
                            <CharacterRow>
                                <span><Link to={`/character/${character._id}`} key={character._id} className="nameLink">{character.name}</Link></span>
                                <p>{character.author}</p>
                                <p>{character.createdAt}</p>
                            </CharacterRow>
                        
                    )
                })
            }
        </>
    )
}

export default CharactersList;

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
    grid-template-columns: 5fr 2fr 2fr;
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
    grid-template-columns: 5fr 2fr 2fr;
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