import React, {useState} from "react";
import FileBrowser from "./FileBrowser/FileBrowser";
import Carousel from "./Carousel/Carousel";
import { VIEWS } from "./enum";

const Views: React.FC<{}> = () => {
  const [currentView, setCurrentView] = useState<string>(VIEWS.FILEBROWSER);
  const [currentPath, setCurrentPath] = useState<string>("/");

  switch (currentView) {
    case VIEWS.CAROUSEL:
      return (
        <Carousel
          setCurrentView={setCurrentView}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
        />
      );
    case VIEWS.FILEBROWSER:
    default:
      return (
        <FileBrowser
          setCurrentView={setCurrentView}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
        />
      );
  }
};

export default Views;
