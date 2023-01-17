import CopyToClipboard from "react-copy-to-clipboard";
import React, { useMemo } from "react";
import { DateTime } from "luxon";
import { ButtonStyle } from "../globalStyles";
import styled from "styled-components";
import { toast } from "react-toastify";

const FIRST_DAY_OF_WIKI = DateTime.fromFormat('January 16 2023', 'LLLL dd yyyy');

const Button = styled.button`
    ${ButtonStyle}
`;

const getShareString = (win, guesses) => {
  let string = "";
  if (win) {
    string += `I got it in ${guesses.length} ${guesses.length === 1 ? "guess" : "guesses"}! 🥳\n`;
  } else {
    string += `I didn't get today's! 🤷\n`;
  }
  return string;
}

export function Share({ win, guesses, end, dayString}) {
  const shareText = useMemo(() => {
    const currentDate = DateTime.now();
    const diffInDays = Math.floor(currentDate.diff(FIRST_DAY_OF_WIKI, 'days').toObject().days);
    let shareString = `#WikiGuesser #${diffInDays}\n`;
    shareString += getShareString(win, guesses);
    shareString += "https://www.wikiguesser.io";
    return shareString
  }, [guesses, dayString, win]);

  return (
    <CopyToClipboard
      text={shareText}
      onCopy={() => toast("Copied Results to Clipboard", { autoClose: 2000 })}
      options={{ format: "text/plain" }}
    >
      <Button disabled={!end}><span>Share Score</span></Button>
    </CopyToClipboard>
  )
}