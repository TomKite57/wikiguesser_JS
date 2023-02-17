import styled from "styled-components"

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
  grid-column: 1 / span 2;
  margin-right: 2px;
  align-items: center;
  justify-content: center;
  font-size: x-large;
`;

const Word = styled(Hint)`
  grid-column: 3 / span 2;
  gap: 10px;
  color: ${({correct}) => correct ? "green" : "#f44"};
`;

const Stat = styled(Hint)`
  grid-column: 5 / span 2;
`;

export function Guesses({ guesses, guessStats, answer }) {
  return (
    <GuessBox>
      {guesses.map((guess, index) => (
        <GuessLine key={index}>
          <Hint>{`Hint: ${guess.hint}`}</Hint>
          <Word correct={answer===guess.word}>{guess.word}</Word>
          {answer === guess.word ? 
          <Stat>🥳</Stat>
          :
          <Stat>{guessStats[guess.word] ? `${guessStats[guess.word].numPaths} paths - ${guessStats[guess.word].pathLength}`:"⏳"}</Stat>
          }
        </GuessLine>
      ))}
    </GuessBox>
  )
}
