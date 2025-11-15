import { use, useState } from "react";

import styled from "styled-components";

const DiceRoller = () => {
    const [ dieResult, setDieResult ] = useState(null);
    const [ dieIsRolling, setDieIsRolling ] = useState(false);
    const [ temporaryDie, setTemporaryDie ] = useState(null);

    //dice modifications
    const [ dieMaxValue, setDieMaxValue ] = useState(20);
    const [ selectedDie, setSelectedDie ] = useState(20);

    //dice log
    const [ diceHistory, setDiceHistory ] = useState([]);

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
                <h2>Tap the square to roll</h2>
                <RollButton 
                    onClick={rollDie} 
                    disabled={dieIsRolling}
                    rollValue={dieResult}
                    maxValue={dieMaxValue}>
                    {dieIsRolling ? temporaryDie : dieResult }
                </RollButton>
            </RollingContainer>
            <DiceContainer>
                <h3>Change Die:</h3>
                {[4, 6, 8, 10, 12, 20].map((die) => (
                    <DieButton key={die} selected={selectedDie === die} onClick={() => {changeDie(die)}} disabled={dieIsRolling}>D{die}</DieButton>
                ))}
            </DiceContainer>
            <DiceHistoryContainer>
                {diceHistory.map((entry, index) => (
                    <p key={index}>
                        You rolled a {entry.value} with the D{entry.die}. 
                        {entry.value === 1 && " (Lowest Roll!)"} 
                        {entry.value === entry.die && " (Critical success!)"}
                    </p>
                ))}
            </DiceHistoryContainer>
        </PageLayout>
        
    )
}

export default DiceRoller;

const PageLayout = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const RollingContainer = styled.div`
    display: block;
    margin: 2rem 0;
`

const DiceHistoryContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;
    padding: 0.25rem;
    margin: 2rem 0;
    border: 1px solid black;
    width: 350px;
    height: 6rem;
`

const DiceContainer = styled.div`
    display: block;
    margin: 2rem 0;
`

const RollButton = styled.button`
    font-size: 3rem;
    width: 180px;
    height: 180px;
    padding: 3.5rem;
    margin: 1rem;
    border-radius: 5px;
    border: 3px solid black;
    cursor: pointer;

    background-color: ${({rollValue, maxValue}) => {
        if (rollValue === maxValue) return "gold";
        return "white";
    }};
`

const DieButton = styled.button`
    font-size: 1rem;
    width: 3rem;
    height: 3rem;
    margin: 0.5rem;
    border-radius: 5px;
    border: 1px solid black;
    background: ${(props) => (props.selected ? "green" : "white")};
    color: ${(props) => (props.selected ? "white" : "black")};
    cursor: pointer;
    transition: 0.2s;
`