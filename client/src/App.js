import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./Pages/Home";
import CharactersList from "./Pages/CharactersList";
import CharacterPage from "./Pages/CharacterPage";
import CampaignsList from "./Pages/CampaignsList";
import ManageInfo from "./Pages/ManageInfo";
import CreateNewCharacter from "./Pages/CreateNewCharacter";
import ManageCharactersList from "./Pages/ManageCharactersList";
import ManageCharacter from "./Pages/ManageCharacter";
import Login from "./Pages/Login";
import DiceRoller from "./Pages/DiceRoller";

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/characters" element={<CharactersList />} />
                <Route path="/character/:_id" element={<CharacterPage />} />
                <Route path="/campaigns" element={<CampaignsList />} />
                <Route path="/manage" element={<ManageInfo />} />
                <Route path="/manage/character/new" element={<CreateNewCharacter />} />
                <Route path="/manage/characters" element={<ManageCharactersList />} />
                <Route path="/manage/character/:_id" element={<ManageCharacter />} />
                <Route path="/login" element={<Login />} />
                <Route path="/diceroller" element={<DiceRoller />} />
            </Routes>
        </Router>
    )
}

export default App;