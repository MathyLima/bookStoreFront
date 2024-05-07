import React from 'react';
import { Box, useTheme } from "@mui/material";
import { tokens } from "./theme";

const ProgressCircle = ({ progress = "0.75", size = "40", isNegative }) => {
    const colors = tokens;
    const angle = progress * 360;
  
  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%,transparent 56%),
        conic-gradient(transparent 0deg ${angle}deg, ${isNegative ? colors.redAccent[500] : colors.blueAccent[500]} ${angle}deg 360deg)
        ${colors.greenAccent[500]}`,
        borderRadius: "55%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
