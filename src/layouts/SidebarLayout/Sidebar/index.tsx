import { useContext } from "react";
import {
  Box,
  Button,
  darken,
  Divider,
  Drawer,
  IconButton,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import SidebarMenu from "./SidebarMenu";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { MenuTwoTone } from "@mui/icons-material";
import Scrollbar from "../../../components/Scrollbar";
import { SidebarContext } from "../../../contexts/SidebarContext";
import { AppNames } from "../../../router";

const SidebarWrapper = styled(Box)(({ theme }) => ({
  color: theme.colors.alpha.trueWhite[70],
  position: "relative",
  zIndex: 7,
  height: "100%",
  paddingBottom: "68px",
  overflow: "hidden",
  minWidth: theme.sidebar.width,
  [theme.breakpoints.down("md")]: {
    minWidth: "300px",
    gap: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "100vw", // Full width on mobile
    paddingBottom: "48px",
  },
}));

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const theme = useTheme();
  const [t] = useTranslation("common");
  const navigate = useNavigate();
  const logoSmall = {
    width: 120,
    height: "auto",
    [theme.breakpoints.down("sm")]: {
      width: 100,
    },
  };
  return (
    <>
      <Drawer
        sx={{
          boxShadow: `${theme.sidebar.boxShadow}`,
          width: "100vw",
          [theme.breakpoints.down("sm")]: {
            width: "100vw", // Full width on mobile
          },
        }}
        open={sidebarToggle}
        variant="persistent"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background:
              theme.palette.mode === "dark"
                ? theme.colors.alpha.black[100]
                : darken(theme.colors.alpha.black[100], 0.5),
          }}
        >
          <Scrollbar>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start", // Align items in the same row
              }}
            >
              <IconButton onClick={toggleSidebar} sx={{ mx: 1 }}>
                <MenuTwoTone fontSize="small" color="primary" />
              </IconButton>
              <Button onClick={() => navigate("/overview")} sx={{ p: 0 }}>
                <img
                  src="/static/images/logo/khenda_dark_logo.png"
                  style={logoSmall}
                  alt="Logo"
                />
              </Button>
            </Box>
            <Divider
              sx={{
                background: theme.colors.alpha.trueWhite[10],
              }}
            />
            <SidebarMenu />
          </Scrollbar>
          <Divider
            sx={{
              background: theme.colors.alpha.trueWhite[30],
              margin: 0,
              padding: 0,
            }}
          />
          <Box
            sx={{
              pb: 2,
              position: "absolute",
              bottom: 0,
              width: "100%", // Full width on mobile
              textAlign: "center",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.colors.alpha.black[100]
                  : darken(theme.colors.alpha.black[100], 0.5),
            }}
          >
            <Typography variant="h5" color="primary">
              {process.env.REACT_APP_MODE === AppNames.Sentinel
                ? t("sidebar.app.sentinel")
                : t("sidebar.app.visionME")}
            </Typography>
          </Box>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
