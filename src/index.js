import style from "./styles.css";

const userInput = document.getElementById("user-input");
const inputArea = document.getElementById("input-area");
const notValid = document.getElementById("not-valid");
const colorContainer = document.getElementById("color-container");

userInput.addEventListener("input", tasteTheRainbow);

function tasteTheRainbow(event) {
    const colors = extractColors(event);
    if (!colors) {
        // Invalid input.
        notValid.classList.remove("hidden");
        return;
    }
    colorContainer.classList.remove("hidden");
    listColors(colors);
    addListeners();
    inputArea.classList.add("hidden");
}

/**
 * Parse the pasted string and return as an object
 * @param {*} event The input update event
 */
function extractColors(event) {
    const input = event.target.value;
    // Deal with the pasted-in string, accounting for differences in format
    const firstBrace = input.indexOf("{");
    const lastBrace = input.lastIndexOf("}");
    const configObjectJSON = input
        // Just get the object
        .substring(firstBrace, lastBrace + 1)
        // Get rid of newlines
        .split("\n")
        .join("")
        // Get rid of spaces
        .replace(/\s/g, "")
        // Change single quotes to double quotes
        .replace(/'/g, '"')
        // Anything that was "'Some String'" is now ""Some String"" so fix that
        .replace(/\"\"/g, '"')
        // Put all the keys in quotes for valid JSON
        .replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":')
        // Remove final commas
        .replace(/},}/g, "}}")
        .replace(/\",}/g, `"}`);

    // Get just the "colors" part of the config.
    let justTheColors = configObjectJSON.match(/({|,)\"colors\":(.*?)}},/);

    if (!justTheColors) {
        // It was invalid input.
        return null;
    }

    // Remove the trailing comma and add outer braces
    justTheColors = `{${justTheColors[0].slice(
        1,
        justTheColors[0].length - 1
    )}}`;

    // Parse that string, finally, and get the colors prop only.
    const colors = JSON.parse(justTheColors).colors;

    return colors;
}

/**
 * Builds the list of top-level colors in the UI, and then adds the modifiers
 * @param {*} colors The colors prop of the config file, parsed as an object
 */
function listColors(colors) {
    const colorEntries = Object.entries(colors);

    colorEntries.forEach(([colorName, value]) => {
        const hasModifiers = Object.keys(value).length > 0;
        let content = `<h3>${colorName}${!hasModifiers ? " {}" : ""}</h3>`;
        const colorNameDiv = createNode("div", content, "color-block");
        colorContainer.appendChild(colorNameDiv);

        if (hasModifiers) {
            listModifiers(colorName, colorNameDiv, value);
        }
    });
}

/**
 * Renders the list of class suffixes within each color block
 * @param {*} colorName The name of the color (i.e. "red")
 * @param {*} parentElement The parent color block element
 * @param {*} modifiers The array of class suffixes (i.e. "100", "200", etc.)
 */
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

/**
 * Renders the colored bars with the class suffixes and hex values in the UI
 * @param {*} colorName The name of the color
 * @param {*} modifier The class suffix
 * @param {*} value The hex color
 */
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

/**
 * Node-generating util function
 * @param {*} nodeType Type of node
 * @param {*} content innerHTML value of the node
 * @param {*} className Class to add
 */
function createNode(nodeType, content, className) {
    const node = document.createElement(nodeType);
    node.innerHTML = content;
    node.classList.add(className);
    return node;
}

/**
 * Adds click listeners to each color bar
 */
function addListeners() {
    const colorBars = document.querySelectorAll(".color-bar");
    colorBars.forEach((colorBar) =>
        colorBar.addEventListener("click", copyClass)
    );
}

/**
 * Copies the class suffix to the user clipboard
 * @param {*} event The click event
 */
function copyClass(event) {
    // Create hidden input element with the text to copy as the value
    const hiddenInput = document.createElement("input");
    hiddenInput.value = `-${event.target.id}`;
    hiddenInput.style.opacity = 0;
    event.target.appendChild(hiddenInput);
    // Select the tet in the element
    hiddenInput.select();
    // Copy it
    document.execCommand("copy");
    // Remove it
    event.target.removeChild(hiddenInput);
    showCopiedMessage(event.target);
}

/**
 * Shows a message to the user on click/copy
 * @param {*} element The clicked element
 */
function showCopiedMessage(element) {
    const parentElement = event.target;
    const content = `Class suffix "-${parentElement.id}" copied to clipboard`;
    const span = createNode("span", content, "copied-message");
    parentElement.appendChild(span);
    setTimeout(() => {
        parentElement.removeChild(span);
    }, 3000);
}
