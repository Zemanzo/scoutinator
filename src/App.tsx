import React, {useEffect, useState} from "react";
import styled from "styled-components";
import DirectoryEntry from "./DirectoryEntry";
import BreadCrumbs from "./BreadCrumbs/BreadCrumbs";
import RestUtil from "./RestUtil";
import "./App.css";

const AppRoot = styled.div`
  display: flex;
  flex-direction: column;
`;
const HeaderNode = styled.header`
  display: flex;
  color: #ccc;
`;
const DirectoryEntriesNode = styled.div`
  margin-left: 12px;
  color: #aaa;
  font-family: monospace;
`;

type DirectoryContents = {
  type: string,
  name: string
}


function App() {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [hasErrored, setHasErrored] = useState<boolean>(false);
  const [directoryContents, setDirectoryContents] =
    useState<DirectoryContents[]>([]);

  useEffect(() => {
    RestUtil.getDirectory(currentPath).then((contents) => {
      console.log(contents);
      if (contents.error) {
        setHasErrored(true);
        console.error(contents.error);
        return;
      }
      setDirectoryContents(contents);
      setHasErrored(false);
    });
  }, [currentPath]);


  return (
    <AppRoot>
      <HeaderNode>
        <BreadCrumbs
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
        />
      </HeaderNode>
      <DirectoryEntriesNode>
        {hasErrored ? (
          <span>It brokey</span>
        ) : directoryContents.length > 0 ? (
          directoryContents.map((entry) => (
            <DirectoryEntry
              name={entry.name}
              type={entry.type}
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              key={entry.name}
            />
          ))
        ) : (
          <span>It's empty here...</span>
        )}
      </DirectoryEntriesNode>
    </AppRoot>
  );
}

export default App;
