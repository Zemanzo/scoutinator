import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BsImageFill,
  BsSearch,
  BsArrowsExpand,
  BsArrowsCollapse
} from "react-icons/bs";
import DirectoryEntry from "./DirectoryEntry";
import BreadCrumbs from "./BreadCrumbs/BreadCrumbs";
import RestUtil from "../RestUtil";
import { VIEWS } from "../enum";
import { DirectoryContents } from "../scoutinator";

const FileBrowserRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const HeaderNode = styled.header`
  display: flex;
  color: #ccc;
`;
const DirectoryEntriesNode = styled.section`
  margin: 0 8px;
  color: #aaa;
  font-family: monospace;
  flex: 1;
  overflow-x: none;
  overflow-y: auto;
  padding: 4px 0;
  box-sizing: border-box;
  border-top: 1px solid #666;
  border-bottom: 1px solid #666;
  font-size: ${(props: { thicc: boolean }) => props.thicc ? "1.3em" : "1em"};
`;
const FooterNode = styled.footer`
  display: flex;

  > button {
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

const FileBrowser: React.FC<{
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  directoryContents: DirectoryContents[];
  setDirectoryContents: React.Dispatch<
    React.SetStateAction<DirectoryContents[]>
  >;
  setCurrentFile: React.Dispatch<React.SetStateAction<number | "">>;
}> = ({
  setCurrentView,
  currentPath,
  setCurrentPath,
  directoryContents,
  setDirectoryContents,
  setCurrentFile,
}) => {
  const [hasErrored, setHasErrored] = useState<boolean>(false);
  const [extraSpacing, setExtraSpacing] = useState<boolean>(false);
  const setCurrentPathWithSideEffect = (path: string) => {
    setCurrentFile(1);
    setCurrentPath(path);
  };

  useEffect(() => {
    RestUtil.getDirectory(currentPath).then((contents) => {
      if (contents.error) {
        setHasErrored(true);
        console.error(contents.error);
        return;
      }
      let imageIndex = 0;
      const indexedContents = contents.map((entry: DirectoryContents) => {
        if (entry.type === "image") {
          entry.imageIndex = imageIndex++;
        }
        return entry;
      });
      setDirectoryContents(indexedContents);
      setHasErrored(false);
    });
  }, [currentPath, setDirectoryContents, setHasErrored]);

  return (
    <FileBrowserRoot>
      <HeaderNode>
        <BreadCrumbs
          currentPath={currentPath}
          setCurrentPath={setCurrentPathWithSideEffect}
        />
      </HeaderNode>
      <DirectoryEntriesNode thicc={extraSpacing}>
        {hasErrored ? (
          <span>It brokey</span>
        ) : directoryContents.length > 0 ? (
          directoryContents.map((entry) => (
            <DirectoryEntry
              name={entry.name}
              type={entry.type}
              imageIndex={entry.imageIndex}
              currentPath={currentPath}
              setCurrentPath={setCurrentPathWithSideEffect}
              setCurrentFile={setCurrentFile}
              setCurrentView={setCurrentView}
              thicc={extraSpacing}
              key={entry.name}
            />
          ))
        ) : (
          <span>It's empty here...</span>
        )}
      </DirectoryEntriesNode>
      <FooterNode>
        <button
          onClick={() => {
            setExtraSpacing(!extraSpacing);
          }}
        >
          {extraSpacing ? <BsArrowsCollapse /> : <BsArrowsExpand />}
        </button>
        <button>
          <BsSearch />
        </button>
        <button
          onClick={() => {
            setCurrentView(VIEWS.CAROUSEL);
          }}
        >
          <BsImageFill />
        </button>
      </FooterNode>
    </FileBrowserRoot>
  );
};

export default FileBrowser;
