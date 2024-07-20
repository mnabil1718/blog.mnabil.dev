export const LowPriority = 1;

export const blockTypeToBlockName: Record<string, string> = {
  paragraph: "Normal",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  // h5: "Heading 5", // talwind typography doesn't have styles for these 2, so treat them as paragraph
  // h6: "Heading 6",
  bullet: "Bulleted List",
  number: "Numbered List",
  check: "Check List",
  quote: "Quote",
  code: "Code Block",
};

export const rootTypeToRootName = {
  root: "Root",
  table: "Table",
};
