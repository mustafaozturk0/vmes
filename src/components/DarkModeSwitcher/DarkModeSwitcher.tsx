import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTranslation } from "react-i18next";
import { setThemeMode } from "../../fetchers/locale-fetcher";
import { ThemeModes } from "../../theme/base";
import { ColorContext } from "../../contexts/ColorContext";
import { TooltipWrapper } from "../Tooltip/TooltipWrapper";

export function DarkModeSwitcher() {
  const [t] = useTranslation("common");
  const theme = useTheme();
  const colorMode = React.useContext(ColorContext);

  const changeColor = () => {
    colorMode.toggleColorMode();
    setThemeMode(
      theme.palette.mode === "dark" ? ThemeModes.Light : ThemeModes.Dark
    );
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
      }}
    >
      <TooltipWrapper
        title={
          theme.palette.mode === "dark"
            ? t("sidebar.switcher.lightMode")
            : t("sidebar.switcher.darkMode")
        }
        arrow
      >
        <IconButton
          id="switch-theme"
          sx={{ ml: 1 }}
          onClick={changeColor}
          color="inherit"
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon color="warning" />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </TooltipWrapper>
    </Box>
  );
}
