import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::after, *::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  * {
   scroll-behavior: smooth;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
  html {
    @media (max-width: 1400px) {
      font-size: 93.75%;
    }
  }
  input, button, textarea {
    font-family: inherit;
  }
  body {
    text-rendering: optimizeLegibility;
    background: ${({ theme }) => theme.colors.gray41};
    color: ${({ theme }) => theme.colors.white};
  }
  button {
    cursor: pointer;
  }
`;
