import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CharacterPage = () => {
    const navigate = useNavigate();
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
            <p>Loading Character...</p>
            
        )
        }
        
    }

    return (
        <>
            <p>{character.name}</p>
            <p>Story:</p>
            <p>{character.story}</p>
            <p>Quotes:</p>
            {
                character.quotes.map((quote, index) => {
                    return (
                        <p key={index}>{quote}</p>
                    )
                })
            }
        </>
    )
}

export default CharacterPage;