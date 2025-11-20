import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import DiceRoller from "./Pages/DiceRoller";
import Profile from "./Pages/Profile";

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/diceroller" element={<DiceRoller />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    )
}

export default App;