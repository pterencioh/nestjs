const enableSubmitButton = (buttonID) => {
    let loginButton = document.getElementById(buttonID);
    loginButton.removeAttribute('disabled');
};
const disableSubmitButton = (buttonID) => {
    let loginButton = document.getElementById(buttonID);
    loginButton.setAttribute('disabled', "");
};
const checkLoginButton = (passwordElement, emailElement, buttonID) => {
    const isPasswordEmpty = (passwordElement.value == '');
    const isEmailEmpty = (emailElement.value == '');
    const hasPasswordError = (passwordElement.style.borderColor == 'red');
    const hasEmailError = (emailElement.style.borderColor == 'red');
    if (!hasPasswordError && !hasEmailError && !isPasswordEmpty && !isEmailEmpty) {
        enableSubmitButton(buttonID);
        return;
    }
    disableSubmitButton(buttonID);
};
const checkResetButton = (emailElement, buttonID) => {
    const isEmailEmpty = (emailElement.value == "");
    const isEmailError = (emailElement.style.borderColor == "red");
    if (!isEmailEmpty && !isEmailError) {
        enableSubmitButton(buttonID);
        return;
    }
    disableSubmitButton(buttonID);
};
const checkSignupButton = (nameElement, emailElement, passwordElement, confirmElement) => {
    const isNameFilled = (nameElement.value !== "");
    const hasNameError = (nameElement.style.borderColor == "red");
    const isEmailFilled = (emailElement.value !== "");
    const hasEmailError = (emailElement.style.borderColor == "red");
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");
    const isConfirmFilled = (confirmElement.value !== "");
    const hasConfirmError = (confirmElement.style.borderColor == "red");
    if (isNameFilled && !hasNameError &&
        isEmailFilled && !hasEmailError &&
        isPasswordFilled && !hasPasswordError &&
        isConfirmFilled && !hasConfirmError) {
        enableSubmitButton("signup");
        return;
    }
    disableSubmitButton("signup");
};
const checkChangePassButton = (passwordElement, confirmElement) => {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");
    const isConfirmFilled = (confirmElement.value !== "");
    const hasConfirmError = (confirmElement.style.borderColor == "red");
    if (isPasswordFilled && !hasPasswordError &&
        isConfirmFilled && !hasConfirmError) {
        enableSubmitButton("changePass");
        return;
    }
    disableSubmitButton("changePass");
};
export { enableSubmitButton, disableSubmitButton, checkLoginButton, checkResetButton, checkSignupButton, checkChangePassButton };
