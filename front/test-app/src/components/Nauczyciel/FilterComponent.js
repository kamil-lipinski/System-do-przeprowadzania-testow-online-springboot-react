import React from "react";
import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: "text",
  size: props.small ? 5 : undefined
}))`
  height: 35px;
  width: 200px;
  border-radius: 3px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border: 1px solid #ccc;
  padding: 0 32px 0 16px;
`;

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  height: 35px;
  width: 35px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2a71ce;
  border: 0px;
  color: white;
  &:hover {
    background-color: #407bc8;
  }
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <Input
      id="search"
      type="text"
      placeholder="Filtruj wyniki..."
      value={filterText}
      onChange={onFilter} 
    />
    <ClearButton onClick={onClear}>X</ClearButton>
  </>
);

export default FilterComponent;
