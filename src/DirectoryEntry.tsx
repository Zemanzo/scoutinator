import React from "react";
import styled, { css } from "styled-components";
import { BsFillFolderFill, BsFileEarmark, BsImageFill } from "react-icons/bs";

const DirectoryEntryNode = styled.div`
  display: flex;
  margin: 2px 0;
  cursor: pointer;
  border-radius: 2px;
  user-select: none;
  padding: ${(props: { type: string; thicc: boolean }) => props.thicc ? "4px" : ""} 0;

  &:hover span {
    text-decoration: underline;
  }

  ${(props: { type: string; thicc: boolean }) => {
    switch (props.type) {
      case "folder":
        return css`
          background-color: #44aaff16;
        `;
      case "image":
        return css`
          background-color: #99ff9909;
        `;
      case "file":
      default:
        return "";
    }
  }};
`;

const iconCss = css`
  transform: scale(0.8);
  margin-left: 4px;
  margin-right: 8px;
  border-radius: 2px;
  flex-shrink: 0;
`;

const FolderIcon = styled(BsFillFolderFill)`
  ${iconCss}
  color: #9ff;
`;

const FileIcon = styled(BsFileEarmark)`
  ${iconCss}
`;

const ImageIcon = styled(BsImageFill)`
  ${iconCss}
  color: #9f9;
`;

const hasImageExtension = (name: string) => {
  return [".jpg", ".jpeg", ".png", ".gif", "webp"].some(ext => name.endsWith(ext));
}

const DirectoryEntry: React.FC<{
  name: string;
  type: string;
  currentPath: string;
  setCurrentPath: Function;
  thicc: boolean;
}> = ({ name, type, currentPath, setCurrentPath, thicc }) => {
  if (type === "file" && hasImageExtension(name)) {
    type = "image";
  };

  return (
    <DirectoryEntryNode
      type={type}
      thicc={thicc}
      onClick={() => {
        if (type === "folder") {
          setCurrentPath(currentPath + name + "/");
        }
      }}
    >
      {type === "folder" && <FolderIcon />}
      {type === "file" && <FileIcon />}
      {type === "image" && <ImageIcon />}
      <span>{name}</span>
    </DirectoryEntryNode>
  );
};

export default DirectoryEntry;
