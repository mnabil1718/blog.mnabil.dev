"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from "lexical";
import {
  blockTypeToBlockName,
  rootTypeToRootName,
} from "@/components/editor/constants/toolbar-plugin";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createCodeNode } from "@lexical/code";
import {
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListChecks,
  ListOrdered,
  Quote,
  Text,
} from "lucide-react";

function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatCheckList = () => {
    if (blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  function getIconForSelectItem(blockType: string) {
    switch (blockType) {
      case "paragraph":
        return <Text size={12} />;

      case "h1":
        return <Heading1 size={12} />;

      case "h2":
        return <Heading2 size={12} />;

      case "h3":
        return <Heading3 size={12} />;

      case "h4":
        return <Heading4 size={12} />;

      case "h5":
        return <Heading5 size={12} />;

      case "h6":
        return <Heading6 size={12} />;

      case "bullet":
        return <List size={12} />;

      case "number":
        return <ListOrdered size={12} />;

      case "check":
        return <ListChecks size={12} />;

      case "quote":
        return <Quote size={12} />;

      case "code":
        return <Code2 size={12} />;

      default:
        return <Text size={12} />;
    }
  }

  function runFormatFunc(blockType: string) {
    switch (blockType) {
      case "paragraph":
        formatParagraph();
        break;

      case "h1":
        formatHeading("h1");
        break;

      case "h2":
        formatHeading("h2");
        break;

      case "h3":
        formatHeading("h3");
        break;

      case "h4":
        formatHeading("h4");
        break;

      case "h5":
        formatHeading("h5");
        break;

      case "h6":
        formatHeading("h6");
        break;

      case "bullet":
        formatBulletList();
        break;

      case "number":
        formatNumberedList();
        break;

      case "check":
        formatCheckList();
        break;

      case "quote":
        formatQuote();
        break;

      case "code":
        formatCode();
        break;

      default:
        formatParagraph();
        break;
    }
  }

  return (
    <Select
      value={blockType}
      onValueChange={(value) => runFormatFunc(value)}
      defaultValue={Object.keys(blockTypeToBlockName)[0]}
    >
      <SelectTrigger className="min-w-40 w-fit">
        <SelectValue placeholder="Block Type" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(blockTypeToBlockName).map((blockType: string) => {
          return (
            <SelectItem key={blockType} value={blockType}>
              <div className="flex flex-wrap items-center gap-1">
                {getIconForSelectItem(blockType)}{" "}
                {blockTypeToBlockName[blockType]}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default BlockFormatDropDown;
