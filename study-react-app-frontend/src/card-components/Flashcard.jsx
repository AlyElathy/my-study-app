import React, { useState, useEffect, useRef } from 'react'

function Flashcard({ card, onDelete }) {
    const [flip, setFlip] = useState(false);
    const [height, setHeight] = useState('initial');
    const frontEl = useRef();
    const backEl = useRef();

    function setMaxHeight() {
        const frontHeight = frontEl.current.getBoundingClientRect().height;
        const backHeight = backEl.current.getBoundingClientRect().height;
        setHeight(Math.max(frontHeight, backHeight, 100));
    }

    useEffect(setMaxHeight, [card.question, card.answer])
    useEffect(() => {
        window.addEventListener('resize', setMaxHeight);
        return () => window.removeEventListener('resize', setMaxHeight);
    }, [])

    return (
        <>
            <div 
            className={`card ${flip ? 'flip': ''}`}
            style={{height: height}}
            onClick={() => setFlip(!flip)}>
            <button className='delete-btn' onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
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