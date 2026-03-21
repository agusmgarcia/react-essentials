function capitalize<TString extends string>(
  string: TString,
): Capitalize<TString> {
  return (string.charAt(0).toUpperCase() +
    string.slice(1)) as Capitalize<TString>;
}

const strings = { capitalize };
export default strings;
