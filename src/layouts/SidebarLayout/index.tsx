import { FC, ReactNode, useContext } from "react";
import { alpha, Backdrop, Box, lighten, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarContext } from "../../contexts/SidebarContext";

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = () => {
  const theme = useTheme();

  const { sidebarToggle } = useContext(SidebarContext);

  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: "100%",

          ".MuiPageTitle-wrapper": {
            background:
              theme.palette.mode === "dark"
                ? theme.colors.alpha.trueWhite[5]
                : theme.colors.alpha.white[50],
            marginBottom: `${theme.spacing(2)}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 1px 0 ${alpha(
                    lighten(theme.colors.primary.main, 0.7),
                    0.15
                  )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
                : `0px 2px 4px -3px ${alpha(
                    theme.colors.alpha.black[100],
                    0.1
                  )}, 0px 5px 12px -4px ${alpha(
                    theme.colors.alpha.black[100],
                    0.05
                  )}`,
          },
        }}
      >
        <Header />
        <Sidebar />
        <Box
          sx={{
            position: "relative",
            zIndex: 5,
            pl: sidebarToggle ? 25 : 0,
            display: "block",
            flex: 1,
            pt: `${theme.header.height}`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "bottom",
            height: `100%`,
          }}
        >
          <Box display="block">
            <Outlet />
          </Box>
          <Backdrop
            open={sidebarToggle && window.innerWidth < 600}
            sx={{
              zIndex: 4,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              backgroundColor: alpha(theme.palette.background.default, 0.5),
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default SidebarLayout;
