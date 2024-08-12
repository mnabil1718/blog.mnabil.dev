import {
  $cloneWithProperties,
  $sliceSelectedTextNodeContent,
} from "@lexical/selection";
import {
  $getRoot,
  $isElementNode,
  $isTextNode,
  BaseSelection,
  isHTMLElement,
  LexicalEditor,
  LexicalNode,
} from "lexical";

export function $generateHtmlFromNodes(
  editor: LexicalEditor,
  selection?: BaseSelection | null
): string {
  if (
    typeof document === "undefined" ||
    (typeof window === "undefined" && typeof global.window === "undefined")
  ) {
    throw new Error(
      "To use $generateHtmlFromNodes in headless mode please initialize a headless browser implementation such as JSDom before calling this function."
    );
  }

  const container = document.createElement("div");
  const root = $getRoot();
  const topLevelChildren = root.getChildren();

  for (let i = 0; i < topLevelChildren.length; i++) {
    const topLevelNode = topLevelChildren[i];
    $appendNodesToHTML(editor, topLevelNode, container, selection);
  }

  return container.innerHTML;
}

function $appendNodesToHTML(
  editor: LexicalEditor,
  currentNode: LexicalNode,
  parentElement: HTMLElement | DocumentFragment,
  selection: BaseSelection | null = null
): boolean {
  let shouldInclude =
    selection !== null ? currentNode.isSelected(selection) : true;
  const shouldExclude =
    $isElementNode(currentNode) && currentNode.excludeFromCopy("html");
  let target = currentNode;

  if (selection !== null) {
    let clone = $cloneWithProperties<LexicalNode>(currentNode);
    clone =
      $isTextNode(clone) && selection !== null
        ? $sliceSelectedTextNodeContent(selection, clone)
        : clone;
    target = clone;
  }
  const children = $isElementNode(target) ? target.getChildren() : [];
  const registeredNode = editor._nodes.get(target.getType());
  let exportOutput;

  // Use HTMLConfig overrides, if available.
  if (registeredNode && registeredNode.exportDOM !== undefined) {
    exportOutput = registeredNode.exportDOM(editor, target);
  } else {
    exportOutput = target.exportDOM(editor);
  }

  const { element, after } = exportOutput;

  if (!element) {
    return false;
  }

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < children.length; i++) {
    const childNode = children[i];
    const shouldIncludeChild = $appendNodesToHTML(
      editor,
      childNode,
      fragment,
      selection
    );

    if (
      !shouldInclude &&
      $isElementNode(currentNode) &&
      shouldIncludeChild &&
      currentNode.extractWithChild(childNode, selection, "html")
    ) {
      shouldInclude = true;
    }
  }

  if (shouldInclude && !shouldExclude) {
    if (isHTMLElement(element)) {
      element.append(fragment);
    }
    parentElement.append(element);

    if (after) {
      const newElement = after.call(target, element);
      if (newElement) {
        element.replaceWith(newElement);
      }
    }
  } else {
    parentElement.append(fragment);
  }

  return shouldInclude;
}
