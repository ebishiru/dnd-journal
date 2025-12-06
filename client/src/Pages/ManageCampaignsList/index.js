import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

import styled from "styled-components";

const ManageCampaignsList = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const [ allUserCampaigns, setAllUserCampaigns ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);

    const [ sortTitleAsc, setSortTitleAsc ] = useState(true);
    const [ sortDateAsc, setSortDateAsc ] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }

        const fetchCampaigns = async (ev) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/campaigns`);
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

    //Sorting handlers
    const handleSortByTitle = () => {
        const sorted = [...allUserCampaigns].sort((a, b) => {
            return sortTitleAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        });
        setAllUserCampaigns(sorted);
        setSortTitleAsc(!sortTitleAsc);
    }

    const parseDDMMYYYY = (dateString) => {
        const [ day, month, year] =dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    }

    const handleSortByDate = () => {
        const sorted = [...allUserCampaigns].sort((a, b) => {
            const dateA = parseDDMMYYYY(a.createdAt);
            const dateB = parseDDMMYYYY(b.createdAt);
            return sortDateAsc ? dateA - dateB : dateB - dateA;
        });
        setAllUserCampaigns(sorted);
        setSortDateAsc(!sortDateAsc);
    }

    if(!allUserCampaigns) {
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
                <span>Created<button onClick={handleSortByDate}>{sortDateAsc ? "▼" : "▲"}</button></span>
            </HeaderRow>
            {
                allUserCampaigns.map((campaign) => {
                    return (
                        <CharacterRow key={campaign._id}>
                            <span><Link to={`/manage/campaign/${campaign._id}`}  className="titleLink">{campaign.title}</Link></span>
                            <p>{campaign.createdAt}</p>
                        </CharacterRow>
                    )
                })
            }
        </>
    )
}

export default ManageCampaignsList;

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
    grid-template-columns: 7fr 2fr;
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

const CharacterRow = styled.div`
    display: grid;
    grid-template-columns: 7fr 2fr;
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