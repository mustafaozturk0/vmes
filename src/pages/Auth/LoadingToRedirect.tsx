import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Container from "@mui/material/Container";
import Box from "@mui/system/Box";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setPrevLocationReducer } from "../../slices/location/locationSlice";

const LoadingToRedirect = () => {
  const [t] = useTranslation("common");
  const [count, setCount] = useState(2);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPrevLocationReducer(location.pathname));
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 500);
    if (count === 0) {
      navigate("/auth/signin");
    }
    return () => clearInterval(interval);
  }, [count, navigate]);

  return (
    <Container>
      <Box p={5}>
        <Typography>
          {t("login.unauth")}. {t("login.redirected")} {count}{" "}
          {t("login.loginSec")}
        </Typography>
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default LoadingToRedirect;
