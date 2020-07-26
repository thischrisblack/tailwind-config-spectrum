import style from "./styles.css";

const configInput = document.getElementById("config-input");
const colorContainer = document.getElementById("color-container");
const inputArea = document.getElementById("input-area");
const notValid = document.getElementById("not-valid");

configInput.addEventListener("input", tasteTheRainbow);

function tasteTheRainbow(event) {
    const colors = extractColors(event);
    if (!colors) {
        notValid.classList.remove("hidden");
        return;
    }
    colorContainer.classList.remove("hidden");
    listColors(colors);
    addListeners();
    inputArea.classList.add("hidden");
}

function extractColors(event) {
    const input = event.target.value;
    // Deal with the pasted-in string, accounting for differences in format
    const firstBrace = input.indexOf("{");
    const lastBrace = input.lastIndexOf("}");
    const configObjectJSON = input
        .substring(firstBrace, lastBrace + 1)
        .split("\n")
        .join("")
        .replace(/\s/g, "")
        .replace(/'/g, '"')
        .replace(/\"\"/g, '"')
        .replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":')
        .replace(/},}/g, "}}")
        .replace(/\",}/g, `"}`);
    // Get just the "colors" part.
    let justTheColors = configObjectJSON.match(/({|,)\"colors\":(.*?)}},/);

    if (!justTheColors) {
        return null;
    }

    // Remove the trailing comma and add outer brackets
    justTheColors = `{${justTheColors[0].slice(
        1,
        justTheColors[0].length - 1
    )}}`;

    const colors = JSON.parse(justTheColors).colors;

    return colors;
}

function listColors(colors) {
    const colorEntries = Object.entries(colors);

    colorEntries.forEach(([colorName, value]) => {
        const hasModifiers = Object.keys(value).length > 0;

        const colorNameDiv = document.createElement("div");
        let content = `<h3>${colorName}${!hasModifiers ? " {}" : ""}</h3>`;
        colorNameDiv.innerHTML = content;
        colorNameDiv.classList.add("color-block");
        colorContainer.appendChild(colorNameDiv);

        if (hasModifiers) {
            listModifiers(colorName, colorNameDiv, value);
        }
    });
}

function listModifiers(colorName, parentElement, modifiers) {
    if (typeof modifiers !== "string") {
        const modifierEntries = Object.entries(modifiers);
        modifierEntries.forEach(([modifier, value]) => {
            const colorBar = createColorBar(colorName, modifier, value);
            parentElement.append(colorBar);
        });
    } else {
        const colorBar = createColorBar(colorName, null, modifiers);
        parentElement.append(colorBar);
    }
}

function createColorBar(colorName, modifier, value) {
    const className = `${colorName}${modifier ? "-" + modifier : ""}`;

    const colorBar = createNode("div", null, "color-bar");
    colorBar.style.backgroundColor = value;
    colorBar.id = className;

    const classNameElement = createNode("span", className, "color-bar-text");
    const hexNameElement = createNode("span", value, "color-bar-text");
    colorBar.appendChild(classNameElement);
    colorBar.appendChild(hexNameElement);

    return colorBar;
}

function createNode(nodeType, content, className) {
    const node = document.createElement(nodeType);
    node.innerHTML = content;
    node.classList.add(className);
    return node;
}

function addListeners() {
    const colorBars = document.querySelectorAll(".color-bar");
    colorBars.forEach((colorBar) =>
        colorBar.addEventListener("click", copyClass)
    );
}

function copyClass(event) {
    const hiddenInput = document.createElement("input");
    hiddenInput.value = `-${event.target.id}`;
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
    span.textContent = `Class suffix "-${parentElement.id}" copied to clipboard`;
    parentElement.appendChild(span);
    setTimeout(() => {
        parentElement.removeChild(span);
    }, 2000);
}
