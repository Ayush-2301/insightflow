import styled from "styled-components";
import { styled as themeStyled } from "@react-tabtab-next/tabtab";

let { TabList, ActionButton, Tab, Panel } = themeStyled;

TabList = styled(TabList)`
  background-color: transparent;
  line-height: 1.2;
  border: 0;
`;

Tab = styled(Tab)`
  padding: 5px 10px;
  position: relative;
  font-size: 14px;
  border: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  ${(props) => {
    return props.active && !props.vertical
      ? `
      border-bottom: 2px solid #35185A;
    `
      : null;
  }}
  &:hover .tab-label_close-button {
    opacity: 1;
  }
  & svg {
    font-size: 20px;
  }
  &:hover svg {
    color: #35185a;
  }
  &:hover {
    color: unset;
    background: #89898920;
  }
`;

ActionButton = styled(ActionButton)`
  background-color: transparent;
  border-radius: 0;
  border: none;
  opacity: 0.3;
  transition: opacity 0.2s;
  & svg {
    font-size: 24px;
    padding: 0;
  }
  &:hover {
    opacity: 1;
    color: #35185a;
  }
`;

Panel = styled(Panel)`
  border-top: 1px solid gray;
`;

export { TabList, ActionButton, Tab, Panel };
