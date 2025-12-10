import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CurrentUserContext } from "../../Context/CurrentUserContext.tsx";
import styled from "styled-components";

type Params = {
    _id: string,
}

const ManageCharacter = () => {
    const navigate = useNavigate();
    const context = useContext(CurrentUserContext);
    if (!context) {
        throw new Error("CurrentUserContext is null");
    }
    const [ currentUser, setCurrentUser ] = context;
    const { _id } = useParams<Params>();
    const [ foundCharacter, setFoundCharacter ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<"idle" | "processing">("idle");
    const [ inputCharacterName, setInputCharacterName ] = useState<string>("");
    const [ inputCharacterStory, setInputCharacterStory ] = useState<string>("");
    const [ inputCharacterQuotes, setInputCharacterQuotes ] = useState<string[]>([""]);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const [ deleteConfirm, setDeleteConfirm ] = useState<boolean>(false);
    const [ deleteErrorMessage, setDeleteErrorMessage ] = useState<string | null>(null);

    //Ensure user is logged in.
    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }

        const fetchCharacter = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/character/${_id}`);
                const data = await response.json();
                if (data.status !== 200) {
                    toast.error(data.message);
                } else {
                    //check user is author
                    if (data.data.author !== currentUser) {
                        navigate("/");
                        return;
                    }
                    setInputCharacterName(data.data.name);
                    setInputCharacterStory(data.data.story);
                    setInputCharacterQuotes(data.data.quotes);
                    setFoundCharacter(true);
                }
            } catch (error: any) {
                toast.error(error.message);
            }
        }

        fetchCharacter();

    }, [currentUser, _id, navigate])

    //ensure textarea grows with content
    const autoGrow = (element: HTMLTextAreaElement) => {
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
    const handleInputCharacterQuoteChange = (index: number, newValue: string) => {
        const updatedQuotes = [...inputCharacterQuotes];
        updatedQuotes[index] = newValue;
        setInputCharacterQuotes(updatedQuotes);
    }

    //Confirm edit character
    const handleEditCharacter = async (ev: React.FormEvent<HTMLFormElement>) => {
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/editCharacter`, options);
            const data = await response.json();
            if (data.status !== 202) {
                setStatus("idle");
                setErrorMessage(data.message);
                toast.error(data.message);
            } else {
                setStatus("idle");
                toast.success(data.message);
                navigate("/manage")
            }
        } catch (error: any) {
            setStatus("idle");
            toast.error(error.message);
        }
    }

    //Confirm delete character
    const handleDeleteCharacter = async (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        setStatus("processing");
        setDeleteErrorMessage(null);
        const characterInfo = {
            _id
        }
        const body = JSON.stringify( characterInfo );
        const options = {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/character`, options);
            const data = await response.json();
            if (data.status !== 200) {
                setDeleteErrorMessage(data.message);
                toast.error(data.message);
                setStatus("idle");
            } else {
                setStatus("idle");
                toast.success(data.message);
                navigate("/manage");
            }
        } catch (error: any) {
            setStatus("idle");
            toast.error(error.message);
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
                <div className="deleteSection">
                    <p>“Do you intend to strike this name from the annals forever?”</p>
                    <div className="checkboxRow">
                        <input type="checkbox" id="deleteCheckbox" checked={deleteConfirm} onChange={(ev) => setDeleteConfirm(ev.target.checked)}/>
                        <label htmlFor="deleteCheckbox">I understand that this action cannot be undone.</label>
                    </div>
                    <button type="button" onClick={handleDeleteCharacter} disabled={!deleteConfirm || status !== "idle"}>Delete Character</button>
                    <p className="errorMessage">{deleteErrorMessage}</p>
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
        justify-content: center;
        align-items: center;
        gap: 1rem;
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
    button:enabled:active {
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
    .deleteSection {
        border-top: 0.2rem dashed #A68B6E;
        margin: 1.5rem 0;
        p {
            margin: 1.5rem 0 0.5rem;
        }
        .checkboxRow {
            margin: 0.5rem;
        }
        button {
            background-color: #C0392B;
            color: #FAF3E0;
            font-size: 1.5rem;
            margin: 0.5rem;
            opacity: 25%
        }
        button:enabled {
            opacity: 100%;
            cursor: pointer;
        }
        .errorMessage {
            color: #C0392B;
        }
    }
`