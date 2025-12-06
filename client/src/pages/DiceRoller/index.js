import { useState } from "react";

import styled from "styled-components";

//Audio files
import low1 from "../../Audio/low1.mp3";
import low2 from "../../Audio/low2.mp3";
import low3 from "../../Audio/low3.mp3";
import low4 from "../../Audio/low4.mp3";
import mid1 from "../../Audio/mid1.mp3";
import mid2 from "../../Audio/mid2.mp3";
import mid3 from "../../Audio/mid3.mp3";
import mid4 from "../../Audio/mid4.mp3";
import high1 from "../../Audio/high1.mp3";
import high2 from "../../Audio/high2.mp3";
import high3 from "../../Audio/high3.mp3";
import high4 from "../../Audio/high4.mp3";
//Confetti
import confetti from "canvas-confetti";

const DiceRoller = () => {
    const [ dieResult, setDieResult ] = useState(null);
    const [ dieIsRolling, setDieIsRolling ] = useState(false);
    const [ temporaryDie, setTemporaryDie ] = useState(null);

    //dice modifications
    const [ dieMaxValue, setDieMaxValue ] = useState(20);
    const [ selectedDie, setSelectedDie ] = useState(20);

    //dice log
    const [ diceHistory, setDiceHistory ] = useState([]);

    //Wacky Mode
    const [ wackyEnabled, setWackyEnabled ] = useState(false);
    const [ confettiEnabled, setConfettiEnabled ] = useState(false);
    const lowSounds = [low1, low2, low3, low4];
    const midSounds = [mid1, mid2, mid3, mid4];
    const highSounds = [high1, high2, high3, high4];
    const playSound = (type) => {
        let audioPool;

        if (type === "low") audioPool = lowSounds;
        else if (type === "mid") audioPool = midSounds;
        else if (type === "high") audioPool = highSounds;

        if (!audioPool) return;

        const randomIndex = Math.floor(Math.random() * audioPool.length);
        const audio = new Audio(audioPool[randomIndex]);

        audio.volume = 0.8;
        audio.play();
    }
    const fireConfetti = () => {
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.7 },
            colors: ["#D4AF37"]
        });
    }

    const rollDie = () => {
        setDieIsRolling(true);
        setDieResult(null);
        setTemporaryDie(null);

        const rollingInterval = setInterval(() => {
            setTemporaryDie(Math.ceil(Math.random() * dieMaxValue));
        }, 100)

        setTimeout(() => {
            clearInterval(rollingInterval);

            const finalResult = (Math.ceil(Math.random() * dieMaxValue));
            setDieResult(finalResult)

            //Wacky Mode Audio & Confetti
            if (wackyEnabled) {
                if (finalResult <= dieMaxValue * (0.25)) {
                    playSound("low");
                } else if ( finalResult > dieMaxValue*0.5 && finalResult <= dieMaxValue*0.75) {
                    playSound("mid");
                } else if ( finalResult >= dieMaxValue*0.9) {
                    playSound("high");
                }
            }
            if (confettiEnabled && finalResult === dieMaxValue) {
                fireConfetti();
            }

            setDieIsRolling(false);
            setDiceHistory((prev) => {
                const entry = {
                    value: finalResult,
                    die: dieMaxValue,
                }
                const updatedHistory = [entry, ...prev];
                return updatedHistory.slice(0, 6);
            })
        }, 1000)
    }

    const changeDie = (chosenDie) => {
        setDieMaxValue(chosenDie);
        setSelectedDie(chosenDie);
    }

    return (
        <PageLayout>
            <RollingContainer>
                <p>Tap the square to test your luck.</p>
                <RollButton 
                    onClick={rollDie} 
                    disabled={dieIsRolling}
                    $rollValue={dieResult}
                    $maxValue={dieMaxValue}>
                    {dieIsRolling ? temporaryDie : dieResult }
                </RollButton>
            </RollingContainer>
            <DiceContainer>
                <p>Change your fate. Choose your die.</p>
                {[4, 6, 8, 10, 12, 20].map((die) => (
                    <DieButton key={die} selected={selectedDie === die} onClick={() => {changeDie(die)}} disabled={dieIsRolling}>D{die}</DieButton>
                ))}
            </DiceContainer>
            <DiceHistoryContainer>
                {diceHistory.map((entry, index) => (
                    <p key={index}>
                        You rolled a <span>{entry.value}</span> with the D{entry.die}. 
                        {entry.value === 1 && " (Lowest Roll!)"} 
                        {entry.value === entry.die && " (Critical success!)"}
                    </p>
                ))}
            </DiceHistoryContainer>
            <OptionsContainer>
                <button onClick={() => setWackyEnabled(!wackyEnabled)}>{wackyEnabled? "Disable Audio" : "Enable Audio"}</button>
                <button onClick={() => setConfettiEnabled(!confettiEnabled)}>{confettiEnabled? "Disable Confetti" : "Enable Confetti"}</button>
            </OptionsContainer>
        </PageLayout>
        
    )
}

export default DiceRoller;

const PageLayout = styled.section`
    p {
        font-size: 1.25rem;
    }
`
const RollingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
`
const RollButton = styled.button`
    font-size: 3.5rem;
    width: 180px;
    height: 180px;
    padding: 3.5rem;
    margin: 1rem;
    border-radius: 5px;
    border: 3px solid #2E2B2B;
    cursor: pointer;
    background-color: ${({$rollValue, $maxValue}) => {
        if ($rollValue === $maxValue) return "#D4AF37";
        else if ($rollValue === 1) return "#A68B6E";
        return "white";
    }};
`
const DiceContainer = styled.div`
    text-align: center;
    margin: 2rem 0;
`
const DieButton = styled.button`
    font-size: 1.2rem;
    width: 3rem;
    height: 3rem;
    margin: 1rem 0.25rem;
    border-radius: 5px;
    border: 0.1rem solid #2E2B2B;
    background: ${(props) => (props.selected ? "#C0392B" : "white")};
    color: ${(props) => (props.selected ? "white" : "#2E2B2B")};
    cursor: pointer;
    transition: 0.2s;
`
const DiceHistoryContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;
    padding: 0.25rem;
    margin: 2rem;
    border: 0.2rem solid #2E2B2B;
    height: 6rem;
    background-color: #A68B6E;
    p {
        font-size: 1rem;
    }
    span {
        font-weight: bold;
        color: #6C3483;
    }
`

const OptionsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    button {
        background-color: #A68B6E;
        color: #1C1C1C;
        border: 0.15rem solid #2E2B2B;
        font-size: 1.25rem;
        cursor: pointer;
    }
    button:active {
        transform: scale(0.9);
    }
`