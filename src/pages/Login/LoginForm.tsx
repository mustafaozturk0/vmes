import { LoadingButton } from "@mui/lab";
import { Box, Container, IconButton, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LoginSharp, Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../../api/auth/authApi";
import { useSnackbar } from "notistack";
import { LoginDto } from "../../api/swagger/swagger.api";
import { useSelector } from "react-redux";
import { prevLocationSelector } from "../../slices/location/locationSlice";

const CustomTextField = styled(TextField)`
  ${({ theme }) => `
    color: ${theme.palette.success.contrastText};
    font-size: ${theme.typography.pxToRem(14)};
    margin-bottom: ${theme.spacing(2)};
  `}
`;

const CustomLoadingButton = styled(LoadingButton)`
  ${({ theme }) => `
  
    color: ${theme.colors.alpha.trueWhite};
  `}
`;

function LoginForm() {
  const [t] = useTranslation("common");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>();
  const [loginUser, { isLoading: isLoginLoading, isSuccess: isLoginSuccess }] =
    useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const prevLocation = useSelector(prevLocationSelector);

  useEffect(() => {
    if (isLoginSuccess) {
      const from = prevLocation?.prevLocation || "/overview";
      navigate(from, { replace: true });
    }
  }, [isLoginSuccess]);

  const onSubmit: SubmitHandler<LoginDto> = (data) => {
    loginUser(data)
      .unwrap()
      .catch((error) => {
        enqueueSnackbar(t("login.error"), {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    if (isLoginSuccess) {
      navigate("/overview", { replace: true });
    }
  }, [isLoginSuccess]);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ textAlign: "center", paddingTop: 7 }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid" }}>
          <CustomTextField
            id="input-username"
            required
            label={t("login.username")}
            {...register("username")}
          />
          <CustomTextField
            id="input-password"
            required
            label={t("login.password")}
            type={showPassword ? "text" : "password"}
            {...register("password", { required: true })}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label={
                    showPassword
                      ? t("login.hidePassword")
                      : t("login.showPassword")
                  }
                  onClick={handlePasswordVisibility}
                  edge="end"
                  sx={{ color: "inherit", opacity: 0.5 }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          {errors.password && <span> {t("login.required")} </span>}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <CustomLoadingButton
              id="button-signIn"
              size="large"
              endIcon={<LoginSharp />}
              variant="contained"
              type="submit"
              loading={isLoginLoading}
              sx={{ marginBottom: { xs: 1, sm: 0 } }}
            >
              {t("login.signin")}
            </CustomLoadingButton>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default LoginForm;
