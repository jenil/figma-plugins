document.getElementById("update").onclick = () => {
  const match = document.getElementById("matchVal") as HTMLInputElement;
  const textbox = document.getElementById("value") as HTMLInputElement;
  parent.postMessage(
    {
      pluginMessage: {
        type: "update-text",
        value: textbox.value,
        match: match.value
      }
    },
    "*"
  );
};

document.getElementById("cancel").onclick = () => {
  parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
};
onmessage = event => {
  console.log("Selected layers: ", event.data.pluginMessage.count);
  if (event.data.pluginMessage.type == "setSelectionMsg") {
    if (event.data.pluginMessage.count > 0) {
      document.getElementById("count").innerHTML =
        event.data.pluginMessage.value;
      document.getElementById("selection").style.display = "block";
    } else {
      document.getElementById("count").innerHTML =
        "Please select a few layers and then run the plugin";
      document.getElementById("selection").style.display = "none";
    }
  }
};
