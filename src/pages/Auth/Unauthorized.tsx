import Container from "@mui/material/Container";
import Box from "@mui/system/Box";
import { Alert, Typography, Button } from "@mui/material";
import React from "react";
import { LockOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function Unauthorized() {
  const [t] = useTranslation("common");
  const navigate = useNavigate();
  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <Box m={5} textAlign="center">
          <Alert
            variant="filled"
            severity="warning"
            icon={<LockOutlined />}
            sx={{
              backgroundColor: "#f0ad4e",
              color: "#fff",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              {t("snackbar.unauthorized")}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                navigate("/overview", { replace: true });
              }}
            >
              {t("status.404.goToTheOverview")}
            </Button>
          </Alert>
        </Box>
      </Box>
    </Container>
  );
}
