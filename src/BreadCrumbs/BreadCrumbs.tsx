import React from "react";
import styled from "styled-components";

const BreadCrumbsNode = styled.div`
  margin-left: 8px;
  display: flex;
`;

const BreadCrumbSeparator = styled.div`
  font-weight: 600;
  font-size: 1.2em;
  padding: 6px;
  margin: 6px 0;
  color: #aaa;
  user-select: none;
`;

const BreadCrumb = styled.div`
  padding: 8px;
  margin: 8px 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const BreadCrumbs: React.FC<{
  currentPath: string;
  setCurrentPath: Function
}> = ({
  currentPath,
  setCurrentPath,
}) => {
  const [,...breadCrumbs] = currentPath.split("/");
  breadCrumbs.pop();
  const setPath = (path: string = "") => {
    path = "/" + path;
    if (currentPath !== path) {
      setCurrentPath(path);
    }
  };

  return (
    <BreadCrumbsNode>
      <BreadCrumb
        onClick={() => {
          setPath();
        }}
      >
        root
      </BreadCrumb>
      <BreadCrumbSeparator>/</BreadCrumbSeparator>
      {breadCrumbs.map((crumb, index) => (
        <>
          {index !== 0 && (
            <BreadCrumbSeparator key={"separator" + index}>
              /
            </BreadCrumbSeparator>
          )}
          <BreadCrumb
            key={index}
            onClick={() => {
              setPath(breadCrumbs.slice(0, index + 1).join("/") + "/");
            }}
          >
            {crumb}
          </BreadCrumb>
        </>
      ))}
    </BreadCrumbsNode>
  );
};

export default BreadCrumbs;
