import style from "./styles.css";

const configInput = document.getElementById("config-input");
configInput.addEventListener("input", tasteTheRainbow);

function tasteTheRainbow(event) {
    const colors = extractColors(event);
    listColors(colors);
    addListeners();
}

function extractColors(event) {
    const input = event.target.value;
    const firstBrace = input.indexOf("{");
    const lastBrace = input.lastIndexOf("}");
    console.log(lastBrace);
    const configObjectJSON = input
        .substring(firstBrace, lastBrace + 1)
        .split("\n")
        .join("")
        .replace(/\s/g, "")
        .replace(/'/g, '"')
        .replace(/\"\"/g, '"')
        .replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":');

    console.log(configObjectJSON);

    const configObject = JSON.parse(configObjectJSON);
    const colors = configObject.theme.colors;
    return colors;
}

function listColors(colors) {
    const colorList = document.getElementById("color-list");
    const colorEntries = Object.entries(colors);
    colorEntries.forEach(([colorName, value]) => {
        const hasModifiers = Object.keys(value).length > 0;

        const colorNameDiv = document.createElement("div");
        let content = `<h3>${colorName}${!hasModifiers ? " {}" : ""}</h3>`;
        colorNameDiv.innerHTML = content;
        colorNameDiv.classList.add("color-block");
        colorList.appendChild(colorNameDiv);
        if (hasModifiers) {
            listModifiers(colorName, colorNameDiv, value);
        }
    });
}

function listModifiers(colorName, parentElement, modifiers) {
    if (typeof modifiers !== "string") {
        const modifierEntries = Object.entries(modifiers);
        modifierEntries.forEach(([modifier, value]) => {
            const colorBar = getColorBarNode(colorName, modifier, value);
            parentElement.append(colorBar);
        });
    } else {
        const colorBar = getColorBarNode(colorName, null, modifiers);
        parentElement.append(colorBar);
    }
}

function getColorBarNode(colorName, modifier, value) {
    const className = `${colorName}${modifier ? "-" + modifier : ""}`;
    const colorBar = document.createElement("div");
    colorBar.style.backgroundColor = value;
    colorBar.classList.add("color-bar");
    colorBar.id = className;
    const classNameElement = getTextSpan(className);
    const hexNameElement = getTextSpan(value);
    colorBar.appendChild(classNameElement);
    colorBar.appendChild(hexNameElement);
    return colorBar;
}

function getTextSpan(content) {
    const span = document.createElement("span");
    span.classList.add("color-bar-text");
    span.textContent = content;
    return span;
}

function addListeners() {
    const colorBars = document.querySelectorAll(".color-bar");
    colorBars.forEach((colorBar) =>
        colorBar.addEventListener("click", copyClass)
    );
}

function copyClass(event) {
    const hiddenInput = document.createElement("input");
    hiddenInput.value = event.target.id;
    hiddenInput.style.opacity = 0;
    event.target.appendChild(hiddenInput);
    hiddenInput.select();
    document.execCommand("copy");
    event.target.removeChild(hiddenInput);
    showCopiedMessage(event.target);
}

function showCopiedMessage(element) {
    const parentElement = event.target;
    const span = document.createElement("span");
    span.classList.add("copied-message");
    span.textContent = `Class "${parentElement.id}" copied to clipboard`;
    parentElement.appendChild(span);
    setTimeout(() => {
        parentElement.removeChild(span);
    }, 1000);
}
