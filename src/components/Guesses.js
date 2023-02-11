import styled from "styled-components"
import { useState } from "react";

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
  grid-column: 4 / span 3;
  gap: 10px;
  color: ${({correct}) => correct ? "green" : "#f44"};
`;

const NewWord = styled(Hint)`
  display: inline-block;
  grid-column: 4 / span 3;
  gap: 10px;
  }};
`;

const NewLetter = styled.div`
  display: inline-block;
  color: ${({ letter, index, answer }) => {
    return answer.split("")[index] === letter ? "green" : "#f44";
  }};
`;

//<span style="color:#FF0000">H</span>
//<span style="color:#FF9966">l</span>
//<span style="color:#FFCCCC">l</span>
//<span style="color:#66CC66">e</span>
//<span style="color:#FF0066">o</span>

//<Word correct={answer === guess.word}>{guess.word}</Word>

export function Guesses({ guesses, answer }) {
  return (
    <GuessBox>
      {guesses.map((guess, index) => (
        <GuessLine key={index}>
          <Hint>{`Hint: ${guess.hint}`}</Hint>
          <NewWord>
            {guess.word.split("").map((letter, index) => (
              <NewLetter answer={answer} letter={letter} index={index}>{letter}</NewLetter>
              ))}
          </NewWord>
        </GuessLine>
      ))}
    </GuessBox>
  )
}