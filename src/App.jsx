import React, { useEffect, useState } from "react";
import "./App.css";

const initialCards = ["🐶", "🐱", "🐭", "🐹", "🦊", "🐻", "🐼", "🐨"];

function shuffle(array) {
  return [...array, ...array]
    .sort(() => Math.random() - 0.5)
    .map((item, index) => ({ 
      id: index, 
      content: item, 
      flipped: false, 
      matched: false 
    }));
}

function App() {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    setCards(shuffle(initialCards));
  }, []);

  useEffect(() => {
    if (firstCard && secondCard) {
      setDisabled(true);
      setMoves(prev => prev + 1);
      
      if (firstCard.content === secondCard.content) {
        setCards(prev =>
          prev.map(card =>
            card.content === firstCard.content
              ? { ...card, matched: true }
              : card
          )
        );
        
        const allMatched = cards.filter(card => !card.matched).length === 2;
        if (allMatched) {
          setTimeout(() => setGameWon(true), 500);
        }
        
        resetTurn();
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, flipped: false }
                : card
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  const handleClick = (card) => {
    if (disabled || card.flipped || card.matched || gameWon) return;

    setCards(prev =>
      prev.map(c =>
        c.id === card.id ? { ...c, flipped: true } : c
      )
    );

    if (!firstCard) {
      setFirstCard(card);
    } else {
      setSecondCard(card);
    }
  };

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  const resetGame = () => {
    setCards(shuffle(initialCards));
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
    setMoves(0);
    setGameWon(false);
  };


return (
  <div className="app-container">
    <h1 className="game-title">🧠 Juego de Memoria</h1>
    <p className="moves-counter">Movimientos: {moves}</p>
    
    {gameWon && (
      <div className="win-message">
        <p className="win-text">¡Ganaste! </p>
        <p>Total de movimientos: {moves}</p>
      </div>
    )}
    
    <div className="cards-grid small-cards"> 
      {cards.map(card => (
        <div
          key={card.id}
          className={`card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
          onClick={() => handleClick(card)}
        >
          <div className="card-content">
            {card.flipped || card.matched ? card.content : "?"}
          </div>
        </div>
      ))}
    </div>
    
    <button onClick={resetGame} className="reset-button">
      Reiniciar Juego
    </button>
  </div>
);
}

export default App;