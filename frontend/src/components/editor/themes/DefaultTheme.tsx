const DefaultTheme = {
  code: "not-prose code-block",
  codeHighlight: {
    atrule: "token-attr",
    attr: "token-attr",
    boolean: "token-property",
    builtin: "token-selector",
    cdata: "token-comment",
    char: "token-selector",
    class: "token-function",
    "class-name": "token-function",
    comment: "token-comment",
    constant: "token-property",
    deleted: "token-property",
    doctype: "token-comment",
    entity: "token-operator",
    function: "token-function",
    important: "token-variable",
    inserted: "token-selector",
    keyword: "token-attr",
    namespace: "token-variable",
    number: "token-property",
    operator: "token-operator",
    prolog: "token-comment",
    property: "token-property",
    punctuation: "token-punctuation",
    regex: "token-variable",
    selector: "token-selector",
    string: "token-selector",
    symbol: "token-property",
    tag: "token-property",
    url: "token-operator",
    variable: "token-variable",
  },
  // heading: {
  //   h1: "mt-8 mb-4 text-xl font-bold tracking-tight leading-tight",
  //   h2: "mb-4 text-3xl text-gray-900 md:text-5xl lg:text-6xl",
  //   h3: "editor-heading-h3",
  //   h4: "editor-heading-h4",
  //   h5: "editor-heading-h5",
  // },
  // image: "editor-image",
  link: "prose-a:hover:cursor-pointer",
  list: {
    listitem: "my-0 mx-8",
    listitemChecked: "list-item-checked",
    listitemUnchecked: "list-item-unchecked",
    nested: {
      listitem: "list-none before:hidden after:hidden",
    },
    // ol: "editor-list-ol",
    // ul: "prose-ul:list-",
  },
  ltr: "text-left",
  // paragraph: "editor-paragraph",
  // placeholder: "editor-placeholder",
  // quote: "editor-quote",
  rtl: "text-right",
  text: {
    bold: "font-bold",
    code: "not-prose font-mono bg-gray-100 rounded-sm p-1 text-sm",
    hashtag: "editor-text-hashtag",
    italic: "italic",
    overflowed: "editor-text-overflowed",
    strikethrough: "line-through",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
  },
};

export default DefaultTheme;
