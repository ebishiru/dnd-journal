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
        </>
    )
}

export default Home;