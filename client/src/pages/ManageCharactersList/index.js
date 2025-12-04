import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

import styled from "styled-components";

const ManageCharactersList = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const [ allUserCharacters, setAllUserCharacters ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);

    const [ sortNameAsc, setSortNameAsc ] = useState(true);
    const [ sortDateAsc, setSortDateAsc ] = useState(true);

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

    //Sorting handlers
    const handleSortByName = () => {
        const sorted = [...allUserCharacters].sort((a, b) => {
            return sortNameAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        setAllUserCharacters(sorted);
        setSortNameAsc(!sortNameAsc);
    }

    const parseDDMMYYYY = (dateString) => {
        const [ day, month, year] =dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    }

    const handleSortByDate = () => {
        const sorted = [...allUserCharacters].sort((a, b) => {
            const dateA = parseDDMMYYYY(a.createdAt);
            const dateB = parseDDMMYYYY(b.createdAt);
            return sortDateAsc ? dateA - dateB : dateB - dateA;
        });
        setAllUserCharacters(sorted);
        setSortDateAsc(!sortDateAsc);
    }

    if (!allUserCharacters) {
        return (
            <p>Loading Characters...</p>
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