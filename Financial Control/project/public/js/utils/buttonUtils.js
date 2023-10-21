var enableSubmitButton = function (buttonID) {
    var loginButton = document.getElementById(buttonID);
    loginButton.removeAttribute('disabled');
};
var disableSubmitButton = function (buttonID) {
    var loginButton = document.getElementById(buttonID);
    loginButton.setAttribute('disabled', "");
};
var checkLoginButton = function (passwordElement, emailElement, buttonID) {
    var isPasswordEmpty = (passwordElement.value == '');
    var isEmailEmpty = (emailElement.value == '');
    var hasPasswordError = (passwordElement.style.borderColor == 'red');
    var hasEmailError = (emailElement.style.borderColor == 'red');
    if (!hasPasswordError && !hasEmailError && !isPasswordEmpty && !isEmailEmpty) {
        enableSubmitButton(buttonID);
        return;
    }
    disableSubmitButton(buttonID);
};
var checkChangeButton = function (emailElement, buttonID) {
    var isEmailEmpty = (emailElement.value == "");
    var isEmailError = (emailElement.style.borderColor == "red");
    if (!isEmailEmpty && !isEmailError) {
        enableSubmitButton(buttonID);
        return;
    }
    disableSubmitButton(buttonID);
};
var checkSignupButton = function (nameElement, emailElement, passwordElement, confirmElement) {
    var isNameFilled = (nameElement.value !== "");
    var hasNameError = (nameElement.style.borderColor == "red");
    var isEmailFilled = (emailElement.value !== "");
    var hasEmailError = (emailElement.style.borderColor == "red");
    var isPasswordFilled = (passwordElement.value !== "");
    var hasPasswordError = (passwordElement.style.borderColor == "red");
    var isConfirmFilled = (confirmElement.value !== "");
    var hasConfirmError = (confirmElement.style.borderColor == "red");
    if (isNameFilled && !hasNameError &&
        isEmailFilled && !hasEmailError &&
        isPasswordFilled && !hasPasswordError &&
        isConfirmFilled && !hasConfirmError) {
        enableSubmitButton("signup");
        return;
    }
    disableSubmitButton("signup");
};
var checkChangePassButton = function (passwordElement, confirmElement) {
    var isPasswordFilled = (passwordElement.value !== "");
    var hasPasswordError = (passwordElement.style.borderColor == "red");
    var isConfirmFilled = (confirmElement.value !== "");
    var hasConfirmError = (confirmElement.style.borderColor == "red");
    if (isPasswordFilled && !hasPasswordError &&
        isConfirmFilled && !hasConfirmError) {
        enableSubmitButton("changePass");
        return;
    }
    disableSubmitButton("changePass");
};
export { enableSubmitButton, disableSubmitButton, checkLoginButton, checkChangeButton, checkSignupButton, checkChangePassButton };
