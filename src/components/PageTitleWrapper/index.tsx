import { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { Box, Container, styled, useMediaQuery, useTheme } from "@mui/material";

const PageTitle = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(1)};
`
);

interface PageTitleWrapperProps {
  children?: ReactNode;
  stickyHeader?: boolean;
}

const PageTitleWrapper: FC<PageTitleWrapperProps> = ({
  children,
  stickyHeader,
}) => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const stickyStyles = {
    position: "fixed",
    top: theme.header.height,
    zIndex: 1000,
    width: "100vw",
    background: theme.palette.background.paper,
  };

  if (isSmallScreen && stickyHeader) {
    return null;
  }

  return (
    <PageTitle
      className={stickyHeader ? "" : "MuiPageTitle-wrapper"}
      sx={stickyHeader ? stickyStyles : {}}
    >
      <Container maxWidth={"lg"}>{children}</Container>
    </PageTitle>
  );
};

PageTitleWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageTitleWrapper;
