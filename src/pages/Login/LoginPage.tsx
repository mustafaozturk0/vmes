import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { styled } from "@mui/material/styles";
import LoginForm from "./LoginForm";
import { useTranslation } from "react-i18next";
import { DarkModeSwitcher } from "../../components/DarkModeSwitcher/DarkModeSwitcher";
import Logo from "../../components/LogoSign";
import LanguageSelector from "../../layouts/SidebarLayout/Header/LanguageSelector/LanguageSelector";

export const LoginWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
`
);

export const Footer = styled("div")(
  ({ theme }) => `
        background: none;
        width: 100%;
        color: lightgray;
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        @media (max-width: 600px) {
          display: none;
        }
`
);

export const ModeText = styled(Typography)(
  ({ theme }) => `
    font-size: 12px;
    margin-top: -20px;
    margin-left: 20px;
    font-style: italic;
    text-shadow: 0px 0px 5px ${
      theme.palette.mode === "light"
        ? theme.palette.background.default
        : theme.palette.grey[50]
    };
    text-align: end;
    color: ${
      theme.palette.mode === "light"
        ? theme.palette.grey[900]
        : theme.palette.grey[50]
    };
  }
`
);

function LoginPage() {
  const [t] = useTranslation("common");

  return (
    <>
      <Helmet>
        <title>Khenda VMES | {t("login.login")}</title>
      </Helmet>
      <LoginWrapper>
        <Container maxWidth="md" sx={{ background: "transparent" }}>
          <Box
            sx={{
              textAlign: "right",
              display: "inline-flex",
              justifyContent: "center",
              position: "fixed",
              right: 20,
              top: 10,
              zIndex: 1,
            }}
          >
            <DarkModeSwitcher />
            <Box style={{ marginTop: 5, marginRight: 10 }}>
              <LanguageSelector />
            </Box>
          </Box>

          <Box
            sx={{
              p: 15,
              mx: { xs: 2, sm: "auto" },
              px: { xs: 2, sm: 5 },
              backgroundImage: {
                xs: "none",
                md: "url(/static/images/backgrounds/login_bg.webp)",
              },
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: {
                xs: "unset",
                sm: "center",
              },
              maxWidth: "100%",
              marginTop: { xs: 0, sm: 3, md: 3, xl: 15 },
            }}
          >
            <Grid container mb={5}>
              <Grid
                item
                xs={12}
                md={6}
                textAlign={"center"}
                position={"relative"}
              >
                <Box
                  sx={{
                    position: { xs: "relative", md: "absolute" },
                    top: {
                      xs: 0,
                      md: 25,
                    },
                    left: {
                      xs: 0,
                      md: 25,
                    },
                  }}
                >
                  <Logo transparentBg loginPage width={240} />
                  <Typography variant="h4" mt={-2} fontStyle={"italic"} ml={15}>
                    {t("sidebar.app.visionME")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} display={"block"}>
                <LoginForm />
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Footer>
          <Divider />
          <Grid container px={3} py={1}>
            <Grid item xs={12} style={{ textAlign: "left" }}>
              <Typography variant="subtitle2">&copy; Khenda | 2024</Typography>
            </Grid>
          </Grid>
        </Footer>
      </LoginWrapper>
    </>
  );
}

export default LoginPage;
