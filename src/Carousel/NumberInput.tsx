import React, { useState } from "react";
import styled from "styled-components";

const NumberInputNode = styled.input`
  background-color: ${(props: { hasError: boolean }) =>
    props.hasError ? "#f002" : "transparent"};
  appearance: textfield;
  border: none;
  border-bottom: 2px solid #fff2;
  margin-left: 0.2em;
  margin-right: 0.2em;
  background-color: transparent;
  color: #ccc;
  font-family: monospace;
  font-weight: bold;
  font-size: 1.3em;
  text-align: center;
  padding: 0.5em;
  max-width: 3ch;

  :focus {
    outline: none;
    border-bottom: 2px solid
      ${(props: { hasError: boolean }) => (props.hasError ? "#f005" : "#fff5")};
    background-color: ${(props: { hasError: boolean }) =>
      props.hasError ? "#f002" : "#fff2"};
  }

  ::-webkit-inner-spin-button {
    display: none;
  }
`;

const TotalDisplay = styled.span`
  font-family: monospace;
  font-weight: bold;
  font-size: 1.3em;
  text-align: center;
  padding: 0.5em;
`;

const NumberInput: React.FC<{
  currentNumber: number | "";
  setCurrentNumber: React.Dispatch<React.SetStateAction<number | "">>;
  total: number;
}> = ({currentNumber, setCurrentNumber, total}) => {
  const [inputError, setInputError] = useState<boolean>(false);

  const onBlurFooterInput = () => {
    setInputError(false);
  };

  const onInputFooterInput = (event: React.FormEvent<HTMLInputElement>) => {
    const nativeEvent = event.nativeEvent as InputEvent;
    const noDigitsRegularExpression = /\D/g;
    if (noDigitsRegularExpression.test(nativeEvent.data || "")) {
      event.currentTarget.value = String(currentNumber);
    }
  };

  const onChangeFooterInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setInputError(false);
      setCurrentNumber("");
      return;
    }
    const numberValue = parseInt(event.target.value);
    if (isNaN(numberValue) || numberValue < 1 || numberValue > total) {
      setInputError(true);
      console.error(numberValue);
      return;
    }

    setInputError(false);
    setCurrentNumber(numberValue);
  };

  return (
    <>
      <NumberInputNode
        type="number"
        step="1"
        pattern="[0-9]+"
        value={currentNumber}
        onBlur={onBlurFooterInput}
        onInput={onInputFooterInput}
        onChange={onChangeFooterInput}
        hasError={inputError}
      />
      <TotalDisplay>/ {total}</TotalDisplay>
    </>
  );
};

export default NumberInput;
