import { Link } from "react-router-dom";
import { CurrentUserContext } from "../../Context/CurrentUserContext.tsx";
import { useContext } from "react";
import styled from "styled-components";

const Home = () => {
    const context = useContext(CurrentUserContext);
    if (!context) {
        throw new Error ("CurrentUserContext is null");
    }
    const [ currentUser, setCurrentUser ] = context;

    const handleLogOut = () => {
        setCurrentUser(null);
    }
    return (
        <>
            <TextContainer>
                <p>Every campaign starts small and ends somewhere unbelievable. The journey between, with its chaos, triumphs, and ridiculous detours, is where the real story lives.</p>
                <p><span>Dungeon Notes Database</span> is your party’s journal, a place to capture characters, quests, and the moments too good to forget.</p>
                <p>Take a seat and write your tale.<br /> Your adventure begins here.</p>
            </TextContainer>
            <ButtonsContainer>
                <Link to={"/characters"}><button>Browse Characters</button></Link>
                <Link to={"/campaigns"}><button>Browse Campaigns</button></Link>
                <Link to={"/diceroller"}><button>Dice Roller</button></Link>
                {
                    !currentUser? <Link to={"/login"}><button>Log In</button></Link>
                    : <>
                        <Link to={"/manage"}><button>Manage Info</button></Link>
                        <button onClick={handleLogOut}>Log Out</button>
                    </>
                }
            </ButtonsContainer>
            <Footer>
                <p>Created by <a href="https://ebishiru.github.io/my-portfolio/">Kevin Lo</a></p>
            </Footer>
        </>
    )
}

export default Home;

const TextContainer = styled.div`
    p {
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
        font-size: 2rem;
        margin: 0.5rem;
        border: 0.15rem solid #2E2B2B;
        cursor: pointer;
    }
    button:active {
        transform: scale(0.9);
    }
`
const Footer = styled.div`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem;
    a {
        text-decoration: none;
        color: #6C3483;
    }
`