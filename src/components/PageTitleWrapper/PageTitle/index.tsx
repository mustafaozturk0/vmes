import { FC } from "react";
import PropTypes from "prop-types";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

interface PageTitleProps {
  heading?: string;
  subHeading?: string;
}

const PageTitle: FC<PageTitleProps> = ({
  heading = "",
  subHeading = "",
  ...rest
}) => {
  const [t] = useTranslation("common");
  const dispatch = useDispatch();

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        {...rest}
      >
        <Grid
          item
          xs={6}
          sm={6}
          sx={{
            marginBottom: { xs: 0 },
            textAlign: "left",
          }}
        >
          <Typography variant="h5">{heading}</Typography>
        </Grid>
      </Grid>
    </>
  );
};

PageTitle.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
};

export default PageTitle;
