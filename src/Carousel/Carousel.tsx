import React, {useState, useEffect} from "react";
import styled, {css} from "styled-components";
import { BsDownload, BsFolderFill } from "react-icons/bs";
import { VIEWS } from "../enum";
import { DirectoryContents } from "../scoutinator"
import RestUtil from "../RestUtil";
import NumberInput from "./NumberInput";

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
    transform: translate(0, calc(1.3em + (2.4em * 1.3)));
  }
`;

const Carousel: React.FC<{
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  directoryContents: DirectoryContents[];
}> = ({ setCurrentView, currentPath, setCurrentPath, directoryContents}) => {
  const directoryImages = directoryContents.filter(file => file.type === "image");
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [imageData, setImageData] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<number | "">(1);

  useEffect(() => {
    // TODO: Add debounce, for when typing in the input.
    if (typeof currentFile === "number") {
      const firstImage = currentPath + directoryImages[currentFile - 1].name;
      setImageData(RestUtil.getImageUrl(firstImage));
    }
  }, [currentFile, currentPath, directoryImages, setImageData]);

  useEffect(() => {
    const keyDownCarousel = (event: KeyboardEvent) => {
      console.log("WOWOOWWO");
      if (typeof currentFile === "number") {
        let newCurrentFile = 0;
        switch (event.code) {
          case "ArrowLeft":
            newCurrentFile = currentFile - 1;
            break;
          case "ArrowRight":
            newCurrentFile = currentFile + 1;
            break;
          default:
            // Do nothing
            return;
        }
        console.warn(
          newCurrentFile,
          newCurrentFile > 0 && newCurrentFile < directoryImages.length
        );
        if (newCurrentFile > 0 && newCurrentFile < directoryImages.length) {
          setCurrentFile(newCurrentFile);
        }
      }
    };

    window.addEventListener("keydown", keyDownCarousel);

    // cleanup this component
    return () => {
      window.removeEventListener("keydown", keyDownCarousel);
    };
  }, [currentFile, directoryImages.length]);

  const name =
    typeof currentFile === "number"
      ? directoryImages[currentFile - 1].name
      : "Could not get name";

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
          <div>{name}</div>
          <button>
            <BsDownload />
          </button>
        </CarouselHeader>
        <CarouselFooter>
          <NumberInput currentNumber={currentFile} setCurrentNumber={setCurrentFile} total={directoryImages.length} />
        </CarouselFooter>
      </Overlay>
      <ImageContainer
        onClick={() => {
          setControlsVisible(!controlsVisible);
        }}
      >
        {imageData ? <img src={imageData} alt={name} /> : "No image loaded..."}
      </ImageContainer>
    </CarouselContainer>
  );
};

export default Carousel;
