"use client";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import DefaultTheme from "@/components/editor/themes/DefaultTheme";
import ToolbarPlugin from "@/components/editor/plugins/ToolbarPlugin";
import ListMaxIndentLevelPlugin from "@/components/editor/plugins/ListMaxIndentPlugin";
import AutoLinkPlugin from "@/components/editor/plugins/AutoLinkPlugin";
import LinkPlugin from "@/components/editor/plugins/LinkPlugin";

import "@/components/editor/styles/lexical.css";
import { useEffect, useState } from "react";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import { CAN_USE_DOM } from "./utils/canUseDOM";

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
  ],
  onError(error: Error) {
    throw error;
  },
  theme: DefaultTheme,
};

export default function Editor() {
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative text-black text-left font-normal leading-5 my-5 mx-auto border w-full min-h-[375px] rounded-md">
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
        <div className="relative bg-white">
          <RichTextPlugin
            placeholder={
              <div className="absolute inline-block pointer-events-none select-none top-[17px] left-[12px] text-base overflow-ellipsis overflow-hidden text-gray-400">
                {placeholder}
              </div>
            }
            contentEditable={
              <div className="min-h-[375px] border-none flex relative outline-none z-0 overflow-auto resize-y">
                <div ref={onRef} className="flex-auto relative resize-y z-[-1]">
                  <ContentEditable
                    className="relative min-h-[375px] prose prose-sm resize-none text-base caret-foreground [tab-size:1] outline-none py-4 px-3"
                    aria-placeholder={placeholder}
                  />
                </div>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <CheckListPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <TabIndentationPlugin />
          <AutoLinkPlugin />
          {/* <ClickableLinkPlugin /> */}
          {floatingAnchorElem && !isSmallWidthViewport && (
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}
