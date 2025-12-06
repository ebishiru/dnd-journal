import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./Components/Header";
import { PageWrapper } from "./Components/PageWrapper";
import Home from "./Pages/Home/index.js";
import CharactersList from "./Pages/CharactersList/index.js";
import CharacterPage from "./Pages/CharacterPage/index.js";
import CampaignsList from "./Pages/CampaignsList/index.js";
import CampaignPage from "./Pages/CampaignPage/index.js";
import ManageInfo from "./Pages/ManageInfo/index.js";
import CreateNewCharacter from "./Pages/CreateNewCharacter/index.js";
import ManageCharactersList from "./Pages/ManageCharactersList/index.js";
import ManageCharacter from "./Pages/ManageCharacter/index.js";
import CreateNewCampaign from "./Pages/CreateNewCampaign/index.js";
import ManageCampaignsList from "./Pages/ManageCampaignsList/index.js";
import ManageCampaign from "./Pages/ManageCampaign/index.js";
import Login from "./Pages/Login/index.js";
import DiceRoller from "./Pages/DiceRoller/index.js";

import { Toaster } from "sonner";

const App = () => {

    return (
        <Router>
            <PageWrapper>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/characters" element={<CharactersList />} />
                <Route path="/character/:_id" element={<CharacterPage />} />
                <Route path="/campaigns" element={<CampaignsList />} />
                <Route path="/campaign/:_id" element={<CampaignPage />} />
                <Route path="/manage" element={<ManageInfo />} />
                <Route path="/manage/character/new" element={<CreateNewCharacter />} />
                <Route path="/manage/characters" element={<ManageCharactersList />} />
                <Route path="/manage/character/:_id" element={<ManageCharacter />} />
                <Route path="/manage/campaign/new" element={<CreateNewCampaign />} />
                <Route path="/manage/campaigns" element={<ManageCampaignsList />} />
                <Route path="/manage/campaign/:_id" element={<ManageCampaign />} />
                <Route path="/login" element={<Login />} />
                <Route path="/diceroller" element={<DiceRoller />} />
            </Routes>
            <Toaster 
                position="top-center" 
                toastOptions={{
                    style: {
                        background: "#A68B6E",
                        border: "2px solid #2E2B2B",
                        color: "#1C1C1C",
                        fontFamily: "IM Fell English, serif",
                        fontSize: "1rem",
                    }
            }}/>
            </PageWrapper>
        </Router>
    )
}

export default App;