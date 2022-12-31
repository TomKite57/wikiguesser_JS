import { css } from "styled-components";

export const ButtonStyle = css`
  padding: 1rem;
  border-radius: 10px;
  border-width: 0px;
  background-color: var(--primary-button-unpressed);
  color: var(--primary-text);
  font-size: x-large;
  :active {
    background-color: var(--primary-button-pressed);
  }
  font-family: inherit;
`;

