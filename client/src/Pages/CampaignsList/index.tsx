import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

type Campaign = {
    _id: string,
    title: string,
    author: string,
    createdAt: string,
}

const CampaignsList = () => {
    const [ allCampaigns, setAllCampaigns ] = useState<Campaign[] | null>(null);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const [ sortTitleAsc, setSortTitleAsc ] = useState(true);
    const [ sortAuthorAsc, setSortAuthorAsc ] = useState(true);
    const [ sortDateAsc, setSortDateAsc ] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaigns`);
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    setAllCampaigns(data.data);
                }
            } catch (error: any) {
                setErrorMessage(error.message);
            }
        }
        fetchCampaigns();
    },[])

    //Sorting handlers
    const handleSortByTitle = () => {
        if (!allCampaigns) return;
        const sorted = [...allCampaigns].sort((a, b) => {
            return sortTitleAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        });
        setAllCampaigns(sorted);
        setSortTitleAsc(!sortTitleAsc);
    }

    const handleSortByAuthor = () => {
        if (!allCampaigns) return;
        const sorted = [...allCampaigns].sort((a, b) => {
            return sortAuthorAsc ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author);
        });
        setAllCampaigns(sorted);
        setSortAuthorAsc(!sortAuthorAsc);
    }

    const parseDDMMYYYY = (dateString: string) => {
        const [ day, month, year] =dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    }

    const handleSortByDate = () => {
        if (!allCampaigns) return;
        const sorted = [...allCampaigns].sort((a, b) => {
            const dateA = parseDDMMYYYY(a.createdAt).getTime();
            const dateB = parseDDMMYYYY(b.createdAt).getTime();
            return sortDateAsc ? dateA - dateB : dateB - dateA;
        });
        setAllCampaigns(sorted);
        setSortDateAsc(!sortDateAsc);
    }

    if (!allCampaigns) {
        return (
            <LoadingContainer>
                <img src="/fire.gif" />
                <p>Loading...</p>
            </LoadingContainer>
        )
    }

    return (
        <>
            <HeaderRow>
                <span>Title<button onClick={handleSortByTitle}>{sortTitleAsc ? "▲" : "▼"}</button></span>
                <span>Author<button onClick={handleSortByAuthor}>{sortAuthorAsc ? "▲" : "▼"}</button></span>
                <span>Created<button onClick={handleSortByDate}>{sortDateAsc ? "▼" : "▲"}</button></span>
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
const HeaderRow = styled.div`
    display: grid;
    grid-template-columns: 5fr 2fr 2fr;
    gap: 1rem;
    padding: 0.5rem;
    border: 0.1rem solid #2E2B2B;
    font-weight: bold;
    background-color: #A68B6E;
    button {
        background-color: #2E2B2B;
        color: #D4AF37;
        width: 1rem;
        height: 1rem;
        padding: 0;
        margin-left: 0.25rem;
    }
`
const CampaignRow = styled.div`
    display: grid;
    grid-template-columns: 5fr 2fr 2fr;
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