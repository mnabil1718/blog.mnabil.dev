"use client";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { TableOfContentsEntry } from "@lexical/react/LexicalTableOfContentsPlugin";
import type { HeadingTagType } from "@lexical/rich-text";
import type { NodeKey } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TableOfContentsPlugin as LexicalTableOfContentsPlugin } from "@lexical/react/LexicalTableOfContentsPlugin";
import { useEffect, useRef, useState } from "react";
import * as React from "react";

const MARGIN_ABOVE_EDITOR = 250;
const HEADING_WIDTH = 9;

function indent(tagName: HeadingTagType) {
  if (tagName === "h2") {
    return "heading2";
  } else if (tagName === "h3") {
    return "heading3";
  } else if (tagName === "h4") {
    return "heading4";
  }
}

function isHeadingAtTheTopOfThePage(element: HTMLElement): boolean {
  const elementYPosition = element?.getClientRects()[0].y;
  return (
    elementYPosition >= MARGIN_ABOVE_EDITOR &&
    elementYPosition <= MARGIN_ABOVE_EDITOR + HEADING_WIDTH
  );
}

function isHeadingAboveViewport(element: HTMLElement): boolean {
  const elementYPosition = element?.getClientRects()[0].y;
  return elementYPosition < MARGIN_ABOVE_EDITOR;
}

function isHeadingBelowTheTopOfThePage(element: HTMLElement): boolean {
  const elementYPosition = element?.getClientRects()[0].y;
  return elementYPosition >= MARGIN_ABOVE_EDITOR + HEADING_WIDTH;
}

function TableOfContentsList({
  tableOfContents,
}: {
  tableOfContents: Array<TableOfContentsEntry>;
}): JSX.Element {
  const [selectedKey, setSelectedKey] = useState("");
  const selectedIndex = useRef(0);
  const [editor] = useLexicalComposerContext();

  function scrollToNode(key: NodeKey, currIndex: number) {
    editor.getEditorState().read(() => {
      const domElement = editor.getElementByKey(key);
      if (domElement !== null) {
        // Calculate the position of the element relative to the viewport
        const rect = domElement.getBoundingClientRect();
        const absoluteElementTop = rect.top + window.pageYOffset;
        const offset = 140; // Height of the navbar
        const offsetPosition = absoluteElementTop - offset;

        // Scroll to the calculated position with smooth behavior
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        setSelectedKey(key);
        selectedIndex.current = currIndex;
      }
    });
  }

  useEffect(() => {
    function scrollCallback() {
      if (
        tableOfContents.length !== 0 &&
        selectedIndex.current < tableOfContents.length - 1
      ) {
        let currentHeading = editor.getElementByKey(
          tableOfContents[selectedIndex.current][0]
        );
        if (currentHeading !== null) {
          if (isHeadingBelowTheTopOfThePage(currentHeading)) {
            //On natural scroll, user is scrolling up
            while (
              currentHeading !== null &&
              isHeadingBelowTheTopOfThePage(currentHeading) &&
              selectedIndex.current > 0
            ) {
              const prevHeading = editor.getElementByKey(
                tableOfContents[selectedIndex.current - 1][0]
              );
              if (
                prevHeading !== null &&
                (isHeadingAboveViewport(prevHeading) ||
                  isHeadingBelowTheTopOfThePage(prevHeading))
              ) {
                selectedIndex.current--;
              }
              currentHeading = prevHeading;
            }
            const prevHeadingKey = tableOfContents[selectedIndex.current][0];
            setSelectedKey(prevHeadingKey);
          } else if (isHeadingAboveViewport(currentHeading)) {
            //On natural scroll, user is scrolling down
            while (
              currentHeading !== null &&
              isHeadingAboveViewport(currentHeading) &&
              selectedIndex.current < tableOfContents.length - 1
            ) {
              const nextHeading = editor.getElementByKey(
                tableOfContents[selectedIndex.current + 1][0]
              );
              if (
                nextHeading !== null &&
                (isHeadingAtTheTopOfThePage(nextHeading) ||
                  isHeadingAboveViewport(nextHeading))
              ) {
                selectedIndex.current++;
              }
              currentHeading = nextHeading;
            }
            const nextHeadingKey = tableOfContents[selectedIndex.current][0];
            setSelectedKey(nextHeadingKey);
          }
        }
      } else {
        selectedIndex.current = 0;
      }
    }
    let timerId: ReturnType<typeof setTimeout>;

    function debounceFunction(func: () => void, delay: number) {
      clearTimeout(timerId);
      timerId = setTimeout(func, delay);
    }

    function onScroll(): void {
      debounceFunction(scrollCallback, 5);
    }

    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, [tableOfContents, editor]);

  return (
    <div className="table-of-contents hidden xl:block h-full absolute top-0 left-0 xl:left-7 z-10 w-fit">
      <div className="sticky top-[70px] p-4 w-fit h-fit space-y-2">
        <h2 className="font-bold">Table of Contents</h2>
        <ul className="headings">
          {tableOfContents.map(([key, text, tag], index) => {
            return (
              <div className="normal-heading-wrapper" key={key}>
                <div
                  onClick={() => scrollToNode(key, index)}
                  role="button"
                  className={indent(tag)}
                  tabIndex={0}
                >
                  <li
                    className={`normal-heading line-clamp-2 ${
                      selectedKey === key
                        ? "relative text-foreground font-semibold"
                        : "text-muted-foreground"
                    }
                  `}
                  >
                    {text}
                  </li>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function TableOfContentsPlugin() {
  return (
    <LexicalTableOfContentsPlugin>
      {(tableOfContents) => {
        return (
          <>
            {tableOfContents.length > 0 && (
              <TableOfContentsList tableOfContents={tableOfContents} />
            )}
          </>
        );
      }}
    </LexicalTableOfContentsPlugin>
  );
}
