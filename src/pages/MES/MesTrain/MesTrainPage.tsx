import { Card, Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../../components/PageTitleWrapper";
import PageTitle from "../../../components/PageTitleWrapper/PageTitle";
import { MesTrain } from "./MesTrain";
export const MesTrainPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>Khenda VMES | {t("train.page.train")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("train.page.train")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Card sx={{ marginTop: 2, paddingBottom: 2 }}>
          <MesTrain />
        </Card>
      </Container>
    </>
  );
};
