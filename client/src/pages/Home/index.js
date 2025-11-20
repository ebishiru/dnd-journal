import { Link } from "react-router-dom";

import { CurrentUserContext } from "../../Context/CurrentUserContext";
import { useContext } from "react";

const Home = () => {
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    const handleLogOut = () => {
        setCurrentUser(null);
    }
    return (
        <>
            <h2>DND Journal</h2>
            <button>Browse Characters</button>
            <button>Browse Campaigns</button>
            <button><Link to={"/diceroller"}>Dice Roller</Link></button>
            {
                !currentUser? <button><Link to={"/login"}>Log In</Link></button> 
                : <>
                    <button>Edit Info</button>
                    <button onClick={handleLogOut}>Log Out</button>
                </>
            }
        </>
    )
}

export default Home;