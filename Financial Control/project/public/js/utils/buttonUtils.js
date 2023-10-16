const enableSubmitButton = (elementId) => {
    let loginButton = document.getElementById(elementId);
    loginButton.removeAttribute('disabled');
};

const disableSubmitButton = (elementId) => {
    let loginButton = document.getElementById(elementId);
    loginButton.setAttribute('disabled', "");
};

const checkLoginButton = (passwordElement, emailElement, elementId) => {
    const isPasswordEmpty = (passwordElement.value == '');
    const isEmailEmpty = (emailElement.value == '');
    const hasPasswordError = (passwordElement.style.borderColor == 'red');
    const hasEmailError = (emailElement.style.borderColor == 'red');

    if (!hasPasswordError && !hasEmailError && !isPasswordEmpty && !isEmailEmpty) {
        enableSubmitButton(elementId);
        return
    }

    disableSubmitButton(elementId);
};

const checkChangeButton = (emailElement, elementId) => {
    const isEmailEmpty = (emailElement.value == "");
    const isEmailError = (emailElement.style.borderColor == "red");

    if (!isEmailEmpty && !isEmailError) {
        enableSubmitButton(elementId);
        return
    }

    disableSubmitButton(elementId);
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
        return
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
        return
    }

    disableSubmitButton("changePass");
};

export {
    enableSubmitButton, disableSubmitButton, checkLoginButton,
    checkChangeButton, checkSignupButton, checkChangePassButton
}