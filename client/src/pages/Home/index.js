import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <p>DND Journal</p>
            <p>Characters</p>
            <p>Campaigns</p>
            <p><Link to={"/login"}>Log In</Link></p>
            <p><Link to={"/diceroller"}>Dice Roller</Link></p>
        </>
    )
}

export default Home;