import React, { useState, useEffect, useCallback, useRef } from "react";
import styled, {css} from "styled-components";
import { BsDownload, BsFolderFill } from "react-icons/bs";
import prettyBytes from "pretty-bytes";
import { useSwipeable } from "react-swipeable";

import { VIEWS, CAROUSEL_IMAGE_POSITION } from "../enum";
import { DirectoryContents } from "../scoutinator"
import RestUtil from "../RestUtil";
import Loader from "./Loader";
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
`;

const CarouselImage = styled.img`
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: contain;
  opacity: ${(props: { isLoading: boolean; position: string }) =>
    props.isLoading ? ".1" : "1"};
  ${(props: { isLoading: boolean; position: string}) => {
    switch (props.position) {
      case CAROUSEL_IMAGE_POSITION.BEFORE:
        return css`
          transform: translateX(-100%);
        `;
      case CAROUSEL_IMAGE_POSITION.VISIBLE:
        return "";
      case CAROUSEL_IMAGE_POSITION.AFTER:
        return css`
          transform: translateX(100%);
        `;
    }
  }}
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
  const [imageBeforeData, setImageBeforeData] = useState<string>("");
  const [imageMiddleData, setImageMiddleData] = useState<string>("");
  const [imageAfterData, setImageAfterData] = useState<string>("");
  const [nextOrPrevious, setNextOrPrevious] = useState<number>(0);
  const imageElementBefore = useRef<HTMLImageElement | null>(null);
  const imageElementMiddle = useRef<HTMLImageElement | null>(null);
  const imageElementAfter = useRef<HTMLImageElement | null>(null);
  const [imagePerformanceAttributes, setImagePerformanceAttributes] =
    useState<false | PerformanceResourceTiming>(false);

  const _getImageLoadedState = () => {
    return imageElementMiddle.current !== null && !(
      imageElementMiddle.current.complete && imageElementMiddle.current.naturalHeight !== 0
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
      const middleImageUrl = currentPath + directoryImages[currentFile - 1].name;
      const beforeImageUrl =
        currentFile > 1 ? currentPath + directoryImages[currentFile - 2].name : "";
      const afterImageUrl = currentFile < directoryImages.length ? currentPath + directoryImages[currentFile].name : "";
      setImageMiddleData(RestUtil.getImageUrl(middleImageUrl));
      setImageBeforeData(RestUtil.getImageUrl(beforeImageUrl));
      setImageAfterData(RestUtil.getImageUrl(afterImageUrl));
    }
  }, [currentFile, currentPath, directoryImages, setImageMiddleData]);


  const setCurrentFileClamped = useCallback(
    (newNumber: number) => {
      console.log(newNumber);
      if (newNumber > 0 && newNumber < directoryImages.length) {
        setCurrentFile(newNumber);
      }
    },
    [setCurrentFile, directoryImages.length]
  );

  useEffect(() => {
    if (imageElementMiddle.current !== null && typeof currentFile === "number") {
      const onTransitionEnd = () => {
        console.log("transitionEnded", nextOrPrevious);
        if (nextOrPrevious === -1) {
          setCurrentFileClamped(currentFile + 1);
        } else if (nextOrPrevious === 1) {
          setCurrentFileClamped(currentFile - 1);
        }
        setNextOrPrevious(0);
      };
      imageElementMiddle.current.addEventListener("transitionend", onTransitionEnd);
      return () => {
        if (imageElementMiddle.current !== null) {
          imageElementMiddle.current.removeEventListener(
            "transitionend",
            onTransitionEnd
          );
        }
      };
    }
  }, [imageElementMiddle, nextOrPrevious, currentFile, setCurrentFileClamped]);

  const handlers = useSwipeable({
    onSwipeStart: (eventData) => {
      if (
        imageElementMiddle.current !== null &&
        imageElementBefore.current !== null &&
        imageElementAfter.current !== null
      ) {
        imageElementMiddle.current.style.transition = "";
        imageElementBefore.current.style.transition = "";
        imageElementAfter.current.style.transition = "";
      }
    },
    onSwiping: (eventData) => {
      if (
        imageElementMiddle.current !== null &&
        imageElementBefore.current !== null &&
        imageElementAfter.current !== null
      ) {
        imageElementMiddle.current.style.transform = `translateX(${eventData.deltaX}px)`;
        imageElementBefore.current.style.transform = `translateX(calc(-100% + ${eventData.deltaX}px))`;
        imageElementAfter.current.style.transform = `translateX(calc(100% + ${eventData.deltaX}px))`;
      }
    },
    onSwiped: (eventData) => {
      console.log("done swiping!");
      if (
        imageElementMiddle.current !== null &&
        imageElementBefore.current !== null &&
        imageElementAfter.current !== null
      ) {
        let translation = 0;
        switch (eventData.dir) {
          case "Left":
            translation = -window.innerWidth;
            setNextOrPrevious(-1);
            break;
          case "Right":
            translation = window.innerWidth;
            setNextOrPrevious(1);
            break;
        }

        imageElementMiddle.current.style.transition = "transform .2s ease-out";
        imageElementBefore.current.style.transition = "transform .2s ease-out";
        imageElementAfter.current.style.transition = "transform .2s ease-out";
        setTimeout(function () {
          if (
            imageElementMiddle.current !== null &&
            imageElementBefore.current !== null &&
            imageElementAfter.current !== null
          ) {
            imageElementMiddle.current.style.transform = `translateX(${translation}px)`;
            imageElementBefore.current.style.transform = `translateX(calc(-100% + ${translation}px))`;
            imageElementAfter.current.style.transform = `translateX(calc(100% + ${translation}px))`;
          }
        }, 1);
      }
    }
  });

  const refPassthrough = (refElement: HTMLImageElement) => {
    handlers.ref(refElement);
    imageElementMiddle.current = refElement;
  };

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
        setCurrentFileClamped(newCurrentFile);
      }
    };

    window.addEventListener("keydown", keyDownCarousel);

    // cleanup this component
    return () => {
      window.removeEventListener("keydown", keyDownCarousel);
    };
  }, [currentFile, setCurrentFileClamped]);

  const name =
    typeof currentFile === "number" && directoryImages.length > 0
      ? directoryImages[currentFile - 1].name
      : "Could not get name";

  const onImageLoad = () => {
    console.log("done loading!");
    setIsLoading(false);
    if (
      imageElementMiddle.current !== null &&
      imageElementBefore.current !== null &&
      imageElementAfter.current !== null
    ) {
      imageElementMiddle.current.style.transition = "";
      imageElementMiddle.current.style.transform = "";
      imageElementBefore.current.style.transition = "";
      imageElementBefore.current.style.transform = "translateX(-100%)";
      imageElementAfter.current.style.transition = "";
      imageElementAfter.current.style.transform = "translateX(100%)";
    }
    setImagePerformanceAttributes(
      imageElementMiddle.current !== null &&
        imageElementMiddle.current.src !== "" &&
        (window.performance.getEntriesByName(
          imageElementMiddle.current.src,
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
        onClick={() => {
          setControlsVisible(!controlsVisible);
        }}
      >
        <CarouselImage
          src={imageBeforeData}
          ref={imageElementBefore}
          alt={imageBeforeData ? name : "No image loaded..."}
          onLoad={onImageLoad}
          isLoading={isLoading}
          position={CAROUSEL_IMAGE_POSITION.BEFORE}
        />
        <CarouselImage
          src={imageMiddleData}
          alt={imageMiddleData ? name : "No image loaded..."}
          onLoad={onImageLoad}
          isLoading={isLoading}
          position={CAROUSEL_IMAGE_POSITION.VISIBLE}
          {...handlers}
          ref={refPassthrough}
        />
        <CarouselImage
          src={imageAfterData}
          ref={imageElementAfter}
          alt={imageAfterData ? name : "No image loaded..."}
          onLoad={onImageLoad}
          isLoading={isLoading}
          position={CAROUSEL_IMAGE_POSITION.AFTER}
        />
      </ImageContainer>
    </CarouselContainer>
  );
};

export default Carousel;
