import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

import styled from "styled-components";

const ManageCampaign = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const { _id } = useParams();
    const [ foundCampaign, setFoundCampaign ] = useState(false);

    const [ status, setStatus ] = useState("idle");
    const [ inputCampaignTitle, setInputCampaignTitle ] = useState("");
    const [ inputCampaignStory, setInputCampaignStory ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState(null);

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteErrorMessage, setDeleteErrorMessage ] = useState(null);

    //Ensure user is logged in
    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }

        const fetchCampaign = async () => {
            try {
                const response = await fetch(`/campaign/${_id}`);
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    setInputCampaignTitle(data.data.title);
                    setInputCampaignStory(data.data.story);
                    setFoundCampaign(true);
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        }

        fetchCampaign();
    }, [currentUser, _id, navigate])

    //ensure textarea grows with content
    const autoGrow = (element) => {
        element.style.height = "auto";
        element.style.height = element.scrollHeight + "px";
    }

    //Confirm Edit campaign
    const handleEditCampaign = async (ev) => {
        ev.preventDefault();
        setStatus("processing");
        setErrorMessage(null);
        const editCampaignData = {
            _id,
            title: inputCampaignTitle,
            story: inputCampaignStory
        }
        const body = JSON.stringify( editCampaignData );
        const options = {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body
        }
        try {
            const response = await fetch("/editCampaign", options);
            const data = await response.json();
            if (data.status !== 202) {
                setStatus("idle");
                setErrorMessage(data.message);
            } else {
                setStatus("idle");
                console.log("Campaign successfully editted.");
                navigate("/manage");
            }
        } catch (error) {
            setStatus("idle");
            setErrorMessage(error.message);
        }
    }

    //Delete Campaign handler
    const handleDeleteCampaign = async (ev) => {
        ev.preventDefault();
        setStatus("processing");
        setDeleteErrorMessage(null);
        const campaignInfo = { _id };
        const body = JSON.stringify( campaignInfo );
        const options = {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body
        }
        try {
            const response = await fetch("/campaign", options);
            const data = await response.json();
            if (data.status !== 200) {
                setDeleteErrorMessage(data.message);
                setStatus("idle");
            } else {
                console.log("Campaign successfully deleted.");
                setStatus("idle");
                navigate("/manage");
            }
        } catch (error) {
            setStatus("idle");
            setDeleteErrorMessage(error.message);
        }
    }

    if (!foundCampaign) {
        return (
            <p>Loading Campaign...</p>
        )
    }

    return (
        <>
            <FormSection onSubmit={handleEditCampaign}>
                <p>"The chronicles await your touch. What new title shall this campaign bear?"</p>
                <div className="titleRow">
                    <label htmlFor="titleName">Title:</label>
                    <input type="text" id="titleName" value={inputCampaignTitle} onChange={(ev)=>{setInputCampaignTitle(ev.target.value)}}></input>
                </div>
                <div className="storySection">
                    <p>"Speak your edits, hero, and I shall reshape the narrative accordingly."</p>
                    <label htmlFor="campaignStory">-- Story --</label>
                    <textarea id="campaignStory" value={inputCampaignStory} onChange={(ev)=>{setInputCampaignStory(ev.target.value); autoGrow(ev.target)}}></textarea>
                </div>
                <div className="submitSection">
                    <button type="submit" disabled={status !== "idle"}>Save changes</button>
                    <p className="errorMessage">{errorMessage}</p>
                </div>
                <div className="deleteSection">
                    <p>"Very well, hero… do you truly wish to let this campaign fade into oblivion?"</p>
                    <div className="checkboxRow">
                        <input type="checkbox" id="deleteCheckbox" checked={deleteConfirm} onChange={(ev) => setDeleteConfirm(ev.target.checked)}/>
                        <label htmlFor="deleteCheckbox">I understand that this action cannot be undone.</label>
                    </div>
                    <button type="button" onClick={handleDeleteCampaign} disabled={!deleteConfirm || status !== "idle"}>Delete Campaign</button>
                    <p className="errorMessage">{deleteErrorMessage}</p>
                </div>
            </FormSection>
        </>
    )
}

export default ManageCampaign;


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