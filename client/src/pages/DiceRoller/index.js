import { use, useState } from "react";

import styled from "styled-components";

const DiceRoller = () => {
    const [ dieResult, setDieResult ] = useState(1);
    const [ dieMaxValue, setDieMaxValue ] = useState(20);
    const [ selectedDie, setSelectedDie ] = useState(20);

    const rollDie = () => {
        setDieResult(Math.ceil(Math.random() * dieMaxValue));
    }

    const changeDie = (chosenDie) => {
        setDieMaxValue(chosenDie);
        setSelectedDie(chosenDie);
    }

    return (
        <PageLayout>
            <RollingContainer>
                <h2>Click to roll</h2>
                <RollButton onClick={rollDie}>{dieResult}</RollButton>
            </RollingContainer>
            <DiceContainer>
                <h3>Change Die:</h3>
                {[4, 6, 8, 10, 12, 20].map((die) => (
                    <DieButton key={die} selected={selectedDie === die} onClick={() => {changeDie(die)}}>D{die}</DieButton>
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