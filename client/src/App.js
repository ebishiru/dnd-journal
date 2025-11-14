import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home";
import DiceRoller from "./pages/DiceRoller";

const App = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/diceroller" element={<DiceRoller />} />
            </Routes>
        </Router>
    )
}

export default App;