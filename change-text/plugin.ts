var textSelection = filterData(
  figma.currentPage.selection,
  i => i.type == "TEXT"
);

figma.showUI(__html__, {
  width: 600,
  height: 300
});

if (!textSelection.length)
  figma.closePlugin("Please select a few layers and then run the plugin.");

figma.ui.postMessage({
  type: "setSelectionMsg",
  value: `Selected ${figma.currentPage.selection.length} layers with ${
    textSelection.length
  } text layers`,
  count: textSelection.length,
  selection: textSelection.map(i => i.characters)
});

figma.ui.onmessage = async msg => {
  console.log(msg);

  if (msg.type == "update-text") {
    console.log(textSelection);

    for (const text of textSelection) {
      await figma.loadFontAsync(text.fontName as FontName);
      if (text.type === "TEXT" && text.characters) {
        let exp = msg.match ? msg.match : text.characters;

        text.characters = text.characters.replace(
          new RegExp(
            exp.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
            msg.ignoreCase ? "ig" : "g"
          ),
          msg.value
        );
      }
    }
    figma.closePlugin("🎉");
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
