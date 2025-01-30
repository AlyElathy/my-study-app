import React, { useState, useEffect, useRef } from 'react'

// Receive card (id, q, a) & onDelete (callback) 
function Flashcard({ card, onDelete }) {
    const [flip, setFlip] = useState(false); // init = false
    const [height, setHeight] = useState('initial'); // init = initial
    // Reference to front and back div
    const frontEl = useRef(); 
    const backEl = useRef();

    // Measure height of both sides
    function setMaxHeight() {
        const frontHeight = frontEl.current.getBoundingClientRect().height;
        const backHeight = backEl.current.getBoundingClientRect().height;
        // Set overall card height to maximum of the two (min 100px)
        setHeight(Math.max(frontHeight, backHeight, 100));
    }

    useEffect(setMaxHeight, [card.question, card.answer]) // Set max height when q or a change
    // Change sizes on resize of window (eventlistener)
    useEffect(() => {
        window.addEventListener('resize', setMaxHeight);
        return () => window.removeEventListener('resize', setMaxHeight);
    }, []) // Mount

    return (
        <>
            <div 
            // Apply class card and flip if state var flip true
            className={`card ${flip ? 'flip': ''}`}
            style={{height: height}}
            // Toggle flip state when onClick
            onClick={() => setFlip(!flip)}>
            <button className='delete-btn' onClick={(e) => {
                e.stopPropagation(); // Stop flipping when clicking delete btn
                onDelete(card.id); // Delete func
            }}>
                X
            </button>
                <div className='front' ref={frontEl}>
                    {card.question}
                </div>
                <div className='back' ref={backEl}>
                    {card.answer}
                </div>
            </div>
        </>
    )
}



export default Flashcard