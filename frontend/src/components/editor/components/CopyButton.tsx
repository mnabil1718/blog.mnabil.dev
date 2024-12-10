"use client";

import { $isCodeNode } from "@lexical/code";
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $setSelection,
  LexicalEditor,
} from "lexical";
import * as React from "react";
import { useState } from "react";

import { useDebounce } from "../utils/useDebounce";
import { Check, Copy } from "lucide-react";

interface Props {
  editor: LexicalEditor;
  getCodeDOMNode: () => HTMLElement | null;
}

export function CopyButton({ editor, getCodeDOMNode }: Props) {
  const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);

  const removeSuccessIcon = useDebounce(() => {
    setCopyCompleted(false);
  }, 1000);

  async function handleClick(e: any): Promise<void> {
    e.preventDefault();
    const codeDOMNode = getCodeDOMNode();

    if (!codeDOMNode) {
      return;
    }

    let content = "";

    editor.update(() => {
      const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

      if ($isCodeNode(codeNode)) {
        content = codeNode.getTextContent();
      }

      const selection = $getSelection();
      $setSelection(selection);
    });

    try {
      await navigator.clipboard.writeText(content);
      setCopyCompleted(true);
      removeSuccessIcon();
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  return (
    <button
      className="relative w-fit h-fit border border-transparent hover:border-gray-400 rounded-sm p-1 bg-none cursor-pointer flex-shrink-0 flex items-center text-white/50 uppercase"
      onClick={handleClick}
      aria-label="copy"
    >
      {/* THIS ABSOLUTE DIV IS TO TRICK MOUSE EVENT TO THINK ITS 
      HOVERING AN HTML ELEMENT BECAUSE IT CAN'T DETECT SVGs */}
      <div className="absolute inset-0"></div>
      {isCopyCompleted ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}
