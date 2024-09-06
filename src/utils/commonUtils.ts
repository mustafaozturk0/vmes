export const generateUUID = () => {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2)
  ).substring(0, 15);
};

export function deepSearchByKey(
  object: { [x: string]: any } | null,
  originalKey: string,
  originalValue: any,
  matches: { [x: string]: any }[] = []
) {
  if (object != null) {
    if (Array.isArray(object)) {
      for (let arrayItem of object) {
        deepSearchByKey(arrayItem, originalKey, originalValue, matches);
      }
    } else if (typeof object == "object") {
      for (let key of Object.keys(object)) {
        if (key === originalKey) {
          if (object[key] === originalValue) {
            matches.push(object);
          }
        } else {
          deepSearchByKey(object[key], originalKey, originalValue, matches);
        }
      }
    }
  }
  return matches;
}

export const formatDuration = (duration: number, noMilliSeconds?: boolean) => {
  let milliseconds = duration * 1000;
  let seconds = Math.floor(milliseconds / 1000);
  let hours: any = Math.floor(seconds / 3600);
  let minutes: any = Math.floor((seconds % 3600) / 60);
  let remainingSeconds: any = seconds % 60;
  let millisecondsPart = parseInt((milliseconds % 1000).toString());
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  remainingSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  const millisecondsPartString = noMilliSeconds ? "" : `.${millisecondsPart}`;
  return `${hours}:${minutes}:${remainingSeconds}${millisecondsPartString}`;
};
