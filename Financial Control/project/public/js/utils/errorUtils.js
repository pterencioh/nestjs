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
var addErrorBorder = function (currentInput) {
    currentInput.style.borderColor = 'red';
};
var removeErrorBorder = function (currentInput) {
    currentInput.style.borderColor = '';
};
var hasErrorBorder = function (currentInput) {
    return currentInput.style.borderColor == 'red';
};
var addErrorMessage = function (centeredDiv, nextElement, errorType, errorMessage) {
    var newElement = document.createElement('p');
    newElement.classList.add('errorMessage');
    newElement.setAttribute('id', "error_".concat(errorType));
    newElement.innerText = errorMessage;
    centeredDiv.insertBefore(newElement, nextElement);
};
var removeErrorMessage = function (errorType) {
    var element = document.getElementById("error_".concat(errorType));
    element.remove();
};
var hasErrorMessage = function (errorType) {
    var element = document.getElementById("error_".concat(errorType));
    return element != undefined;
};
var setError = function (currentInput, centeredDiv, nextElement, errorType, errorMessage) {
    var isElementOnError = hasErrorBorder(currentInput);
    if (!isElementOnError) {
        addErrorBorder(currentInput);
        addErrorMessage(centeredDiv, nextElement, errorType, errorMessage);
        return;
    }
    var existErrorMessage = hasErrorMessage(errorType);
    var getErrorMessage = document.getElementById("error_".concat(errorType)).innerText || '';
    var sameError = (existErrorMessage && getErrorMessage == errorMessage);
    if (sameError)
        return;
    if (!sameError) {
        removeErrorMessage(errorType);
        addErrorMessage(centeredDiv, nextElement, errorType, errorMessage);
    }
};
var removeErrors = function (currentInput, errorType) {
    removeErrorBorder(currentInput);
    removeErrorMessage(errorType);
};
export { addErrorBorder, removeErrorBorder, hasErrorBorder, addErrorMessage, removeErrorMessage, hasErrorMessage, setError, removeErrors, };
