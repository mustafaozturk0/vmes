import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../../components/PageTitleWrapper";
import PageTitle from "../../../components/PageTitleWrapper/PageTitle";
import { FalsePositives } from "./FalsePositives";

export const FalsePositivesPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>Khenda VMES | {t("False Positives")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("False Positives")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <FalsePositives />
      </Container>
    </>
  );
};
