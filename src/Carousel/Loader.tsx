import React from "react";
import styled, { keyframes } from "styled-components";
import { BsSquareFill } from "react-icons/bs";

// Create the keyframes
const rotateA = keyframes`
  0% {transform: rotate(0deg);}
  25% {transform: rotate(90deg);}
  50% {transform: rotate(180deg);}
  75% {transform: rotate(270deg);}
  100% {transform: rotate(360deg);}
`;

const LoaderNode = styled.div`
  display: ${(props: { isLoading?: boolean }) =>
    props.isLoading ? "flex" : "none"};
  pointer-events: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  z-index: 10;

  > div {
    max-width: 10vw;
    max-height: 10vh;
    min-width: 3em;
    min-height: 3em;
    margin: auto;
    position: absolute;

    svg {
      position: absolute;
      width: 50%;
      height: 50%;
      transform-origin: 100% 100%;
      &:nth-child(1) {
        animation: ${rotateA} 3s ease infinite;
      }

      &:nth-child(2) {
        animation: ${rotateA} 3s -1s ease infinite;
      }

      &:nth-child(3) {
        animation: ${rotateA} 3s -2s ease infinite;
      }
    }
  }
`;

const Loader: React.FC<{ isLoading?: boolean }> = ({ isLoading = false }) => {
  //console.log(isLoading);
  return (
    <LoaderNode isLoading={isLoading}>
      <div>
        <BsSquareFill />
        <BsSquareFill />
        <BsSquareFill />
      </div>
    </LoaderNode>
  );
};

export default Loader;
