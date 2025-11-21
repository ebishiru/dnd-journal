
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const ManageInfo = () => {
    const navigate = useNavigate();
    const [ currentUser, setCurrentUser ] = useContext(CurrentUserContext);

    //ensure user is logged in
    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate])

    console.log(currentUser);
    return (
        <>
            <h2>Welcome {currentUser}</h2>
            <Link to={"/manage/character/new"}><button>Create New Character</button></Link>
            <button>Manage Existing Character</button>
            <button>Create New Campaign</button>
            <button>Manage Existing Campaign</button>
        </>
    )
}

export default ManageInfo;