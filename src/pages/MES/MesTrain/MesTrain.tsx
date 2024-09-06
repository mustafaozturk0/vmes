import { Card, Divider, Grid } from "@mui/material";
import { FactoryTreeButtonGroup } from "../../../components/FactoryTreeView/FactoryTreeButtonGroup";
import FactoryTree from "../../../components/FactoryTreeView/FactoryTree";
import { VideoPlayer } from "../../Train/VideoPlayer/VideoPlayer";

export const MesTrain = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3} sm={6}>
        <Card sx={{ minHeight: 400 }}>
          <FactoryTreeButtonGroup />
          <Divider />
          <FactoryTree defaultExpanded={[]} />
        </Card>
      </Grid>
      <Grid item xs={12} md={9} sm={6}>
        <VideoPlayer showStage={true} width={640} />
      </Grid>
    </Grid>
  );
};
