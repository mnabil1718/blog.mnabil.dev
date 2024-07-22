"use client";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";

export default function $prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() !== null) {
    return;
  }

  const heading = $createHeadingNode("h2");
  heading.append($createTextNode("Welcome to the Vanilla JS Lexical Demo!"));
  root.append(heading);
  const quote = $createQuoteNode();
  quote.append(
    $createTextNode(
      `In case you were wondering what the text area at the bottom is – it's the debug view, showing the current state of the editor. `
    )
  );
  root.append(quote);
  const paragraph = $createParagraphNode();
  paragraph.append(
    $createTextNode("This is a demo environment built with "),
    $createTextNode("lexical").toggleFormat("code"),
    $createTextNode("."),
    $createTextNode(" Try typing in "),
    $createTextNode("some text").toggleFormat("bold"),
    $createTextNode(" with "),
    $createTextNode("different").toggleFormat("italic"),
    $createTextNode(" formats."),
    $createTextNode(
      " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    )
  );
  root.append(paragraph);

  const heading2 = $createHeadingNode("h2");
  heading2.append($createTextNode("What is Lorem Ipsum?"));
  root.append(heading2);

  const paragraph2 = $createParagraphNode();
  paragraph2.append(
    $createTextNode(
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    )
  );
  root.append(paragraph2);

  const heading3 = $createHeadingNode("h3");
  heading3.append(
    $createTextNode(
      "There are many variations of passages of Lorem Ipsum available"
    )
  );
  root.append(heading3);

  const paragraph3 = $createParagraphNode();
  paragraph3.append(
    $createTextNode(
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    )
  );
  root.append(paragraph3);
}
