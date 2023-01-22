import styled from "styled-components"
import { useState } from "react";


const getHeat = (ratio) => {    
  const start = [3,2,252]; // blue
  const end = [254,0,2]; // red
  const r = Math.trunc(ratio*end[0] + (1-ratio)*start[0]);
  const g = Math.trunc(ratio*end[1] + (1-ratio)*start[1]);
  const b = Math.trunc(ratio*end[2] + (1-ratio)*start[2]);
  return `rgb(${r},${g},${b})`;
}

const getHeatEmoji = (similarity) => {
  if (similarity > 0.8) {
    return "🔥";
  }
  if (similarity > 0.6) {
    return "🥵";
  }
  if (similarity > 0.4) {
    return "😐";
  }
  if (similarity > 0.3) {
    return "🥶";
  }
  else {
    return "❄️";
  }

}

const GuessBox = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
`;

const GuessLine = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(50px, 80px));
`;

const Hint = styled.div`
  display:flex; 
  padding: 0.25rem;
  position:relative;
  background-color: var(--secondary-background);
  border-radius: 3px;
  grid-column: 1 / span 3;
  margin-right: 2px;
  align-items: center;
  justify-content: center;
  font-size: x-large;
`;

const Word = styled(Hint)`
  grid-column: 4 / span 2;
  gap: 10px;
  color: ${({correct, ratio}) => correct ? "green" : "#f44"};
`;

const Emoji = styled(Hint)`
  grid-column: 6 / span 1;
`;

export function Guesses({ guesses, answer }) {
  return (
    <GuessBox>
      {guesses.map((guess, index) => (
        <GuessLine key={index}>
          <Hint>{`Hint: ${guess.hint}`}</Hint>
          <Word correct={answer===guess.word}
                ratio={guess.similarity}>
            {guess.word}
          </Word>
          <Emoji>
            {getHeatEmoji(guess.similarity)}
          </Emoji>
        </GuessLine>
      ))}
    </GuessBox>
  )
}