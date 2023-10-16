const addErrorBorder = (element) => {
    element.style.borderColor = "red"
};

const removeErrorBorder = (element) => {
    element.style.borderColor = ""
};

const hasErrorBorder = (element) => {
    return (element.style.borderColor == "red")
};

const addErrorMessage = (mainDiv, beforeElement, type, errorMessage) => {
    let newElement = document.createElement("p");
    newElement.classList.add("errorMessage");
    newElement.setAttribute("id", `error_${type}`);
    newElement.innerText = errorMessage;

    mainDiv.insertBefore(newElement, beforeElement);
};

const removeErrorMessage = (type) => {
    const element = document.getElementById(`error_${type}`);
    element.remove();
};

const hasErrorMessage = (type) => {
    const element = document.getElementById(`error_${type}`);
    return (element != undefined);
};

const setError = (element, mainDiv, beforeElement, type, errorMessage) => {
    const isElementOnError = hasErrorBorder(element);

    if (!isElementOnError) {
        addErrorBorder(element);
        addErrorMessage(mainDiv, beforeElement, type, errorMessage);
        return
    }

    const existErrorMessage = hasErrorMessage(type);
    const getErrorMessage = document.getElementById(`error_${type}`).innerText || "";
    const sameError = (existErrorMessage && getErrorMessage == errorMessage);

    if (sameError)
        return

    if (!sameError) {
        removeErrorMessage(type);
        addErrorMessage(mainDiv, beforeElement, type, errorMessage);
    }
};

const removeErrors = (element, type) => {
    removeErrorBorder(element);
    removeErrorMessage(type);
};

export {
    addErrorBorder, removeErrorBorder, hasErrorBorder,
    addErrorMessage, removeErrorMessage, hasErrorMessage,
    setError, removeErrors
}