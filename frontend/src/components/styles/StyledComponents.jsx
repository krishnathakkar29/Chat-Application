import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";

export const orange = "#ea7070";
export const orangeLight = "rgba(234, 112, 112,0.2)";

export const grayColor = "rgba(247,247,247,1)";
export const lightBlue = "#2694ab";
export const matBlack = "#1c1c1c";
export const bgGradient = "linear-gradient(rgb(255 225 209), rgb(249 159 159))";

export const purple = "rgba(75,12,192,1)";
export const purpleLight = "rgba(75,12,192,0.2)";

const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${grayColor};
`;

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}));

export { VisuallyHiddenInput, Link, InputBox, BouncingSkeleton };
