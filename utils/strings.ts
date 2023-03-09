export function truncateMiddle(
  fullStr: string,
  strLen = 8,
  separator = "...",
  frontChars = 3,
  backChars = 4
) {
  if (fullStr.length <= strLen) return fullStr;

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
}
