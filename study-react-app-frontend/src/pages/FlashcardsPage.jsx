import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from '../card-components/FlashcardList.jsx';
import '../styles/FlashcardsPage.css'
import axios from 'axios'

function FlashcardsPage() {
  const [cards, setCards] = useState([])
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/flashcards')
    .then(res => setCards(res.data))
    .catch(error => console.error(error));
  }, []);

  function handleAddCard(e) {
    e.preventDefault()
    const newCard = { question, answer };
    axios.post('http://127.0.0.1:5000/api/flashcards', newCard)
    .then(res => {
      setCards([...cards, res.data]);
      setQuestion('');
      setAnswer('');
    })
    .catch(error => console.error(error));
  }

  function handleDeleteCard(id) {
    axios.delete(`http://127.0.0.1:5000/api/flashcards/${id}`)
    .then(response => {
      // Update your state after successful deletion
      setCards(cards.filter(card => card.id !== id));
    })
    .catch(error => console.error(error));
  }

  return (
    <>
      <form className="top-bar" onSubmit={handleAddCard}>
        <h1 className='flashcards-header'>Flashcards</h1>
        <div className="form-group">
          <label htmlFor="question">Question</label>
          <input type="text" id='question' value={question} onChange={e => setQuestion(e.target.value)} required/>
        </div>
        <div className="form-group">
          <label htmlFor="answer">Answer</label>
          <input type="text" id='answer' value={answer} onChange={e => setAnswer(e.target.value)} required/>
        </div>
        <div className="form-group">
          <button className="add-btn">Add</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList cards={cards} onDelete={handleDeleteCard}/>
      </div>
    </>
  );
}

export default FlashcardsPage;