import React, {useState, useEffect} from "react";
import styled, {css} from "styled-components";
import { BsDownload, BsFolderFill } from "react-icons/bs";
import { VIEWS } from "../enum";
import { DirectoryContents } from "../scoutinator"
import RestUtil from "../RestUtil";

const CarouselContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  cursor: pointer;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  & > img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const sharedOverlayProperties = css`
  background-color: #0009;
  backdrop-filter: blur(25px);
  transition: transform 0.22s ease;
  display: flex;
`;

const CarouselHeader = styled.header`
  ${sharedOverlayProperties}
  justify-content: space-between;

  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    font-family: "Sawarabi Gothic";
  }

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

const CarouselFooter = styled.footer`
  ${sharedOverlayProperties}
  justify-content: center;

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

const Overlay = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  ${(props: { controlsVisible: boolean }) =>
    props.controlsVisible ? controlsVisibleStyle : controlsNotVisibleStyle};
`;

const controlsVisibleStyle = css`
  ${CarouselHeader} {
    transform: translate(0, 0);
  }
  ${CarouselFooter} {
    transform: translate(0, 0);
  }
`;

const controlsNotVisibleStyle = css`
  ${CarouselHeader} {
    transform: translate(0, calc((1.5em + (1.2em * 1.5)) * -1));
  }
  ${CarouselFooter} {
    transform: translate(0, calc(1.5em + (1.2em * 1.5)));
  }
`;

const Carousel: React.FC<{
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  directoryContents: DirectoryContents[];
  setDirectoryContents: React.Dispatch<
    React.SetStateAction<DirectoryContents[]>
  >;
}> = ({ setCurrentView, currentPath, setCurrentPath, directoryContents, setDirectoryContents}) => {
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [imageData, setImageData] = useState<string>("");

  useEffect(() => {
    const firstImage = currentPath + directoryContents[0].name;
    RestUtil.getImage(firstImage).then((data) => {
      setImageData(URL.createObjectURL(data));
    });
  }, [currentPath, directoryContents, setImageData]);


  return (
    <CarouselContainer>
      <Overlay controlsVisible={controlsVisible}>
        <CarouselHeader>
          <button
            onClick={() => {
              setCurrentView(VIEWS.FILEBROWSER);
            }}
          >
            <BsFolderFill />
          </button>
          <div>{directoryContents[0].name}</div>
          <button>
            <BsDownload />
          </button>
        </CarouselHeader>
        <CarouselFooter>
          Some stuff goes here
        </CarouselFooter>
      </Overlay>
      <ImageContainer
        onClick={() => {
          setControlsVisible(!controlsVisible);
        }}
      >
        {imageData ? (
          <img src={imageData} alt={directoryContents[0].name} />
        ) : (
          "No image loaded..."
        )}
      </ImageContainer>
    </CarouselContainer>
  );
};

export default Carousel;
