import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";

const CampaignsList = () => {
    const [ allCampaigns, setAllCampaigns ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);

    useEffect(() => {
        const fetchCampaigns = async (ev) => {
            try {
                const response = await fetch("/campaigns");
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    setAllCampaigns(data.data);
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        }

        fetchCampaigns();
    },[])

    if (!allCampaigns) {
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
                allCampaigns.map((campaign) => {
                    return (
                        <CampaignRow>
                            <span><Link to={`/campaign/${campaign._id}`} key={campaign._id} className="titleLink">{campaign.title}</Link></span>
                            <p>{campaign.author}</p>
                            <p>{campaign.createdAt}</p>
                        </CampaignRow>
                    )
                })
            }
        </>
    )
}

export default CampaignsList;

const HeaderRow = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    gap: 1rem;
    padding: 0.5rem;
    border: 0.1rem solid #2E2B2B;
    font-weight: bold;
    background-color: #A68B6E;
`

const CampaignRow = styled.div`
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