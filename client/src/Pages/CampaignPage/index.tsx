import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

type Campaign = {
    title: string,
    author: string,
    createdAt: string,
    lastEdit: string,
    story: string,
}

const CampaignPage = () => {
    const { _id } = useParams<string>();
    const [ campaign, setCampaign ] = useState<Campaign | null>(null);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaign/${_id}`);
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    setCampaign(data.data);
                }
            } catch (error: any) {
                setErrorMessage(error.message);
            }
        }

        fetchCampaign();
    },[_id])

    if (!campaign) {
        if (errorMessage) {
            return (
                <p>{errorMessage}</p>
            )
        } else {
            return (
                <LoadingContainer>
                    <img src="/fire.gif" />
                    <p>Loading...</p>
                </LoadingContainer>
            )
        }
    }

    return (
        <>
            <CampaignTitle>{campaign.title}</CampaignTitle>
            <DataContainer>
                <p>As told by: <span>{campaign.author}</span></p>
                <p>Created on: <span>{campaign.createdAt}</span></p>
                <p>Last edit: <span>{campaign.lastEdit}</span></p>
            </DataContainer>
            <StoryContainer>
                <p>{campaign.story}</p>
            </StoryContainer>
        </>
    )
}

export default CampaignPage;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
    gap: 1rem;
    p {
        font-weight: bold;
    }
`
const CampaignTitle = styled.p`
    font-size: 2rem;
    font-weight: bold;
    text-decoration: underline;
    text-align: center;
    color: #1C1C1C;
    margin: 1rem 0;
`
const DataContainer = styled.div`
    font-size: 1.2rem;
    margin: 0.5rem;
    padding: 0.5rem;
    border: 0.15rem dashed #A68B6E;
    color: #1C1C1C;
    span {
        color: #6C3483;
    }
`
const StoryContainer = styled.div`
    line-height: 1.5;
    margin: 0.5rem;
    padding: 0.5rem;
    border: 0.15rem dashed #A68B6E;
    color: #1C1C1C;
    p {
        white-space: pre-wrap;
    }
`