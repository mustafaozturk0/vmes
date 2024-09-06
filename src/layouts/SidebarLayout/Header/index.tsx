import { useContext } from "react";
import {
  alpha,
  Box,
  Divider,
  IconButton,
  Stack,
  styled,
  useTheme,
} from "@mui/material";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import HeaderButtons from "./Buttons";
import HeaderUserbox from "./Userbox";
import { useTranslation } from "react-i18next";
import Logo from "../../../components/LogoSign";
import { SidebarContext } from "../../../contexts/SidebarContext";
import { TooltipWrapper } from "../../../components/Tooltip/TooltipWrapper";

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background || "", 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
   
`
);

function Header() {
  const [t] = useTranslation("common");
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const theme = useTheme();

  return (
    <HeaderWrapper display="flex" alignItems="center">
      <Stack
        direction="row"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          />
        }
        alignItems="center"
        spacing={2}
      >
        <Box component="span">
          <TooltipWrapper arrow title={t("sidebar.switcher.toggleMenu")}>
            <IconButton id="button-toggleMenu" onClick={toggleSidebar}>
              <MenuTwoToneIcon fontSize="small" color="primary" />
            </IconButton>
          </TooltipWrapper>
        </Box>
        {!sidebarToggle && (
          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <Logo transparentBg width={120} />
          </Box>
        )}
      </Stack>
      <Box display="flex" alignItems="center">
        <HeaderButtons />
        <HeaderUserbox />
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
