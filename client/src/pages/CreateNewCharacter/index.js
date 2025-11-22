import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

import styled from "styled-components";

const CreateNewCharacter = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const [ status, setStatus ] = useState("idle");
    const [ inputCharacterName, setInputCharacterName ] = useState("");
    const [ inputCharacterStory, setInputCharacterStory ] = useState("");
    const [ inputCharacterQuotes, setInputCharacterQuotes ] = useState([]);

    const handleAddQuoteInput = () => {
        setInputCharacterQuotes([...inputCharacterQuotes, ""]);
    }

    const handleInputCharacterQuoteChange = (index, newValue) => {
        const updatedQuotes = [...inputCharacterQuotes];
        updatedQuotes[index] = newValue;
        setInputCharacterQuotes(updatedQuotes);
    }

    const handleCreateCharacter = async (ev) => {
        ev.preventDefault();
    }

    return (
        <>
            <h2>Create a new Character:</h2>
            <form onSubmit={handleCreateCharacter}>
                <label htmlFor="characterName">Character Name:</label>
                <input type="text" id="characterName" value={inputCharacterName} onChange={(ev)=>{setInputCharacterName(ev.target.value)}}></input>
                <label htmlFor="characterStory">Story:</label>
                <textarea id="characterStory" value={inputCharacterStory} onChange={(ev)=>{setInputCharacterStory(ev.target.value)}}></textarea>
                {
                    inputCharacterQuotes.map((inputCharacterQuotes, i) => {
                        <div key={i}>
                            <label>Quote {i+1}:</label>
                            <input type="text" value={inputCharacterQuotes.value} onChange={(ev) => handleInputCharacterQuoteChange(i, ev.target.value)} />
                        </div>
                    })
                }
                <button type="button" onClick={handleAddQuoteInput}>Add more quotes</button>
                <button type="submit">Create Character</button>
                <p>{errorMessage}</p>
            </form>
        </>
    )
}

export default CreateNewCharacter;