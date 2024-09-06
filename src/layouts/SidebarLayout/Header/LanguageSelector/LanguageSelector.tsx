import { useState } from "react";
import {
  Avatar,
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TooltipWrapper } from "../../../../components/Tooltip/TooltipWrapper";
import { useTranslation } from "react-i18next";
import {
  fetchLanguage,
  setLanguage,
} from "../../../../fetchers/locale-fetcher";
import { changeLanguage } from "i18next";
import { ILanguages } from "../../../../translations/i18n";

export const StyledSelect = styled(Select)(
  ({ theme }) => `
        text-align: center;
        background: 'red';
        &:hover {
          background-color: rgba(229, 232, 255, 0.8);
          color: white;
          border-radius: 10px;
          padding-top: 5px;
          padding-bottom: 5px;
        }
`
);

function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState<ILanguages>(
    fetchLanguage()
  );
  const [t] = useTranslation("common");

  const handleLanguageChange = (event: any) => {
    const language = event.target.value as ILanguages;
    setSelectedLanguage(language);
    changeLanguage(language);
    setLanguage(language);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    {
      value: ILanguages.DE,
      label: "germanflag",
      text: t("sidebar.languages.german"),
    },
    {
      value: ILanguages.EN,
      label: "usflag",
      text: t("sidebar.languages.english"),
    },
    {
      value: ILanguages.ES,
      label: "spainflag",
      text: t("sidebar.languages.spain"),
    },
    {
      value: ILanguages.FR,
      label: "franceflag",
      text: t("sidebar.languages.francais"),
    },
    {
      value: ILanguages.IT,
      label: "italyflag",
      text: t("sidebar.languages.italian"),
    },
    {
      value: ILanguages.PL,
      label: "polishflag",
      text: t("sidebar.languages.polish"),
    },
    {
      value: ILanguages.PT,
      label: "portugueseflag",
      text: t("sidebar.languages.portugal"),
    },
    {
      value: ILanguages.RO,
      label: "romaniaflag",
      text: t("sidebar.languages.romania"),
    },
    {
      value: ILanguages.TR,
      label: "turkishflag",
      text: t("sidebar.languages.turkish"),
    },
    {
      value: ILanguages.RU,
      label: "russiaflag",
      text: t("sidebar.languages.ruski"),
    },
    {
      value: ILanguages.CN,
      label: "chinaflag",
      text: t("sidebar.languages.china"),
    },
    {
      value: ILanguages.KR,
      label: "koreanflag",
      text: t("sidebar.languages.korean"),
    },
  ];

  const handleOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <Box pl={2}>
      <TooltipWrapper
        title={t("sidebar.switcher.changeLanguage")}
        arrow
        sx={{ zIndex: 15 }}
      >
        <FormControl variant="standard" sx={{ m: 0 }}>
          <StyledSelect
            labelId="demo-simple-select-standard-label"
            id="button-languageSelect"
            disableUnderline
            value={selectedLanguage}
            onOpen={handleOpen}
            onClose={handleClose}
            label="Language"
            onChange={handleLanguageChange}
            sx={{ zIndex: 20 }}
          >
            {languages.map((language) => (
              <MenuItem
                key={language.value}
                value={language.value}
                style={{ padding: 7 }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    variant="circular"
                    alt={language.label}
                    sx={{ width: 22, height: 22 }}
                    src={`/static/images/languages/${language.label}.png`}
                  />
                  {isDropdownOpen && (
                    <Typography
                      ml={1}
                      sx={{ display: { xs: "none", sm: "flex" } }}
                    >
                      {language.text}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
      </TooltipWrapper>
    </Box>
  );
}

export default LanguageSelector;
