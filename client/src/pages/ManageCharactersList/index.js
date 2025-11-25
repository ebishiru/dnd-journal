import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    },[])

    if (!allUserCharacters) {
        return (
            <p>Loading Characters...</p>
        )
    }

    return (
        <>
            <p>Manage characters list.</p>
            {
                allUserCharacters.map((character, index) => {
                    return (
                        <div key={index}>
                            <span>{character.name}</span>
                            <span>{character.createdAt}</span>
                        </div>
                    )
                    
                })
            }
        </>
    )
}

export default ManageCharactersList;