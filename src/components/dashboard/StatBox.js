import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "./theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
    const colors = tokens;

    const numericProgress = parseFloat(progress);
    const isNegative = numericProgress < 0;
    const progresso = isNegative ? numericProgress * -1 : numericProgress;
  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography fontSize="20px" fontWeight="bold" sx={{ color: colors.grey[100] }}>
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progresso/100} isNegative={isNegative} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize="16px" sx={{ color: colors.greenAccent[400] }}>
          {subtitle}
        </Typography>
        <Typography fontSize="16px" fontStyle="italic" sx={{ color: colors.greenAccent[400] }}>
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
