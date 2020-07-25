const configInput = document.getElementById("config-input");
configInput.addEventListener("input", tasteTheRainbow);

function tasteTheRainbow(event) {
    const colors = extractColors(event);
    console.log(colors);
}

function extractColors(event) {
    const input = event.target.value;
    const firstBrace = input.indexOf("{");
    const configObjectJSON = input
        .substr(firstBrace, input.length - firstBrace - 1)
        .split("\n")
        .join("")
        .replace(/\s/g, "")
        .replace(/'/g, '"')
        .replace(/\"\"/g, '"')
        .replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":');

    const configObject = JSON.parse(configObjectJSON);
    const colors = configObject.theme.colors;
    return colors;
}
