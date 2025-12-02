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

    //handleDeleteCampaign

    if (!foundCampaign) {
        return (
            <p>Loading Campaign...</p>
        )
    }

    return (
        <>
        </>
    )
}

export default ManageCampaign;