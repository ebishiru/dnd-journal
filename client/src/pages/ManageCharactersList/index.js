import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

import styled from "styled-components";

const ManageCharactersList = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const [ allUserCharacters, setAllUserCharacters ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }

        const fetchCharacters = async (ev) => {
            try {
                const response = await fetch("/characters");
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    //only keep characters that are created by the user
                    const userCharacters = data.data.filter((character) => {
                        return character.author === currentUser
                    });
                    setAllUserCharacters(userCharacters);
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        }

        fetchCharacters();

    },[currentUser])

    if (!allUserCharacters) {
        return (
            <p>Loading Characters...</p>
        )
    }

    return (
        <>
            <p>Manage characters list.</p>
            <HeaderRow>
                <span>Character</span>
                <span>Author</span>
                <span>Created</span>
            </HeaderRow>
            {
                allUserCharacters.map((character) => {
                    return (
                        <CharacterRow>
                            <span><Link to={`/manage/character/${character._id}`} key={character._id} className="nameLink">{character.name}</Link></span>
                            <p>{character.author}</p>
                            <p>{character.createdAt}</p>
                        </CharacterRow>
                    )
                    
                })
            }
        </>
    )
}

export default ManageCharactersList;

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