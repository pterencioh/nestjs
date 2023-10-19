const enableSubmitButton = (buttonID: string): void => {
    let loginButton = document.getElementById(buttonID) as HTMLButtonElement;
    loginButton.removeAttribute('disabled');
};

const disableSubmitButton = (buttonID: string): void => {
    let loginButton = document.getElementById(buttonID) as HTMLButtonElement;
    loginButton.setAttribute('disabled', "");
};

const checkLoginButton = (passwordElement: HTMLInputElement, emailElement: HTMLInputElement, buttonID: string): void => {
    const isPasswordEmpty: boolean = (passwordElement.value == '');
    const isEmailEmpty: boolean = (emailElement.value == '');
    const hasPasswordError: boolean = (passwordElement.style.borderColor == 'red');
    const hasEmailError: boolean = (emailElement.style.borderColor == 'red');

    if (!hasPasswordError && !hasEmailError && !isPasswordEmpty && !isEmailEmpty) {
        enableSubmitButton(buttonID);
        return;
    }

    disableSubmitButton(buttonID);
};

const checkChangeButton = (emailElement: HTMLInputElement, buttonID: string): void => {
    const isEmailEmpty: boolean = (emailElement.value == "");
    const isEmailError: boolean = (emailElement.style.borderColor == "red");

    if (!isEmailEmpty && !isEmailError) {
        enableSubmitButton(buttonID);
        return;
    }

    disableSubmitButton(buttonID);
};

const checkSignupButton = (nameElement: HTMLInputElement, emailElement: HTMLInputElement, passwordElement: HTMLInputElement, confirmElement: HTMLInputElement): void => {
    const isNameFilled: boolean = (nameElement.value !== "");
    const hasNameError: boolean = (nameElement.style.borderColor == "red");
    const isEmailFilled: boolean = (emailElement.value !== "");
    const hasEmailError: boolean = (emailElement.style.borderColor == "red");
    const isPasswordFilled: boolean = (passwordElement.value !== "");
    const hasPasswordError: boolean = (passwordElement.style.borderColor == "red");
    const isConfirmFilled: boolean = (confirmElement.value !== "");
    const hasConfirmError: boolean = (confirmElement.style.borderColor == "red");

    if (isNameFilled && !hasNameError &&
        isEmailFilled && !hasEmailError &&
        isPasswordFilled && !hasPasswordError &&
        isConfirmFilled && !hasConfirmError) {
        enableSubmitButton("signup");
        return;
    }
    disableSubmitButton("signup");
};

const checkChangePassButton = (passwordElement: HTMLInputElement, confirmElement: HTMLInputElement): void => {
    const isPasswordFilled: boolean = (passwordElement.value !== "");
    const hasPasswordError: boolean = (passwordElement.style.borderColor == "red");
    const isConfirmFilled: boolean = (confirmElement.value !== "");
    const hasConfirmError: boolean = (confirmElement.style.borderColor == "red");

    if (isPasswordFilled && !hasPasswordError &&
        isConfirmFilled && !hasConfirmError) {
        enableSubmitButton("changePass");
        return;
    }

    disableSubmitButton("changePass");
};

export {
    enableSubmitButton, 
    disableSubmitButton, 
    checkLoginButton,
    checkChangeButton, 
    checkSignupButton, 
    checkChangePassButton
}