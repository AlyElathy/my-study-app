import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FlashcardsPage.css'

function FlashcardsPage() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [flashcards, setFlashcards] = useState([]);
 
    useEffect(() => {
        fetchFlashcards();
    }, []);

    const fetchFlashcards = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/flashcards', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFlashcards(response.data.flashcards.filter(f => f.user === parseJwt(token).username));
            setQuestion('');
            setAnswer('');
        } catch (error) {
            console.error(error);
            alert("Trouble fetching flashcards.");
        }
    };

    const handleAddFlashcard = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/flashcards', 
                {question, answer},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setFlashcards(response.data.flashcards.filter(f => f.user === parseJwt(token).username));
            setQuestion('');
            setAnswer('');
        } catch (error) {
            console.error(error);
            alert("Failed Adding Flashcard");
        }
    }

    const parseJwt = (token) => {
        if (!token) { return {}; }
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    }

    return (
        <div id='flashcards-page-div'>
            <h2 id='flashcards-header'>Flashcards</h2>
            <div>
                {flashcards.map((card, index) => (
                    <div key={index} class='card'>
                        <p><b>Q:</b>"{card.question}</p>
                        <p><b>A:</b>"{card.answer}</p>
                    </div>
                ))}
            </div>
            <div id='create-flashcard-div'>
                <input placeholder='Question' value={question} onChange={(e) => setQuestion(e.target.value)} className="set-side-input"/>
                <input placeholder='Answer' value={answer} onChange={(e) => setAnswer(e.target.value)} className="set-side-input"/>
                <button onClick={handleAddFlashcard} id='add-flashcard-btn'>Add Flashcard</button>
            </div>
        </div>
    );
}

export default FlashcardsPage