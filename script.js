const configInput = document.getElementById("config-input");
configInput.addEventListener("input", tasteTheRainbow);

function tasteTheRainbow(event) {
    const colors = extractColors(event);
    console.log(colors);
    listColors(colors);
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

function listColors(colors) {
    const colorList = document.getElementById("color-list");
    const colorEntries = Object.entries(colors);
    colorEntries.forEach(([colorName, value]) => {
        const hasModifiers = Object.keys(value).length > 0;
        // Create node for color
        const colorNameDiv = document.createElement("div");
        let content = `<h3>${colorName}${!hasModifiers ? " {}" : ""}</h3>`;
        colorNameDiv.innerHTML = content;
        colorList.appendChild(colorNameDiv);
        if (hasModifiers) {
            listModifiers(colorName, colorNameDiv, value);
        }
    });
}

function listModifiers(colorName, element, modifiers) {
    const modifierEntries = Object.entries(modifiers);
    modifierEntries.forEach(([modifier, value]) => {
        const className = `${colorName}-${modifier}`;
        console.log(className);
        // Create node with className and color hex value, with style of hex valueg
    });
}
