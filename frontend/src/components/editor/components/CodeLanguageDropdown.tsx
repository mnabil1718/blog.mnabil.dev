"use client";

import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP } from "@lexical/code";
import { $getNodeByKey, LexicalEditor, NodeKey } from "lexical";

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const CodeLanguageDropdown = ({
  codeLanguage,
  activeEditor,
  selectedElementKey,
  disabled = false,
}: {
  codeLanguage: string;
  activeEditor: LexicalEditor;
  selectedElementKey: NodeKey | null;
  disabled?: boolean;
}) => {
  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  return (
    <Select
      disabled={disabled}
      value={codeLanguage}
      onValueChange={(value) => onCodeLanguageSelect(value)}
      defaultValue={CODE_LANGUAGE_OPTIONS[0][0]}
    >
      <SelectTrigger className="min-w-40 w-fit">
        <SelectValue placeholder="Block Type" />
      </SelectTrigger>
      <SelectContent>
        {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
          return (
            <SelectItem key={value} value={value}>
              {name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default CodeLanguageDropdown;
