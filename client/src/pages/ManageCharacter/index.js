import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

const ManageCharacter = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const { _id } = useParams();
    const [ foundCharacter, setFoundCharacter ] = useState(false);

    const [ status, setStatus ] = useState("idle");
    const [ inputCharacterName, setInputCharacterName ] = useState("");
    const [ inputCharacterStory, setInputCharacterStory ] = useState("");
    const [ inputCharacterQuotes, setInputCharacterQuotes ] = useState([""]);
    const [ errorMessage, setErrorMessage ] = useState(null);

    //Ensure user is logged in.
    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }

        const fetchCharacter = async () => {
            try {
                const response = await fetch(`/character/${_id}`);
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    setInputCharacterName(data.data.name);
                    setInputCharacterStory(data.data.story);
                    setInputCharacterQuotes(data.data.quotes);
                    setFoundCharacter(true);
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        }

        fetchCharacter();

    }, [currentUser, _id, navigate])

    //Quote Add Button
    const handleAddQuoteInput = () => {
        if (inputCharacterQuotes.length >= 8) {
            setErrorMessage("Maximum quotes alloted.");
            return;
        }
        setInputCharacterQuotes([...inputCharacterQuotes, ""]);
        setErrorMessage(null);
    }

    //Quote Remove button
    const handleRemoveQuoteInput = () => {
        if (inputCharacterQuotes.length <= 1) {
            setErrorMessage("Cannot further reduce number of quotes.")
            return;
        }
        setInputCharacterQuotes(inputCharacterQuotes.slice(0,-1));
        setErrorMessage(null);
    }

    //Ensure all quote inputs are in one array
    const handleInputCharacterQuoteChange = (index, newValue) => {
        const updatedQuotes = [...inputCharacterQuotes];
        updatedQuotes[index] = newValue;
        setInputCharacterQuotes(updatedQuotes);
    }

    //Confirm edit character
    const handleEditCharacter = async (ev) => {
        ev.preventDefault();
        setStatus("processing");
        setErrorMessage(null);
        const editCharacterData = {
            _id,
            name: inputCharacterName,
            story: inputCharacterStory,
            quotes: inputCharacterQuotes
        }
        const body = JSON.stringify( editCharacterData );
        const options = {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body
        }
        try {
            const response = await fetch("/editCharacter", options);
            const data = await response.json();
            if (data.status !== 202) {
                setStatus("idle");
                setErrorMessage(data.message);
            } else {
                setStatus("idle");
                console.log("Character successfully editted.");
            }
        } catch (error) {
            setStatus("idle");
            setErrorMessage(error.message);
        }
    }

    if (!foundCharacter) {
        return (
            <p>Loading Character...</p>
        )
    }

    return (
        <>
            <p>Edit Character Info:</p>
            <form onSubmit={handleEditCharacter}>
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
                <button type="submit">Save changes</button>
                <p>{errorMessage}</p>
            </form>
        </>
    )
}

export default ManageCharacter;