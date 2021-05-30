import React from "react";
import styled from "styled-components";

const DirectoryEntryNode = styled.div`
  display: flex;
  margin: 2px 0;
  cursor: pointer;
  border-radius: 2px;
  user-select: none;

  &:hover span {
    text-decoration: underline;
  }

  background-color: ${(props: { type: string }) => {
    switch (props.type) {
      case "folder":
        return "#9ff1";
      case "file":
      default:
        return "initial";
    }
  }};
`;

const EntryIcon = styled.div`
  margin-right: 8px;
  margin-top: .4em;
  width: 0.8em;
  height: 0.4em;
  border-radius: 2px;

  background-color: ${(props: { type: string }) => {
    switch (props.type) {
      case "folder":
        return "#9ff";
      case "file":
      default:
        return "#ccc";
    }
  }};
`;

const DirectoryEntry: React.FC<{
  name: string;
  type: string;
  currentPath: string;
  setCurrentPath: Function;
}> = ({ name, type, currentPath, setCurrentPath, ...props }) => {
  return (
    <DirectoryEntryNode
      type={type}
      onClick={() => {
        if (type === "folder") {
          setCurrentPath(currentPath + name + "/");
        }
      }}
    >
      <EntryIcon type={type}>&nbsp;</EntryIcon>
      <span>{name}</span>
    </DirectoryEntryNode>
  );
};

export default DirectoryEntry;
