export var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes[ErrorTypes["name"] = 0] = "name";
    ErrorTypes[ErrorTypes["username"] = 1] = "username";
    ErrorTypes[ErrorTypes["email"] = 2] = "email";
    ErrorTypes[ErrorTypes["password"] = 3] = "password";
    ErrorTypes[ErrorTypes["confirm"] = 4] = "confirm";
    ErrorTypes[ErrorTypes["login"] = 5] = "login";
    ErrorTypes[ErrorTypes["signup"] = 6] = "signup";
})(ErrorTypes || (ErrorTypes = {}));
const addErrorBorder = (currentInput) => {
    currentInput.style.borderColor = 'red';
};
const removeErrorBorder = (currentInput) => {
    currentInput.style.borderColor = '';
};
const hasErrorBorder = (currentInput) => {
    return currentInput.style.borderColor == 'red';
};
const addErrorMessage = (centeredDiv, nextElement, errorType, errorMessage) => {
    let newElement = document.createElement('p');
    newElement.classList.add('errorMessage');
    newElement.setAttribute('id', `error_${errorType}`);
    newElement.innerText = errorMessage;
    centeredDiv.insertBefore(newElement, nextElement);
};
const removeErrorMessage = (errorType) => {
    const element = document.getElementById(`error_${errorType}`);
    element.remove();
};
const hasErrorMessage = (errorType) => {
    const element = document.getElementById(`error_${errorType}`);
    return element != undefined;
};
const setError = (currentInput, centeredDiv, nextElement, errorType, errorMessage) => {
    const isElementOnError = hasErrorBorder(currentInput);
    if (!isElementOnError) {
        addErrorBorder(currentInput);
        addErrorMessage(centeredDiv, nextElement, errorType, errorMessage);
        return;
    }
    const existErrorMessage = hasErrorMessage(errorType);
    const getErrorMessage = document.getElementById(`error_${errorType}`).innerText || '';
    const sameError = (existErrorMessage && getErrorMessage == errorMessage);
    if (sameError)
        return;
    if (!sameError) {
        removeErrorMessage(errorType);
        addErrorMessage(centeredDiv, nextElement, errorType, errorMessage);
    }
};
const removeErrors = (currentInput, errorType) => {
    removeErrorBorder(currentInput);
    removeErrorMessage(errorType);
};
export { addErrorBorder, removeErrorBorder, hasErrorBorder, addErrorMessage, removeErrorMessage, hasErrorMessage, setError, removeErrors, };
