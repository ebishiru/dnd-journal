import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

import styled from "styled-components";

const ManageCampaignsList = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const [ allUserCampaigns, setAllUserCampaigns ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }

        const fetchCampaigns = async (ev) => {
            try {
                const response = await fetch("/campaigns");
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    //only keep campaigns made by user
                    const userCampaigns = data.data.filter((campaign) => {
                        return campaign.author === currentUser
                    });
                    setAllUserCampaigns(userCampaigns);
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        }

        fetchCampaigns();
    },[currentUser])

    if(!allUserCampaigns) {
        return (
            <p>Loading Campaigns...</p>
        )
    }

    return (
        <>
            <HeaderRow>
                <span>Title</span>
                <span>Author</span>
                <span>Created</span>
            </HeaderRow>
            {
                allUserCampaigns.map((campaign) => {
                    return (
                        <CharacterRow key={campaign._id}>
                            <span><Link to={`/manage/campaign/${campaign._id}`}  className="titleLink">{campaign.title}</Link></span>
                            <p>{campaign.author}</p>
                            <p>{campaign.createdAt}</p>
                        </CharacterRow>
                    )
                })
            }
        </>
    )
}

export default ManageCampaignsList;

const HeaderRow = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    gap: 1rem;
    padding: 0.5rem;
    border: 0.1rem solid #2E2B2B;
    font-weight: bold;
    background-color: #A68B6E;
`

const CharacterRow = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    gap: 1rem;
    padding: 0.5rem;
    border-bottom: 0.1rem dashed #2E2B2B;
    &:hover {
        background-color: #A68B6E;
    }
    span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    }
    .titleLink {
        color: #6C3483;
        font-weight: bold;
    }
`