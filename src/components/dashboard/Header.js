import { Typography,Box,useTheme } from "@mui/material";
import { tokens } from "./theme";

const Header = ({title,subtitle})=>{
    const colors = tokens;

    return (
    <Box mb="30px">
        <Typography     
            fontSize="32px"
            color={colors.grey[100]} 
            fontWeight="bold" 
            sx={{mb: "5px"}}
            >
            {title}
        </Typography>
        <Typography
            fontSize="16px" 
            color={colors.greenAccent[400]} 
            >
                {subtitle}</Typography>
    </Box>)
}

export default Header;