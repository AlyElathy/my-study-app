import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from '../card-components/FlashcardList.jsx';
import '../styles/FlashcardsPage.css'
import axios from 'axios'

function FlashcardsPage() {
  const [cards, setCards] = useState([])
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/flashcards', {
      headers: { 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
    })
    .then(res => setCards(res.data))
    .catch(error => console.error(error));
  }, []);

  function handleAddCard(e) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const newCard = { question, answer };
    axios.post('http://localhost:5000/api/flashcards', newCard, {
      headers: {'Authorization': `Bearer ${token}`}
    })
    .then(res => {
      setCards([...cards, res.data]);
      setQuestion('');
      setAnswer('');
    })
    .catch(error => { // Not logged in or token or expired
      if (error.response.status === 403) {
        alert("Session expired (1 hour) or you are not logged in. Please log in and try again to use flashcards.");
      } else {
        console.error(error);
      }});
  }

  function handleDeleteCard(id) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/api/flashcards/${id}`, {
      headers: {'Authorization': `Bearer ${token}`}
    })
    .then(response => {
      // Update your state after successful deletion
      setCards(cards.filter(card => card.id !== id));
    })
    .catch(error => { // Not logged in or token or expired
      if (error.response.status === 403) {
        alert("Session expired (1 hour) or you are not logged in. Please log in and try again to use flashcards.");
      } else {
        console.error(error);
      }});
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