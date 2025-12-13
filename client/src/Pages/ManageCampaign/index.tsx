import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import styled from "styled-components";

type Params = {
    _id: string,
}

const ManageCampaign = () => {
    const navigate = useNavigate();
    const context = useContext(CurrentUserContext);
    if (!context) {
        throw new Error("CurrentUserContext is null");
    }
    const [ currentUser, setCurrentUser ] = context;
    const { _id } = useParams<Params>();
    const [ foundCampaign, setFoundCampaign ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<"idle" | "processing">("idle");
    const [ inputCampaignTitle, setInputCampaignTitle ] = useState<string>("");
    const [ inputCampaignStory, setInputCampaignStory ] = useState<string>("");
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const [ deleteConfirm, setDeleteConfirm ] = useState<boolean>(false);
    const [ deleteErrorMessage, setDeleteErrorMessage ] = useState<string | null>(null);

    //Ensure user is logged in
    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }

        const fetchCampaign = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaign/${_id}`);
                const data = await response.json();
                if (data.status !== 200) {
                    toast.error(data.message);
                } else {
                    //check user is author
                    if (data.data.author !== currentUser) {
                        navigate("/");
                        return;
                    }
                    setInputCampaignTitle(data.data.title);
                    setInputCampaignStory(data.data.story);
                    setFoundCampaign(true);
                }
            } catch (error: any) {
                setErrorMessage(error.message);
            }
        }

        fetchCampaign();

    }, [currentUser, _id, navigate])

    //ensure textarea grows with content
    const autoGrow = (element: HTMLTextAreaElement) => {
        element.style.height = "auto";
        element.style.height = element.scrollHeight + "px";
    }

    //Confirm Edit campaign
    const handleEditCampaign = async (ev:React.FormEvent<HTMLFormElement>) => {
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/editCampaign`, options);
            const data = await response.json();
            if (data.status !== 202) {
                setStatus("idle");
                setErrorMessage(data.message);
                toast.error(data.message);
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

    //Delete Campaign handler
    const handleDeleteCampaign = async (ev:React.MouseEvent<HTMLButtonElement>) => {
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaign`, options);
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
        } catch (error:any) {
            setStatus("idle");
            toast.error(error.message);
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