import { styled } from "@mui/material/styles";
import login from '../../assets/images/login2.jpeg'

export const LoginContainer = styled("div")({
  display: "flex",
  height: "100vh", // ocupa toda a altura da tela
  width: "100vw",
});

export const LeftSide = styled("div")({
  flex: 1, // metade da tela
  backgroundImage: `url(${login})`, // pode trocar pela sua imagem
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

export const RightSide = styled("div")({
  flex: 1, // metade da tela
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  backgroundColor: "#f5f5f5", // cor neutra de fundo
});

export const FormWrapper = styled("div")({
  width: "100%",
  maxWidth: "400px", // largura máxima do formulário
});
