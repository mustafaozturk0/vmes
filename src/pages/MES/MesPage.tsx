import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageTitle from "../../components/PageTitleWrapper/PageTitle";
import MachineStatus from "./MachineStatus";
export const MesPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>Khenda | {t("MES")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("MES")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <MachineStatus />
      </Container>
    </>
  );
};
