import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const BreadCrumbsNode = styled.div`
  margin-left: 8px;
  display: flex;
  overflow: hidden;
  position: relative;

  &::before {
    display: ${(props: { isOverflowing: boolean}) =>
      props.isOverflowing ? "block" : "none"};
    pointer-events: none;
    position: fixed;
    left: 8px;
    top: 0px;
    content: " ";
    width: 64px;
    height: 3em;
    background: linear-gradient(to left, transparent, #1e1e1e);
  }
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
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const BreadCrumbs: React.FC<{
  currentPath: string;
  setCurrentPath: (path: string) => void;
}> = ({ currentPath, setCurrentPath }) => {
  const [, ...breadCrumbs] = currentPath.split("/");
  breadCrumbs.pop();
  const setPath = (path: string = "") => {
    path = "/" + path;
    if (currentPath !== path) {
      setCurrentPath(path);
    }
  };

  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const updateScrollAndOverflow = () => {
    if (containerRef.current !== null) {
      setIsOverflowing(
        containerRef.current.scrollWidth > containerRef.current.clientWidth
      );
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
      return;
    }
    setIsOverflowing(false);
  };
  useEffect(updateScrollAndOverflow, [breadCrumbs, setIsOverflowing]);

  useEffect(() => {
    window.addEventListener("resize", updateScrollAndOverflow);
    return () => {
      window.removeEventListener("resize", updateScrollAndOverflow);
    };
  }, []);

  return (
    <BreadCrumbsNode ref={containerRef} isOverflowing={isOverflowing}>
      <BreadCrumb
        key="rootCrumb"
        onClick={() => {
          setPath();
        }}
      >
        root
      </BreadCrumb>
      <BreadCrumbSeparator key="rootSeparator">/</BreadCrumbSeparator>
      {breadCrumbs.map((crumb, index) => (
        <>
          {index !== 0 && (
            <BreadCrumbSeparator key={"separator" + crumb + index}>
              /
            </BreadCrumbSeparator>
          )}
          <BreadCrumb
            key={crumb + index}
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
