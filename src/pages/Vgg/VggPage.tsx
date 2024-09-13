import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageTitle from "../../components/PageTitleWrapper/PageTitle";
import { Vgg } from "./Vgg";

export const VggPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>Khenda VMES | {t("VGG")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("VGG")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Vgg />
      </Container>
    </>
  );
};
