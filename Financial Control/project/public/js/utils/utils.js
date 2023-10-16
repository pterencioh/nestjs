import {
    addErrorBorder, removeErrorBorder, hasErrorBorder,
    addErrorMessage, removeErrorMessage, hasErrorMessage,
    setError, removeErrors
} from "./errorUtils.js";

import {
    enableSubmitButton, disableSubmitButton, checkLoginButton,
    checkChangeButton, checkSignupButton, checkChangePassButton
} from "./buttonUtils.js";


const checkRememberMe = (user) => {
    const rememberMeElement = document.getElementById("rememberMe");
    const isChecked = (rememberMeElement.checked === true);

    if (isChecked) {
        localStorage.setItem("name", user.name);
        localStorage.setItem("avatar", user.avatar);
        localStorage.setItem("loginType", "default");
        return
    }

    sessionStorage.setItem("name", user.name);
    sessionStorage.setItem("avatar", user.avatar);
    sessionStorage.setItem("loginType", "default");
}

const isValidEmail = (valueInput) => {
    /* 
        "/^[a-zA-Z0-9._%+-]+" - Corresponds to the username before the @ symbol. It allows both uppercase and lowercase letters, numbers, 
                                and a few special characters such as dot, hyphen, percent, and plus sign.
        "@[a-zA-Z0-9.-]+"     - Corresponds to the @ symbol and the email domain after the @ symbol. It permits letters, numbers, dots, and hyphens within the domain.
        "\.[a-zA-Z]{2,}$/"    - Matches the top-level domain (TLD) of the email. It requires at least two alphabet letters.
    */
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = regexEmail.test(valueInput);

    return isValid
}

const hasOnlyLetters = (valueInput) => {
    /* 
        "^[A-Za-z ]" - Matches any uppercase or lowercase letter and spaces. 
        "+$"         - Indicates that the preceding character (letters and spaces) should occur one or more times.
    */
    const regexLetters = /^[A-Za-z ]+$/;
    const onlyLetters = regexLetters.test(valueInput);

    return onlyLetters
}

export {
    checkRememberMe, isValidEmail, hasOnlyLetters,
    addErrorBorder, removeErrorBorder, hasErrorBorder,
    addErrorMessage, removeErrorMessage, hasErrorMessage,
    setError, removeErrors, enableSubmitButton, 
    disableSubmitButton, checkLoginButton, checkChangeButton, 
    checkSignupButton, checkChangePassButton
};