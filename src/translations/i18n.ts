import i18next from "i18next";
import en from "./en.json";
import kr from "./kr.json";
import pl from "./pl.json";
import tr from "./tr.json";
import de from "./de.json";
import ro from "./ro.json";
import es from "./es.json";
import it from "./it.json";
import fr from "./fr.json";
import ru from "./ru.json";
import pt from "./pt.json";
import cn from "./cn.json";
import { fetchLanguage, setLanguage } from "../fetchers/locale-fetcher";

export enum ILanguages {
  EN = "en",
  KR = "kr",
  PL = "pl",
  TR = "tr",
  DE = "de",
  RO = "ro",
  ES = "es",
  IT = "it",
  FR = "fr",
  RU = "ru",
  PT = "pt",
  CN = "cn",
}

i18next.init({
  interpolation: { escapeValue: false },
  lng: fetchLanguage(),
  resources: {
    en: {
      common: en,
    },
    kr: {
      common: kr,
    },
    pl: {
      common: pl,
    },
    tr: {
      common: tr,
    },
    de: {
      common: de,
    },
    ro: {
      common: ro,
    },
    es: {
      common: es,
    },
    it: {
      common: it,
    },
    fr: {
      common: fr,
    },
    ru: {
      common: ru,
    },
    pt: {
      common: pt,
    },
    cn: {
      common: cn,
    },
  },
});

export const changeLanguage = (l: ILanguages) => {
  i18next.changeLanguage(l).finally(() => setLanguage(l));
};
