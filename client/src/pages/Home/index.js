import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <p>DND Journal</p>
            <p>Characters</p>
            <p>Campaigns</p>
            <p>Login</p>
            <p>Signup</p>
            <p><Link to={"/diceroller"}>Dice Roller</Link></p>
        </>
    )
}

export default Home;