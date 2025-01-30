import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from '../card-components/FlashcardList.jsx';
import '../styles/FlashcardsPage.css'
import axios from 'axios' // HTTP requests

function FlashcardsPage() {
  const [cards, setCards] = useState([]) // initial = empty list
  // initial = empty string
  const [question, setQuestion] = useState(''); 
  const [answer, setAnswer] = useState(''); 
  useEffect(() => {
    const token = localStorage.getItem('token'); //Retreive token from localStorage
    // Send GET request to /api/flashcards
    axios.get('http://localhost:5000/api/flashcards', {
      // token in the headers
      headers: { 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
    })
    .then(res => setCards(res.data)) // success -> set cards state w/ res.data
    .catch(error => console.error(error)); //log error
  }, []); // Runs on Mount

  function handleAddCard(e) {
    e.preventDefault() //Prevent default form submission
    const token = localStorage.getItem('token') // Retreive token from localStorage
    const newCard = { question, answer }; // newCard w/ q & a
    // POST request to create card
    axios.post('http://localhost:5000/api/flashcards', newCard, {
      // stored token in header
      headers: {'Authorization': `Bearer ${token}`}
    })
    // Sucess
    .then(res => {
      setCards([...cards, res.data]); // spread op for rest of cards, then append returned data
      // Claer q/a fields
      setQuestion('');
      setAnswer('');
    })
    .catch(error => { // Not logged in or token or expired
      if (error.response.status === 403) { //If forbidden
        alert("Session expired (1 hour) or you are not logged in. Please log in and try again to use flashcards.");
      } else {
        console.error(error); // log error
      }});
  }

  function handleDeleteCard(id) {
    const token = localStorage.getItem('token'); //get token
    // delete card by id resource
    axios.delete(`http://localhost:5000/api/flashcards/${id}`, {
      headers: {'Authorization': `Bearer ${token}`}
    })
    .then(response => {
      // Update state after successful deletion
      setCards(cards.filter(card => card.id !== id)); // filter out id'd card
    })
    .catch(error => { // Not logged in or token or expired
      if (error.response.status === 403) { //If forbidden
        alert("Session expired (1 hour) or you are not logged in. Please log in and try again to use flashcards.");
      } else {
        console.error(error); // log error
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