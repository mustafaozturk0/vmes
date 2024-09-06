import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageTitle from "../../components/PageTitleWrapper/PageTitle";
import Machines from "./Machines";

export const MachinesPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>Khenda VMES | {t("sidebar.buttons.machines")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("MES")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Machines />
      </Container>
    </>
  );
};
