import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

import styled from "styled-components";

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

    //ensure textarea grows with content
    const autoGrow = (element) => {
        element.style.height = "auto";
        element.style.height = element.scrollHeight + "px";
    }

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
                navigate("/manage")
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
            <FormSection onSubmit={handleEditCharacter}>
                <p>“Is the name they carry no longer the name they deserve?”</p>
                <div className="nameRow">
                    <label htmlFor="characterName">Name:</label>
                    <input type="text" id="characterName" value={inputCharacterName} onChange={(ev)=>{setInputCharacterName(ev.target.value)}}></input>
                </div>
                <div className="storySection">
                    <p>“The parchment lies open. What parts of your story need rewriting?”</p>
                    <label htmlFor="characterStory">-- Back story --</label>
                    <textarea id="characterStory" value={inputCharacterStory} onChange={(ev)=>{setInputCharacterStory(ev.target.value); autoGrow(ev.target);}}></textarea>
                </div>
                <p>“Etched upon their tale are the words they’re known to speak…”</p>
                <div>
                    {
                        inputCharacterQuotes.map((inputCharacterQuote, index) => {
                            return (
                                <div key={index} className="quoteRow">
                                <label htmlFor={`inputCharacterQuote${index + 1}`}>{index+1}.</label>
                                <input type="text" id={`inputCharacterQuote${index + 1}`} value={inputCharacterQuote} onChange={(ev) => handleInputCharacterQuoteChange(index, ev.target.value)} />
                                </div>
                            )
                        })
                    }
                </div>
                <div className="buttonSection">
                    <button type="button" onClick={handleAddQuoteInput} disabled={inputCharacterQuotes.length >= 8}>Add more quotes</button>
                    <button type="button" onClick={handleRemoveQuoteInput} disabled={inputCharacterQuotes.length <= 1}>Remove last quote</button>
                </div>
                <div className="submitSection">
                    <button type="submit" disabled={status !== "idle"}>Save changes</button>
                    <p className="errorMessage">{errorMessage}</p>
                </div>
            </FormSection>
        </>
    )
}

export default ManageCharacter;


const FormSection = styled.form`
    font-size: 1rem;
    text-align: center;
    label {
        font-weight: bold;
    }
    input {
        font-size: 1rem;
        border: 0.1rem solid #2E2B2B;
        padding: 0 0.25rem;
    }
    .nameRow {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin: 0.5rem;
    }
    .storySection {
        margin: 0.5rem;
        label {
            display: block;
            margin: 0.5rem 0 0;
        }
        textarea {
            font-size: 0.9rem;
            width: 100%;
            min-height: 5rem;
            border: 0.1rem solid #2E2B2B;
            margin: 0.5rem 0;
            resize: none;
            box-sizing: border-box;
        }
    }
    .quoteRow {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90%;
        margin: 0.5rem auto;
        gap: 0.5rem;
        box-sizing: border-box;
        label {
            flex: 0 0 auto;
            font-size: 1.25rem;
            margin: 0;
        }
        input {
            flex: 1;
            box-sizing: border-box;
        }
    }
    button {
        background-color: #A68B6E;
        color: #1C1C1C;
        border: 0.15rem solid #2E2B2B;
    }
    button:active {
        transform: scale(0.9);
    }
    .buttonSection {
        button {
            font-size: 1rem;
            margin: 0 0.5rem;
            opacity: 25%;
        }
        button:enabled {
            opacity: 100%;
            cursor: pointer;
        }
    }
    .submitSection {
        button {
            font-size: 1.5rem;
            margin: 1rem;
        }
        button:disabled {
            opacity: 25%;
        }
        .errorMessage {
            color: #C0392B;
        }
    }
`