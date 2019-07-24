figma.showUI(__html__);

var textSelection = filterData(
  figma.currentPage.selection,
  i => i.type == "TEXT"
);

figma.ui.postMessage({
  type: "setSelectionMsg",
  value: `Selected ${figma.currentPage.selection.length} layers with ${
    textSelection.length
  } text layers`,
  count: textSelection.length
});

figma.ui.onmessage = async msg => {
  if (msg.type == "update-text") {
    var textSelection = filterData(
      figma.currentPage.selection,
      i => i.type == "TEXT"
    );
    console.log(textSelection);

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

function filterData(data, predicate) {
  return !!!data
    ? null
    : data.reduce((list, entry) => {
        let clone = null;
        if (predicate(entry)) {
          clone = entry;
          list.push(clone);
        } else if (entry.children != null) {
          let children = filterData(entry.children, predicate);
          if (children.length > 0) {
            list.push(...children);
          }
        }
        return list;
      }, []);
}
