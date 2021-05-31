import React, {useState} from "react";
import styled from "styled-components";
import {
  BsX,
} from "react-icons/bs";

const CarouselHeader = styled.header`
  display: flex;
  justify-content: flex-end;

  > button {
    appearance: none;
    line-height: 0;
    background: transparent;
    border: none;
    font-size: 1.5em;
    color: #ccc;
    padding: 0.6em;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      background-color: #fff2;
    }
  }
`;

const CrossIcon = styled(BsX)`
`;

const Carousel: React.FC<{
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setCurrentView, currentPath, setCurrentPath }) => {
  return (
    <>
      <CarouselHeader>
        <button>
          <CrossIcon />
        </button>
      </CarouselHeader>
    </>
  );
};

export default Carousel;
