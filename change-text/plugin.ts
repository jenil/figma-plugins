figma.showUI(__html__);

figma.ui.postMessage({
  type: "setSelectionCount",
  value: figma.currentPage.selection.length
});
figma.ui.onmessage = async msg => {
  if (msg.type == "update-text") {
    const textSelection = figma.currentPage.selection.filter(
      i => i.type == "TEXT"
    ) as TextNode[];
    for (const text of textSelection) {
      await figma.loadFontAsync(text.fontName as FontName);
      if (text.type === "TEXT") {
        text.characters = msg.value || "";
      }
    }
    figma.closePlugin();
  } else {
    figma.closePlugin();
  }
};
