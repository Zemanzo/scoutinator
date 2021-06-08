import React, {useState} from "react";
import FileBrowser from "./FileBrowser/FileBrowser";
import Carousel from "./Carousel/Carousel";
import { VIEWS } from "./enum";
import { DirectoryContents } from "./scoutinator";


const Views: React.FC<{}> = () => {
  const [currentView, setCurrentView] = useState<string>(VIEWS.FILEBROWSER);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [directoryContents, setDirectoryContents] = useState<DirectoryContents[]>([]);

  switch (currentView) {
    case VIEWS.CAROUSEL:
      return (
        <Carousel
          setCurrentView={setCurrentView}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
          directoryContents={directoryContents}
          setDirectoryContents={setDirectoryContents}
        />
      );
    case VIEWS.FILEBROWSER:
    default:
      return (
        <FileBrowser
          setCurrentView={setCurrentView}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
          directoryContents={directoryContents}
          setDirectoryContents={setDirectoryContents}
        />
      );
  }
};

export default Views;
