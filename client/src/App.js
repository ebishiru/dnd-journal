import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import DiceRoller from "./pages/DiceRoller";


const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/diceroller" element={<DiceRoller />} />
            </Routes>
        </Router>
    )
}

export default App;