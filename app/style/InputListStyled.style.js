import styled from "styled-components";

const InputListStyled = styled.div`
margin-top: 25px;
.list-group {
margin-left: 6%;
  .list-group-item {
    border-radius: 6px;
    border: none;
    width: 15vw;
  }
  input {
    background: #f5f6f7;
    padding: 9px 15px;
    border-radius: 6px;
    border: none;
    &:focus {
      background: #f5f6f7;
    }
  }
}

@media (max-width: 900px) {
  .list-group-item {
    width: 60vw!important;
  }
}
`;

export default InputListStyled;