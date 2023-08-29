import { useEffect, useState } from 'react';
import styles from './Main.module.css';

function roll(range) {
    const val = Math.ceil((Math.random() * range));
    return val ? val : roll(range);
}

export default function Main() {

    function resetGame() {
        return new Array(10).fill(1).map(() => ({value: roll(6), held: false}));
    }

    const [diceValues, setDiceValues] = useState(resetGame);

    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setGameOver((new Set(diceValues.map((item) => item.value)).size === 1) && 
            (diceValues.reduce((prev, cur) => cur.held && prev, true)));
    }, [diceValues]);

    function toggleHeldState(idx) {
        // console.log('dice values in toggle method', diceValues);
        // console.log(this);
        setDiceValues((prevDiceValues) => {
            const newState = [...prevDiceValues];
            newState[idx].held = !prevDiceValues[idx].held;
            return newState;
        })
    }

    function rollTenzies() {
        if(gameOver) {
            setGameOver(false);
            setDiceValues(resetGame());
            return;
        }
        setDiceValues((prevDiceValues) => {
            const newState = [...prevDiceValues];
            newState.filter(item => !item.held).forEach((item) => {
                item.value = roll(6);
            })
            return newState;
        })
    }

    const diceElements = diceValues.map((item, idx) => {
        const classes = [styles.dice];
        if(item.held) {
            classes.push(styles.held);
        }
        return (<div key={idx} className={classes.join(' ')} onClick={() => toggleHeldState(idx)}>{item.value}</div>)
    });

    return (
        <div className={styles.main}>
            <h2>Tenzies</h2>
            <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className={styles['dice-container']}>
                {diceElements}
            </div>
            <button onClick={rollTenzies}>{gameOver ? 'Reset game' : 'Roll'}</button>
        </div>
    );

}