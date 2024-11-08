const match = <HTMLInputElement>document.getElementById('matchVal');
const textbox = <HTMLInputElement>document.getElementById('value');
const ignoreCase = <HTMLInputElement>document.getElementById('ignoreCase');
const isRegex = <HTMLInputElement>document.getElementById('isRegex');
let selection = [];

textbox.focus();

match.oninput = updatePreview;
textbox.oninput = updatePreview;
ignoreCase.onchange = updatePreview;
isRegex.onchange = updatePreview;

document.getElementById('update').onclick = () => {
    let confirmation = true;

    if (!textbox.value && !match.value)
        confirmation = window.confirm(
            'This will clear the text in the selected layers. Are you absolutely sure?'
        );

    if (confirmation) {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'update-text',
                    value: textbox.value,
                    match: match.value,
                    ignoreCase: ignoreCase.checked,
                    isRegex: isRegex.checked,
                },
            },
            '*'
        );
    } else {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'cancel',
                },
            },
            '*'
        );
    }
};

document.getElementById('cancel').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
};

onmessage = (event) => {
    if (event.data.pluginMessage.type == 'setSelectionMsg') {
        if (event.data.pluginMessage.count > 0) {
            document.getElementById('count').innerHTML =
                event.data.pluginMessage.value;
            document.getElementById('selection').style.display = 'block';
        } else {
            document.getElementById('count').innerHTML =
                'Please select a few layers and then run the plugin';
            document.getElementById('selection').style.display = 'none';
        }

        selection = event.data.pluginMessage.selection;
        updatePreview();
    }
};

function updatePreview() {
    let previewHTML = '';
    const item = document.querySelector('#preview-item').innerHTML;

    selection.forEach((text) => {
        let newText = '';
        let exp = match.value ? match.value : text;

        newText = text.replace(
            new RegExp(
                isRegex.checked
                    ? exp
                    : exp.replace(/[-[\]{}()*+?\.,\\^$|#\s]/g, '\\$&'),
                ignoreCase.checked ? 'ig' : 'g'
            ),
            textbox.value
        );

        previewHTML += item
            .replace(/{{CURRENT}}/g, text)
            .replace(/{{NEW}}/g, newText);
    });
    document.querySelector('.preview dl').innerHTML = previewHTML;
}
