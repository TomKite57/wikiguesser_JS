import styled from "styled-components";
import { useState, useMemo, useEffect, useRef } from "react";
import { Guesses } from "./components/Guesses";
import { DateTime } from "luxon";
import { useGuesses } from "./hooks/useGuesses";
import { ButtonStyle } from './globalStyles';
import { ToastContainer, Flip, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import all_hints from "./full_scrape_with_frequent_words.json"

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

const Title = styled.div`
  display: flex;
  font-size: 4.5rem;
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

const Placeholder = styled.span`
  padding: 0 0 0.2em 0.2em;
  font-size: 3em;
  letter-spacing: 0.2em;
`;

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  caret-color: transparent;
`;

const Hint = styled.div`
  color: var(--primary-text);
  font-size: 1.5rem;
  span {
    color: var(--primary-highlight);
  }
`;

const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const getDayString = () => {
  return DateTime.now().toFormat(isDev() ? "yyyy-MM-dd-hh-mm-ss" : "yyyy-MM-dd");
}

const toPlaceholder = (value, answer) =>
  [...value].reduce((placeholder, char) => {
    return placeholder.replace("_", char);
  }, answer.replace(/[^\s]/g, "_"));

const normalise = value => value.toLowerCase().replace(/[^a-z]/g, "");

//const TEST_TITLES = ["Property"]
//const HINTS = ["owner", "legal", "rights", "remove", "owned", "persons", "improve", "institute", "anthropology", "template"]

const TEST_TITLES = Object.keys(all_hints);
const HINTS = Object.values(all_hints);
const todays_ind = Math.floor(Math.random() * TEST_TITLES.length);

const TEST_TITLE = "Property"
const HINTS = ["owner", "legal", "rights", "remove", "owned", "persons", "improve", "institute", "anthropology", "template"]
const ATTEMPTS = 10

// TODO spaces don't appear too well in the clue
// Previous guesses don't have spaces

function App() {
  const dayString = useMemo(getDayString, []);
  // const [bracketWord, setBracketWord] = useState(bracketWords[Math.floor(seedrandom.alea(dayString)() * bracketWords.length)]);
  const [answer, setAnswer] = useState(normalise(TEST_TITLE));
  const [hints, setHints] = useState(HINTS);
  const [lastHint, setLastHint] = useState("");
  const [input, setInput] = useState("");
  const [guesses, addGuess] = useGuesses(dayString);
  const [end, setEnd] = useState(false);
  const [win, setWin] = useState(false);
  const inputRef = useRef(null);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13 && !end) {
      handleGuess();
    }
  };

  const handleGuess = (e) => {
    if (input === "") return;
    // if (input === "" || !/^[A-Za-z]+$/.test(input)) return;
    console.log("Handle guess")
    addGuess({word: normalise(input), hint: hints[guesses.length]});
    console.log(guesses)
    setInput("");
  }

  const placeholder = useMemo(() => toPlaceholder(input, answer), [
    input,
    answer
  ]);

  const maxLength = useMemo(() => normalise(answer).length, [answer]);

  const getHint = () => {
    if (guesses.length > hints.length - 1) {
      return "Out of hints!"
    }
    const hint = hints[guesses.length]
    return hint;
  }

  useEffect(() => {
    if (guesses.length > 0 && guesses[guesses.length-1].word == answer) {
      setEnd(true);
      setWin(true);
      toast('Congratulations! Great guess! 🥳', {autoClose: 5000})
      return;
    }
    if (guesses.length === 10) {
      toast(`Better luck next time! The answer is ${answer}`, {autoClose: 5000})
      setEnd(true);
    }
  },[guesses]);

  return (
    <Container>
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        autoClose={false}
      />
      <Title>Wikiguesser</Title>
      <InputArea>
        <HiddenInput
          ref={inputRef}
          onChange={handleInput}
          onKeyDown={handleEnter}
          value={input}
          maxLength={maxLength}
          autoFocus
          disabled={end}
        />
        <Placeholder onClick={() => inputRef.current.focus()}>{placeholder}</Placeholder>
      </InputArea>
      <Hint>Hint: <span>{getHint()}</span>, Guesses: <span>{ATTEMPTS-guesses.length}</span></Hint>
      <Buttons>
        <Button onClick={handleGuess} disabled={end}>Guess!</Button>
      </Buttons>
      <Guesses guesses={guesses}
               answer={answer}/>
    </Container>
  );
}

export default App;
