import styled from "styled-components";
import { useState, useMemo, useEffect, useRef } from "react";
import { Guesses } from "./components/Guesses";
import { DateTime } from "luxon";
import { useGuesses } from "./hooks/useGuesses";
import { ButtonStyle } from './globalStyles';
import { HowToModal } from './components/HowToModal';
import { StatsModal } from "./components/StatsModal";
import { ToastContainer, Flip, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import all_hints from "./full_scrape_with_frequent_words.json"
import seedrandom from "seedrandom";
import { Share } from "./components/Share";
import Autosuggest from 'react-autosuggest';
import './Autosuggest.css';


const Container = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  font-size: 3rem;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
  -webkit-user-select: none; /*Safari*/
  -moz-user-select: none; /*Firefox*/
  color: var(--primary-logo);
`;

const InputArea = styled.div`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  width: 80%;
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  ${ButtonStyle}
`;

const Hint = styled.div`
  color: var(--primary-text);
  font-size: 1.5rem;
  span {
    color: var(--primary-highlight);
  }
`;

const StyledSuggest = styled(Autosuggest)`
  color: #1a1a1a;
`;

const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const getDayString = () => {
  return DateTime.now().toFormat(isDev() ? "yyyy-MM-dd-hh-mm-ss" : "yyyy-MM-dd");
}

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);

const normalise = value => value.toLowerCase().replace(/[^a-z\s-'\d/]/g, "");

const TITLES = Object.keys(all_hints);
const ATTEMPTS = 10

function App() {
  const dayString = useMemo(getDayString, []);
  const todaysTitle = useMemo(() => TITLES[Math.floor(seedrandom.alea(dayString)() * TITLES.length)]);
  const [answer] = useState(normalise(todaysTitle));
  const [hints] = useState(all_hints[todaysTitle]);
  const [input, setInput] = useState("");
  const [guesses, addGuess] = useGuesses(dayString);
  const [end, setEnd] = useState(false);
  const [win, setWin] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = (e) => {
    if (/[\s-/]/.test(e.target.value)) return;
    setInput(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13 && !end) {
      handleGuess();
    }
  };

  const handleGuess = (e) => {
    addGuess({word: input, hint: hints[guesses.length], answer: answer});
    setInput("");
  }

  const getHint = () => {
    if (win) return "You won! 🥳";
    if (guesses.length > hints.length - 1) {
      return "Out of hints!"
    }
    const hint = hints[guesses.length]
    return hint;
  }

  useEffect(() => {
    if (guesses.length > 0 && guesses[guesses.length-1].word === answer) {
      setEnd(true);
      setWin(true);
      toast('Congratulations! Great guess! 🥳', {autoClose: 5000})
      return;
    }
    if (guesses.length === 10) {
      toast(`Better luck next time! The answer is\n✨${todaysTitle}✨`);
      setEnd(true);
    }
  },[guesses]);

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : TITLES.filter(title =>
      title.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const inputProps = {
    placeholder: `Search for and article`,
    value: input,
    onChange: (event, { newValue }) => setInput(newValue),
    onKeyDown: handleEnter,
    disabled: end,
  };

  return (
    <Container>
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        autoClose={false}
      />
      <Title>Wikiguesser</Title>
      <IconContainer>
        <HowToModal />
        <StatsModal />
      </IconContainer>
      <InputArea>
        <StyledSuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={({ value }) => setSuggestions(getSuggestions(value))}
          onSuggestionsClearRequested={() => setSuggestions([])}
          getSuggestionValue={suggestion => suggestion}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </InputArea>
      <Hint>Hint: <span>{getHint()}</span>, Guesses: <span>{ATTEMPTS-guesses.length}</span></Hint>
      <Buttons>
        {!end ?
          <Button onClick={handleGuess} disabled={end}>Guess!</Button>
          :
          <Share 
            win={win}
            guesses={guesses}
            end={end}
            dayString={dayString}
          /> 
        }
      </Buttons>
      <Guesses guesses={guesses}
               answer={answer}/>
    </Container>
  );
}

export default App;
