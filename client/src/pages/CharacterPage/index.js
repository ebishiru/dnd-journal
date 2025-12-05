import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

const CharacterPage = () => {
    const { _id } = useParams();

    const [ character, setCharacter ] = useState(null);
    const [ errorMessage, setErrorMessage ] = useState(null);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await fetch(`/character/${_id}`);
                const data = await response.json();
                if (data.status !== 200) {
                    setErrorMessage(data.message);
                } else {
                    setCharacter(data.data);
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        }

        fetchCharacter();
    }, [_id])

    if (!character) {
        if (errorMessage) {
            return (
                <p>{errorMessage}</p>
            )
        } else {
            return (
            <LoadingContainer>
                <img src="/fire.gif" />
                <p>Loading...</p>
            </LoadingContainer>
            
        )
        }
        
    }

    return (
        <>
            <CharacterName>{character.name}</CharacterName>
            <DataContainer>
                <p>As told by: <span>{character.author}</span></p>
                <p>Created on: <span>{character.createdAt}</span></p>
                <p>Last edit: <span>{character.lastEdit}</span></p>
            </DataContainer>
            <StoryContainer>
                <p>{character.story}</p>
            </StoryContainer>
            <QuoteContainer>
                <p className="quoteTitle">Words to be remembered forever...</p>
                {
                    character.quotes.map((quote, index) => {
                        return (
                            <p key={index}>{quote}</p>
                        )
                    })
                }
            </QuoteContainer>
        </>
    )
}

export default CharacterPage;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
    gap: 1rem;
    p {
        font-weight: bold;
    }
`
const CharacterName = styled.p`
    font-size: 2rem;
    font-weight: bold;
    text-decoration: underline;
    text-align: center;
    color: #1C1C1C;
    margin: 1rem 0;
`
const DataContainer = styled.div`
    font-size: 1.2rem;
    margin: 0.5rem;
    padding: 0.5rem;
    border: 0.15rem dashed #A68B6E;
    color: #1C1C1C;
    span {
        color: #6C3483;
    }
`
const StoryContainer = styled.div`
    line-height: 1.5;
    margin: 0.5rem;
    padding: 0.5rem;
    border: 0.15rem dashed #A68B6E;
    color: #1C1C1C;
    p {
        white-space: pre-wrap;
    }
`
const QuoteContainer = styled.div`
    text-align: center;
    font-size: 1.2rem;
    font-style: italic;
    margin: 0.5rem;
    padding: 0.5rem;
    border: 0.15rem dashed #A68B6E;
    color: #C0392B;
    .quoteTitle {
        color: #1C1C1C;
        font-style: normal;
        font-weight: bold;
        padding-bottom: 0.5rem;
    }
    p {
        padding-bottom: 0.25rem;
    }
`