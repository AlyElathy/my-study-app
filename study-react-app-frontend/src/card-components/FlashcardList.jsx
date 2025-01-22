import React from 'react'
import Flashcard from './Flashcard.jsx'

function FlashcardList({ cards, onDelete }) {
    return (
        <div className='card-grid'>
            {cards.map(card => {
                return <Flashcard card={card} key={card.id} onDelete={onDelete}/>
            })}
        </div>
    )
}

export default FlashcardList