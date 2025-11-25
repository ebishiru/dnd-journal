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
    const [ inputCharacterQuotes, setInputCharacterQuotes ] = useState([""]);
    const [ errorMessage, setErrorMessage ] = useState(null);

    //ensure user is logged in
    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate])

    const handleAddQuoteInput = () => {
        if (inputCharacterQuotes.length >= 8) {
            setErrorMessage("Maximum quotes alloted.");
            return;
        }
        setInputCharacterQuotes([...inputCharacterQuotes, ""]);
    }

    const handleRemoveQuoteInput = () => {
        if (inputCharacterQuotes.length <= 1) {
            setErrorMessage("Cannot further reduce number of quotes.")
            return;
        }
        setInputCharacterQuotes(inputCharacterQuotes.slice(0,-1));
    }

    const handleInputCharacterQuoteChange = (index, newValue) => {
        const updatedQuotes = [...inputCharacterQuotes];
        updatedQuotes[index] = newValue;
        setInputCharacterQuotes(updatedQuotes);
    }

    const handleCreateCharacter = async (ev) => {
        ev.preventDefault();
        setStatus("processing");
        setErrorMessage(null);
        const createCharacterData = {
            author: currentUser,
            name: inputCharacterName,
            story: inputCharacterStory,
            quotes: inputCharacterQuotes
        }
        const body = JSON.stringify( createCharacterData );
        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body
        }
        try {
            const response = await fetch("/createCharacter", options);
            const data = await response.json();
            if (data.status !== 201) {
                setStatus("idle");
                setErrorMessage(data.message);
            } else {
                setStatus("idle");
                console.log(data.message);
            }
        } catch (error) {
            setStatus("idle");
            setErrorMessage(error.message);
        }
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
                    inputCharacterQuotes.map((inputCharacterQuote, index) => {
                        return (
                            <div key={index}>
                            <label htmlFor={`inputCharacterQuote${index + 1}`}>Quote {index+1}:</label>
                            <input type="text" id={`inputCharacterQuote${index + 1}`} value={inputCharacterQuote} onChange={(ev) => handleInputCharacterQuoteChange(index, ev.target.value)} />
                            </div>
                        )
                        
                    })
                }
                <button type="button" onClick={handleAddQuoteInput}>Add more quotes</button>
                <button type="button" onClick={handleRemoveQuoteInput}>Remove last quote</button>
                <button type="submit">Create Character</button>
                <p>{errorMessage}</p>
            </form>
        </>
    )
}

export default CreateNewCharacter;