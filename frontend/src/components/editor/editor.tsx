"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  InitialEditorStateType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import CodeActionMenuPlugin from "./plugins/CodeActionMenuPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import DefaultTheme from "./themes/DefaultTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin/DraggableBlockPlugin";

import "./styles/tailwind-style.css";

import { CAN_USE_DOM } from "./utils/canUseDOM";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import DragDropPaste from "./plugins/DragDropPaste";
import ImagesPlugin from "./plugins/ImagesPlugin";
import { ImageNode } from "./nodes/ImageNode";
import { EditorState, LexicalEditor } from "lexical";
import { cn } from "@/lib/utils";
import { EMPTY_STATE } from "./constants/state";

const placeholder = "Start writing...";

const Placeholder = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="absolute inline-block pointer-events-none select-none top-[17px] left-[29px] text-base overflow-ellipsis overflow-hidden text-gray-400">
      {placeholder}
    </div>
  );
};

const ContentEditableWrapper = ({
  onRef,
}: {
  onRef: (_floatingAnchorElem: HTMLDivElement) => void;
}) => {
  return (
    <div className="min-h-[450px] flex relative outline-none z-0 overflow-auto soft-scroll">
      <div ref={onRef} className="flex-auto relative z-[-1]">
        {/* override prose max width to fill parent container 
        see : https://github.com/tailwindlabs/tailwindcss-typography#overriding-max-width */}
        <ContentEditable
          className="editor-shell relative max-h-[450px] prose max-w-none prose-sm resize-none caret-foreground [tab-size:1] outline-none py-4 px-7"
          aria-placeholder={placeholder}
        />
      </div>
    </div>
  );
};

interface EditorProps {
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>
  ) => void;
  initState?: InitialEditorStateType;
  className?: string;
}

const Editor = React.forwardRef((props: EditorProps, ref: any) => {
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
    editorState: !!props.initState ? props.initState : EMPTY_STATE, // empty string ("") will be considered falsy
  };

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
      <div className={cn("relative h-full rounded-md", props.className)}>
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
        <div className="relative bg-white">
          <RichTextPlugin
            placeholder={<Placeholder placeholder={placeholder} />}
            contentEditable={<ContentEditableWrapper onRef={onRef} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={props.onChange} />
          <DragDropPaste />
          <ImagesPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <CheckListPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <TabIndentationPlugin />
          <AutoLinkPlugin />
          <CodeHighlightPlugin />
          {floatingAnchorElem && (
            <>
              <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
              <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
              <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            </>
          )}
        </div>
      </div>
    </LexicalComposer>
  );
});

Editor.displayName = "Editor";

export default Editor;
