"use client";

import { GripVertical } from "lucide-react";
//
// Using source file because in the future the DraggableBlockPlugin_EXPERIMENTAL
// plugin should be available from @lexical/react package, im copying this
// from lexical/playground repo manually as it is not yet ported to @lexical/react
//

import { DraggableBlockPlugin_EXPERIMENTAL } from "./source";
import { useRef } from "react";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div ref={menuRef} className="draggable-block-menu">
          <GripVertical size={16} className="text-foreground opacity-30" />
        </div>
      }
      targetLineComponent={
        <div ref={targetLineRef} className="draggable-block-target-line" />
      }
      isOnMenu={isOnMenu}
    />
  );
}
