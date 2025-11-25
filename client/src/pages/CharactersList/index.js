import { useState, useEffect } from "react";

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
            <p>Characters List:</p>
            {
                allCharacters.map((character, index) => {
                    return (
                        <div key={index}>
                            <span>{character.name}</span>
                            <span>Written by:{character.author}</span>
                            <span>Creation Date:{character.createdAt}</span>
                        </div>
                    )
                })
            }
        </>
    )
}

export default CharactersList;