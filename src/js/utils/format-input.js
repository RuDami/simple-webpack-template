export const formatRusSymbols = value => {
  if (!value) return value;
  return value.replace(/[^а-яА-ЯёЁ0-9\s\-N№".,()]/g, "").slice(0, 500)
};

export const formatPhone = value => {
  if (!value) return value;
  const onlyNums = value.replace(/[^\d]/gm, "");

  if (value === '+7') return ''
  if (onlyNums === '8') return '+7('
  if (onlyNums === '7') return '+7('
  if (onlyNums === '+') return '+7('
  if (onlyNums.length <= 1) return `+7(${onlyNums.slice(0, 2)}`;
  if (onlyNums.length <= 4) return `+7(${onlyNums.slice(1, 4)}`;
  if (onlyNums.length <= 7)
    return `+7(${onlyNums.slice(1, 4)}) ${onlyNums.slice(4, 7)}`;
  if (onlyNums.length <= 9)
    return `+7(${onlyNums.slice(1, 4)}) ${onlyNums.slice(4, 7)}-${onlyNums.slice(7, 9)}`
  return `+7(${onlyNums.slice(1, 4)}) ${onlyNums.slice(4, 7)}-${onlyNums.slice(7, 9)}-${onlyNums.slice(9, 11)}`;
};

export const formatEmail = value => {
  if (!value) return value;
  return value.replace(/[^a-zA-Z0-9._\-,;:@!#$%&'*+-/=?^`{|}~\d]/g, "");
}
