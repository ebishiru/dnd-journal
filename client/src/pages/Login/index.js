import { useContext, useState, useEffect } from "react";

const Login = () => {
    const [ status, setStatus ] = useState("idle");
    const [ inputUsername, setInputUsername ] = useState("");
    const [ inputPassword, setInputPassword ] = useState("");
    const [ errorMessage, setErrorMessage ] = useState(null);

    const [ inputSignUsername, setInputSignUsername ] = useState("");
    const [ inputSignPassword, setInputSignPassword ] = useState("");
    const [ inputConfirmPassword, setInputConfirmPassword ] = useState("");
    const [ errorSignMessage, setErrorSignMessage ] = useState(null);

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
        //try fetch & catch
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
        //try fetch & catch
    }

    return (
        <>
            <div>
                <form onSubmit={handleLogIn} autoComplete="on">
                    <h2>Already have an account? Log in here!</h2>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={inputUsername} onChange={(ev)=>{setInputUsername(ev.target.value)}}></input>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={inputPassword} onChange={(ev)=>{setInputPassword(ev.target.value)}}></input>
                    <button type="submit" disabled={!inputUsername || !inputPassword || status === "logging"}>Sign In</button>
                    <p>{errorMessage || ""}</p>
                </form>
            </div>
            <div>
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
            </div>
        </>
    )
}

export default Login;