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
                const updatedHistory = [finalResult, ...prev];
                return updatedHistory.slice(0, 4);
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
                <h2>Click to roll</h2>
                <RollButton onClick={rollDie} disabled={dieIsRolling}>
                    {dieIsRolling ? temporaryDie : dieResult }
                </RollButton>
            </RollingContainer>
            <div>
                {diceHistory.map((value) => (
                    <p key={value}>You rolled a {value} with the D{selectedDie}</p>
                ))}
            </div>
            <DiceContainer>
                <h3>Change Die:</h3>
                {[4, 6, 8, 10, 12, 20].map((die) => (
                    <DieButton key={die} selected={selectedDie === die} onClick={() => {changeDie(die)}} disabled={dieIsRolling}>D{die}</DieButton>
                ))}
            </DiceContainer>
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
    margin: 5rem 0;
`

const DiceContainer = styled.div`
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
`

const DieButton = styled.button`
    padding: 0.25rem;
    margin: 0.25rem;
    border-radius: 5px;
    border: 1px solid black;
    background: ${(props) => (props.selected ? "green" : "white")};
    color: ${(props) => (props.selected ? "white" : "black")};
    cursor: pointer;
    transition: 0.2s;
`