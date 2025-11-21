import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./Pages/Home";
import CharactersList from "./Pages/CharactersList";
import CampaignsList from "./Pages/CampaignsList";
import ManageInfo from "./Pages/ManageInfo";
import Login from "./Pages/Login";
import DiceRoller from "./Pages/DiceRoller";

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/characters" element={<CharactersList />} />
                <Route path="/campaigns" element={<CampaignsList />} />
                <Route path="/manage" element={<ManageInfo />} />
                <Route path="/login" element={<Login />} />
                <Route path="/diceroller" element={<DiceRoller />} />
            </Routes>
        </Router>
    )
}

export default App;