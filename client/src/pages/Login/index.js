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
                <FormSection onSubmit={handleLogIn} autoComplete="on">
                    <h2>Already have an account? Log in here!</h2>
                    <div className="formRow">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" value={inputUsername} onChange={(ev)=>{setInputUsername(ev.target.value)}}></input>
                    </div>
                    <div className="formRow">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={inputPassword} onChange={(ev)=>{setInputPassword(ev.target.value)}}></input>
                    </div>
                    <div className="buttonRow">
                        <button type="submit" disabled={!inputUsername || !inputPassword || status === "logging"}>Sign In</button>
                    </div>
                    <p className="errorMessage">{errorMessage || ""}</p>
                </FormSection>
            </LogInContainer>
            <SignUpContainer>
                <FormSection onSubmit={handleSignUp}>
                    <h2>Don't have an account? Sign up now!</h2>
                    <div className="formRow">
                        <label htmlFor="signUsername">Username:</label>
                        <input type="text" id="signUsername" value={inputSignUsername} onChange={(ev)=>{setInputSignUsername(ev.target.value)}}></input>
                    </div>
                    <div className="formRow">
                        <label htmlFor="signPassword">Password:</label>
                    <input type="password" id="signPassword" value={inputSignPassword} onChange={(ev)=>{setInputSignPassword(ev.target.value)}}></input>
                    </div>
                    <div className="formRow">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input type="password" id="confirmPassword" value={inputConfirmPassword} onChange={(ev)=>{setInputConfirmPassword(ev.target.value)}}></input>
                    </div>
                    <div className="buttonRow">
                        <button type="submit" disabled={!inputSignUsername || !inputSignPassword || !inputConfirmPassword || status === "logging"}>Sign Up</button>
                    </div>
                    <p>{errorSignMessage || ""}</p>
                </FormSection>
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
`
const LogInContainer = styled.div`
    color: #1C1C1C;
    display: block;
    margin: 2rem 0 ;
    padding: 1rem;
    border: 0.15rem solid #2E2B2B;
    min-width: 320px;
`
const SignUpContainer = styled.div`
    color: #1C1C1C;
    display: block;
    margin: 2rem 0 ;
    padding: 1rem;
    border: 0.15rem solid #2E2B2B;
    min-width: 320px;
`
const FormSection = styled.form`
    h2 {
        font-size: 1.25rem;
        font-weight: bold;
        padding: 0.5rem 0;
    }
    .formRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
    }
    .formRow label {
        margin-right: 0.5rem;
    }
    input {
        border: 0.1rem solid #2E2B2B;
        border-radius: 5px;
        padding: 0 0.25rem;
    }
    .buttonRow {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
    }
    button {
        /* background-color: #A68B6E;
        color: #FAF3E0; */
    }
    .errorMessage {
        color: #C0392B;
    }
`