import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";

const CharactersList = () => {
    const [ allCharacters, setAllCharacters ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);

    useEffect(() => {
        const fetchCharacters = async (ev) => {
            try {
                const response = await fetch("/characters");
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    setAllCharacters(data.data);
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        }

        fetchCharacters();
    }, [])

    if (!allCharacters) {
        return (
            <p>Loading Characters...</p>
        )
    }

    return (
        <>
            <HeaderRow>
                <span>Character</span>
                <span>Author</span>
                <span>Created</span>
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

const HeaderRow = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    gap: 1rem;
    padding: 0.5rem;
    border: 0.1rem solid #2E2B2B;
    font-weight: bold;
    background-color: #A68B6E;
`

const CharacterRow = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
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