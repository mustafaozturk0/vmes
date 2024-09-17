import { Delete, CloseSharp } from "@mui/icons-material";
import { Box, Typography, Divider, Container, IconButton } from "@mui/material";
import { useDeletePolygonMutation } from "../../../api/polygon/polygonApi";
import { debounce } from "lodash";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { usePolygons } from "../../../contexts/PolygonContext";
import { ChangeNameAccordion } from "./ChangeNameAccordion";
import { ChangeColorAccordion } from "./ChangeColorAccordion";

export const AreaSettings = () => {
  const [t] = useTranslation("common");
  const [deletePolygon, { isLoading: isDeleting }] = useDeletePolygonMutation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    polygons,
    setPolygons,
    selectedPolygonIndex,
    setSelectedPolygonIndex,
  } = usePolygons();

  const debounceDeletePolygon = debounce((polygonId) => {
    deletePolygon(polygonId)
      .unwrap()
      .then(() => {
        enqueueSnackbar(t("train.areaDialog.polygonDeleted"), {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar(t("train.areaDialog.polygonCouldntBeDeleted"), {
          variant: "error",
        });
      });
  }, 1000);

  const handleDeletePolygon = () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(t("train.areaDialog.wantToDeleteThisPolygon"))) return;
    else {
      setPolygons(
        polygons.filter((_, index) => index !== selectedPolygonIndex)
      );
      setSelectedPolygonIndex(null);

      debounceDeletePolygon(polygons[selectedPolygonIndex as number].id);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ flexWrap: "wrap" }}
      >
        <Typography variant="h5" gutterBottom>
          {t("train.areaDialog.areaSettings")}
        </Typography>
        <Box display="flex">
          <LoadingButton
            variant="outlined"
            size="small"
            color="error"
            startIcon={<Delete />}
            loading={isDeleting}
            fullWidth
            onClick={handleDeletePolygon}
          >
            {t("train.areaDialog.deleteArea")}
          </LoadingButton>
          <IconButton
            onClick={() => setSelectedPolygonIndex(null)}
            sx={{ marginLeft: "auto" }}
          >
            <CloseSharp />
          </IconButton>
        </Box>
      </Box>

      <Divider />
      <ChangeNameAccordion />
      <ChangeColorAccordion />
    </Container>
  );
};
