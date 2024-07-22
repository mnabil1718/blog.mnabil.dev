"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import DefaultTheme from "./themes/DefaultTheme";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import LinkPlugin from "./plugins/LinkPlugin";

import "./styles/tailwind-style.css";

import ImagesPlugin from "./plugins/ImagesPlugin";
import { ImageNode } from "./nodes/ImageNode";
import TableOfContentsPlugin from "./plugins/TableOfContents";
import $prepopulatedRichText from "./utils/prepopulate-rich-text";

const placeholder = "Start writing...";

const editorConfig = {
  namespace: "Lexical Editor",
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
  ],
  onError(error: Error) {
    throw error;
  },
  theme: DefaultTheme,
  editable: false,
  editorState: $prepopulatedRichText,
};

export default function EditorReadOnly({
  showTableOfContents = false,
}: {
  showTableOfContents?: boolean;
}) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative w-full">
        {showTableOfContents && <TableOfContentsPlugin />}
        <div className="relative bg-white min-h-[375px] max-w-screen-sm mx-auto border-t">
          <RichTextPlugin
            placeholder={<div className="absolute">{placeholder}</div>}
            contentEditable={
              <ContentEditable
                className="editor-shell relative min-h-[375px] prose prose-sm resize-none caret-foreground [tab-size:1] outline-none py-7"
                aria-placeholder={placeholder}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ImagesPlugin />
          <ListPlugin />
          <LinkPlugin />
          <CheckListPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <TabIndentationPlugin />
          <AutoLinkPlugin />
          <CodeHighlightPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
