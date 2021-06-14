import React, {useState, useEffect} from "react";
import styled, {css} from "styled-components";
import { BsDownload, BsFolderFill } from "react-icons/bs";
import prettyBytes from "pretty-bytes";

import { VIEWS } from "../enum";
import { DirectoryContents } from "../scoutinator"
import RestUtil from "../RestUtil";
import Loader from "./Loader";
import NumberInput from "./NumberInput";
import { useRef } from "react";

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
  display: flex;
  justify-content: center;
  align-items: center;

  & > img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    opacity: ${(props: { isLoading: boolean }) => props.isLoading ? ".1" : "1"};
  }
`;

const sharedOverlayProperties = css`
  background-color: #0009;
  backdrop-filter: blur(25px);
  transition: transform 0.22s ease;
  display: flex;
  pointer-events: auto;
`;

const CarouselHeader = styled.header`
  ${sharedOverlayProperties}
  justify-content: space-between;

  > h1 {
    margin: .88em 1em 0 1em;
    flex: 1;
    line-height: 100%;
    align-items: center;
    font-size: 1.2em;
    font-family: "Sawarabi Gothic";
    font-weight: normal;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: visible;
    text-overflow: ellipsis;
    text-align: center;
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
  justify-content: space-between;
  padding: .3em 0;

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

const ImageAttributes = styled.div`
  font-size: 1.1em;
  font-weight: bold;
  color: #888;
  text-shadow: #0009 1px 1px 1px;
  display: flex;
  align-items: center;

  > span {
    margin-right: 0.5em;
    padding: 0.2em 0.4em;
    background-color: #fff1;
    border-radius: 5px;
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
  z-index: 2;

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
    transform: translate(0, calc(1.3em + (1.6em * 1.3)));
  }
`;

const Carousel: React.FC<{
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  currentFile: number | "";
  setCurrentFile: React.Dispatch<React.SetStateAction<number | "">>;
  directoryContents: DirectoryContents[];
  initialFile?: number;
}> = ({
  setCurrentView,
  currentPath,
  setCurrentPath,
  currentFile,
  setCurrentFile,
  directoryContents,
}) => {
  const directoryImages = directoryContents.filter(
    (file) => file.type === "image"
  );
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageData, setImageData] = useState<string>("");
  const imageElement = useRef<HTMLImageElement>(null);
  const [imagePerformanceAttributes, setImagePerformanceAttributes] =
    useState<false | PerformanceResourceTiming>(false);
  const _getImageLoadedState = () => {
    return imageElement.current !== null && !(
      imageElement.current.complete && imageElement.current.naturalHeight !== 0
    );
  }

  useEffect(() => {
    // TODO: Add debounce, for when typing in the input.
    if (
      typeof currentFile === "number" &&
      directoryImages.length > 0
    ) {
      console.log("getting image!");

      let loadIconDelay;
      if (_getImageLoadedState()) {
        loadIconDelay = setTimeout(() => {
          setIsLoading(_getImageLoadedState());
        }, 300);
      } else {
        clearTimeout(loadIconDelay);
        setIsLoading(_getImageLoadedState());
      }
      const firstImage = currentPath + directoryImages[currentFile - 1].name;
      setImageData(RestUtil.getImageUrl(firstImage));
    }
  }, [currentFile, currentPath, directoryImages, setImageData]);

  useEffect(() => {

  }, [imageData, setImagePerformanceAttributes]);

  useEffect(() => {
    const keyDownCarousel = (event: KeyboardEvent) => {
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
  }, [currentFile, setCurrentFile, directoryImages.length]);

  const name =
    typeof currentFile === "number" && directoryImages.length > 0
      ? directoryImages[currentFile - 1].name
      : "Could not get name";

  const onImageLoad = () => {
    console.log("done loading!");
    setIsLoading(false);
    setImagePerformanceAttributes(
      imageElement.current !== null &&
        imageElement.current.src !== "" &&
        (window.performance.getEntriesByName(
          imageElement.current.src,
          "resource"
        )[0] as PerformanceResourceTiming)
    );
  }

  const prettyBytesSettings = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

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
          <h1>{name}</h1>
          <button>
            <BsDownload />
          </button>
        </CarouselHeader>
        <CarouselFooter>
          <NumberInput
            currentNumber={currentFile}
            setCurrentNumber={setCurrentFile}
            total={directoryImages.length}
          />
          {imagePerformanceAttributes && (
            <ImageAttributes>
              <span title="HTTP transfer file size">
                {prettyBytes(
                  imagePerformanceAttributes.transferSize,
                  prettyBytesSettings
                )}
              </span>
              <span title="Decoded (actual) file size">
                {prettyBytes(
                  imagePerformanceAttributes.decodedBodySize,
                  prettyBytesSettings
                )}
              </span>
            </ImageAttributes>
          )}
        </CarouselFooter>
        <Loader isLoading={isLoading} />
      </Overlay>
      <ImageContainer
        isLoading={isLoading}
        onClick={() => {
          setControlsVisible(!controlsVisible);
        }}
      >
        <img
          src={imageData}
          ref={imageElement}
          alt={imageData ? name : "No image loaded..."}
          onLoad={onImageLoad}
        />
      </ImageContainer>
    </CarouselContainer>
  );
};

export default Carousel;
