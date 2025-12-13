import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./Components/Header/index";
import { PageWrapper } from "./Components/PageWrapper/index";
import Home from "./Pages/Home/index";
import CharactersList from "./Pages/CharactersList/index";
import CharacterPage from "./Pages/CharacterPage/index";
import CampaignsList from "./Pages/CampaignsList/index";
import CampaignPage from "./Pages/CampaignPage/index";
import ManageInfo from "./Pages/ManageInfo/index";
import CreateNewCharacter from "./Pages/CreateNewCharacter/index";
import ManageCharactersList from "./Pages/ManageCharactersList/index";
import ManageCharacter from "./Pages/ManageCharacter/index";
import CreateNewCampaign from "./Pages/CreateNewCampaign/index";
import ManageCampaignsList from "./Pages/ManageCampaignsList/index";
import ManageCampaign from "./Pages/ManageCampaign/index";
import Login from "./Pages/Login/index";
import DiceRoller from "./Pages/DiceRoller/index";

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