import React from 'react'
import Flashcard from './Flashcard.jsx'

// Receive list of cards and onDelete callback func
function FlashcardList({ cards, onDelete }) {
    return (
        <div className='card-grid'>
            {cards.map(card => { // Loop through each card 
                // Render Flashcard component 
                return <Flashcard card={card} key={card.id} onDelete={onDelete}/>
            })}
        </div>
    )
}

export default FlashcardList