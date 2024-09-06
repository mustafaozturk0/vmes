import { Box } from "@mui/material";
import { DarkModeSwitcher } from "../../../../components/DarkModeSwitcher/DarkModeSwitcher";
import LanguageSelector from "../LanguageSelector/LanguageSelector";

export function HeaderButtons() {
  return (
    <Box
      sx={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DarkModeSwitcher />
      <LanguageSelector />
    </Box>
  );
}

export default HeaderButtons;
