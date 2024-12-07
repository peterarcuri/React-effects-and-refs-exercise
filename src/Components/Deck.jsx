import React, { useState, useEffect } from 'react';
import Card from "./Card.jsx";
import axios from "axios";
import "./Deck.css";



const BASE_URL = "https://deckofcardsapi.com/api/deck";


function Deck() { // Allows drawing a card at a time

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    // Create a new deck when the component loads
   
    useEffect(function loadDeckFromAPI() {
        async function fetchData() {
            const res = await axios.get(`${BASE_URL}/new/shuffle/`);
            setDeck(res.data);
        }
        fetchData();
    }, []);
      
            
         
     
        


    // Draw a card from the deck
    const draw = async () => {
        try {

            if (!deck) {
                alert("No deck available! Shuffle first.");
                return;
            } 

            const resDraw = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/`);
            console.log("Deck response:", resDraw.data );

            if (resDraw.data.remaining === 0) {
                alert("Deck Empty!");
                return;
            }
            
            const card = resDraw.data.cards[0];

            setCards(d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                }
            ])
        }
        catch(err) {
            alert(err);
        }
    }

    // Shuffle the deck
    const shuffleDeck = async () => {

        if (!deck) return;

        setLoading(true);

        try {
            await axios.get(`${BASE_URL}/${deck.deck_id}/shuffle/`);
            setCards([]);
        }
        catch(err) {
            alert(err)
        }
        finally {
            setLoading(false);
        }
    }

  
    // Return draw button (disabled if shuffling)
    function renderDrawBtnIfOk() {

        if (!deck) return null;

        return (
            <button className="Deck-gimmie" onClick={draw} disabled={loading}>Draw a Card</button>
        );
    }

    // Return shuffle button (disabled if already is)
    function renderShuffleBtnIfOk() {

        if (!deck) return null;

        return (
            <button className="Deck-gimmie" onClick={shuffleDeck} disabled={loading}>Shuffle Deck</button>
        );
    }

    return (

        <main>

            <div className="Deck-buttons">

                {renderDrawBtnIfOk()}
                {renderShuffleBtnIfOk()}

            </div>
           

            <div className="Deck-cardarea">
                {cards.map((c) => (
                    <Card key={c.id} name={c.name} image={c.image} />
                ))}
            </div>

        </main>

    );


}

export default Deck;