import { ILanguages } from "../translations/i18n";
import { ThemeModes } from "../theme/base";

const LocaleSessionStorageKey = "app-khenda-locale";
const ThemeStorageKey = "app-khenda-theme";
const UserResponseLocalStorageKey = "user-response";

export const fetchUserResponse = async () => {
  return JSON.parse(
    localStorage.getItem(UserResponseLocalStorageKey) as string
  );
};

export const clearUserResponse = async () => {
  localStorage.removeItem(UserResponseLocalStorageKey);
};
export const setUserResponse = async (userResponse: any) => {
  localStorage.setItem(
    UserResponseLocalStorageKey,
    JSON.stringify(userResponse)
  );
};

export const fetchLanguage = (): ILanguages => {
  const recordedLocale = localStorage.getItem(LocaleSessionStorageKey);

  if (recordedLocale) {
    return recordedLocale as ILanguages;
  }

  return ILanguages.EN;
};

export const setLanguage = (language: ILanguages) =>
  localStorage.setItem(LocaleSessionStorageKey, language.toString());

export const fetchThemeMode = (): ThemeModes => {
  return localStorage.getItem(ThemeStorageKey) === ThemeModes.Dark
    ? ThemeModes.Dark
    : ThemeModes.Light;
};

export const setThemeMode = (theme: ThemeModes) => {
  localStorage.setItem(ThemeStorageKey, theme.toString());
};
