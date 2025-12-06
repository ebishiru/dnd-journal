import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

import styled from "styled-components";

const CreateNewCampaign = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const [ status, setStatus ] = useState("idle");
    const [ inputCampaignTitle, setInputCampaignTitle ] = useState("");
    const [ inputCampaignStory, setInputCampaignStory ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState(null);

    //ensure user is logged in
    useEffect(() => {
        if(!currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate])

    //ensure textarea grows with content
    const autoGrow = (element) => {
        element.style.height = "auto";
        element.style.height = element.scrollHeight + "px";
    }

    const handleCreateCampaign = async (ev) => {
        ev.preventDefault();
        setStatus("processing");
        setErrorMessage(null);
        const createCampaignData = {
            author: currentUser,
            title: inputCampaignTitle,
            story: inputCampaignStory
        }
        const body = JSON.stringify( createCampaignData );
        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/createCampaign`, options);
            const data = await response.json();
            if (data.status !== 201) {
                setStatus("idle");
                setErrorMessage(data.message);
                toast.error(data.message);
            } else {
                setStatus("idle");
                toast.success(data.message);
                navigate("/manage");
            }
        } catch (error) {
            setStatus("idle");
            toast.error(error.message);
        }
    }

    return (
        <>
            <FormSection onSubmit={handleCreateCampaign}>
                <p>“Pray, what title shall we bestow upon this grand tale?”</p>
                <div className="titleRow">
                    <label htmlFor="campaignTitle">Title:</label>
                    <input type="text" id="campaignTitle" value={inputCampaignTitle} onChange={(ev)=>{setInputCampaignTitle(ev.target.value)}}></input>
                </div>
                <div className="storySection">
                    <p>“Well then, adventurers… tell us how this tale unfolds.”</p>
                    <label htmlFor="campaignStory">-- Story --</label>
                    <textarea id="campaignStory" value={inputCampaignStory} onChange={(ev)=>{setInputCampaignStory(ev.target.value); autoGrow(ev.target);}}></textarea>
                </div>
                <div className="submitSection">
                    <button type="submit" disabled={status !== "idle"}>Create Campaign</button>
                    <p className="errorMessage">{errorMessage}</p>
                </div>
            </FormSection>
        </>
    )
}

export default CreateNewCampaign;

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
    .titleRow {
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
    button {
        background-color: #A68B6E;
        color: #1C1C1C;
        border: 0.15rem solid #2E2B2B;
    }
    button:enabled:active {
        transform: scale(0.9);
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