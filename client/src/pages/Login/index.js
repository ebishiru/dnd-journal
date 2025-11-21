import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";

import styled from "styled-components";

const Login = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const [ status, setStatus ] = useState("idle");
    const [ inputUsername, setInputUsername ] = useState("");
    const [ inputPassword, setInputPassword ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState(null);

    const [ inputSignUsername, setInputSignUsername ] = useState("");
    const [ inputSignPassword, setInputSignPassword ] = useState("");
    const [ inputConfirmPassword, setInputConfirmPassword ] = useState("");
    const [ errorSignMessage, setErrorSignMessage ] = useState(null);

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate])

    const handleLogIn = async (ev) => {
        ev.preventDefault();
        setStatus("logging");
        setErrorMessage(null);
        const logInData = {
            username: inputUsername,
            password: inputPassword
        }
        const body = JSON.stringify( logInData );
        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body
        }
        try {
            const response = await fetch("/login", options);
            const data = await response.json();
            if (data.status !=200) {
                setStatus("idle");
                setErrorMessage(data.message);
            } else {
                setStatus("idle");
                setCurrentUser(data.data)
                setInputUsername("");
                setInputPassword("");
                console.log(data.message);
            }
        } catch (error) {
            setStatus("idle");
            setErrorMessage(error.message);
        }
    }

    const handleSignUp = async (ev) => {
        ev.preventDefault();
        setErrorSignMessage(null);
        //Verify password and confirm password matches on FE.
        if (inputSignPassword !== inputConfirmPassword) {
            setErrorSignMessage("Passwords don't match. Please try again")
            setInputSignPassword("");
            setInputConfirmPassword("");
            return;
        }
        
        setStatus("logging");
        const signUpData = {
            username: inputSignUsername,
            password: inputSignPassword
        }
        const body = JSON.stringify( signUpData );
        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body
        }
        try {
            const response = await fetch("/signup", options);
            const data = await response.json();
            if (data.status !=200) {
                setStatus("idle");
                setErrorSignMessage(data.message);
            } else {
                setStatus("idle");
                setInputSignUsername("");
                setInputPassword("");
                setInputConfirmPassword("");
                console.log(data.message);
            }
        } catch (error) {
            setStatus("idle");
            setErrorSignMessage(error.message);
        }
    }

    return (
        <PageLayout>
            <LogInContainer>
                <form onSubmit={handleLogIn} autoComplete="on">
                    <h2>Already have an account? Log in here!</h2>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={inputUsername} onChange={(ev)=>{setInputUsername(ev.target.value)}}></input>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={inputPassword} onChange={(ev)=>{setInputPassword(ev.target.value)}}></input>
                    <button type="submit" disabled={!inputUsername || !inputPassword || status === "logging"}>Sign In</button>
                    <p>{errorMessage || ""}</p>
                </form>
            </LogInContainer>
            <SignUpContainer>
                <form onSubmit={handleSignUp}>
                    <h2>Don't have an account? Sign up now!</h2>
                    <label htmlFor="signUsername">Username:</label>
                    <input type="text" id="signUsername" value={inputSignUsername} onChange={(ev)=>{setInputSignUsername(ev.target.value)}}></input>
                    <label htmlFor="signPassword">Password:</label>
                    <input type="password" id="signPassword" value={inputSignPassword} onChange={(ev)=>{setInputSignPassword(ev.target.value)}}></input>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" value={inputConfirmPassword} onChange={(ev)=>{setInputConfirmPassword(ev.target.value)}}></input>
                    <button type="submit" disabled={!inputSignUsername || !inputSignPassword || !inputConfirmPassword || status === "logging"}>Sign Up</button>
                    <p>{errorSignMessage || ""}</p>
                </form>
            </SignUpContainer>
        </PageLayout>
    )
}

export default Login;

const PageLayout = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: beige;
`
const LogInContainer = styled.div`
    display: block;
    margin: 2rem 0 ;
    padding: 0.5rem;
    border: 1px solid black;
    
`

const SignUpContainer = styled.div`
    display: block;
    margin: 2rem 0 ;
    padding: 0.5rem;
    border: 1px solid black;
`