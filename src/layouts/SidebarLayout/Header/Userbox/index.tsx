import { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  Popover,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectCurrentUser,
  signOutAction,
} from "../../../../slices/auth/AuthSlice";
import { useAppDispatch } from "../../../../store/hooks";

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const [t] = useTranslation("common");
  const currentUser = useSelector(selectCurrentUser);

  const user = {
    name: currentUser?.username?.toUpperCase(),
    avatar: currentUser?.avatar,
    jobtitle: currentUser?.role,
  };

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const signOut = () => {
    dispatch(signOutAction()).then(() => {
      handleClose();
    });
  };

  return (
    <>
      <UserBoxButton
        id="button-userBox"
        color="secondary"
        ref={ref}
        onClick={handleOpen}
      >
        <Avatar variant="rounded" alt={user.name} src={user.avatar} />
        <Hidden mdDown>
          <UserBoxText>
            <Typography variant="subtitle2" sx={{ fontSize: 8 }}>
              {user.name}
            </Typography>
            <UserBoxDescription variant="body2">
              {user.jobtitle}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt={user.name} src={user.avatar} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user.jobtitle}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />

        <Box sx={{ m: 1 }}>
          <Button
            id="button-signOut"
            color="primary"
            fullWidth
            onClick={() => signOut()}
          >
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            {t("login.signout")}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
