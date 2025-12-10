import { CurrentUserContext } from "../../Context/CurrentUserContext.tsx";
import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const ManageInfo = () => {
    const navigate = useNavigate();
    const context = useContext(CurrentUserContext);
    if (!context) return ("CurrentUserContext is null");
    const [ currentUser, setCurrentUser ] = context;

    //ensure user is logged in
    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate])

    return (
        <>
            <TextContainer>
                <p>“Welcome back, <span>{currentUser}</span>. The realm has not been the same in your absence."</p>
            </TextContainer>
            <ButtonsContainer>
                <Link to={"/manage/character/new"}><button>Create New Character</button></Link>
                <Link to={"/manage/characters"}><button>Manage Existing Character</button></Link>
                <Link to={"/manage/campaign/new"}><button>Create New Campaign</button></Link>
                <Link to={"/manage/campaigns"}><button>Manage Existing Campaign</button></Link>
            </ButtonsContainer>
        </>
    )
}

export default ManageInfo;

const TextContainer = styled.div`
    p {
        text-align: center;
        font-size: 1.25rem;
        margin: 1.5rem;
    }
    p span {
        font-weight: bold;
    }
`
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 3.5rem;
    button {
        background-color: #A68B6E;
        color: #1C1C1C;
        font-size: 1.5rem;
        margin: 0.5rem;
        border: 0.15rem solid #2E2B2B;
        cursor: pointer;
    }
    button:active {
        transform: scale(0.9);
    }
`