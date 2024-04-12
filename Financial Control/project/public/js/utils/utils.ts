import {
    addErrorBorder, removeErrorBorder, hasErrorBorder,
    addErrorMessage, removeErrorMessage, hasErrorMessage,
    setError, removeErrors
} from "./errorUtils";

import {
    enableSubmitButton, disableSubmitButton, checkLoginButton,
    checkResetButton, checkSignupButton, checkChangePassButton
} from "./buttonUtils";


const checkRememberMe = (userJWT: string): void => {
    const rememberMeElement = document.getElementById("rememberMe") as HTMLInputElement;
    const isChecked: boolean = (rememberMeElement.checked === true);

    if (isChecked) {
        localStorage.setItem("jwt", userJWT);
        return;
    }

    sessionStorage.setItem("jwt", userJWT);
}

const isValidEmail = (valueInput : string): boolean => {
    /* 
        "/^[a-zA-Z0-9._%+-]+" - Corresponds to the username before the @ symbol. It allows both uppercase and lowercase letters, numbers, 
                                and a few special characters such as dot, hyphen, percent, and plus sign.
        "@[a-zA-Z0-9.-]+"     - Corresponds to the @ symbol and the email domain after the @ symbol. It permits letters, numbers, dots, and hyphens within the domain.
        "\.[a-zA-Z]{2,}$/"    - Matches the top-level domain (TLD) of the email. It requires at least two alphabet letters.
    */
    const regexEmail : RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid : boolean = regexEmail.test(valueInput);

    return isValid
}

const hasOnlyLetters = (valueInput: string): boolean => {
    /* 
        "^[A-Za-z ]" - Matches any uppercase or lowercase letter and spaces. 
        "+$"         - Indicates that the preceding character (letters and spaces) should occur one or more times.
    */
    const regexLetters: RegExp = /^[A-Za-z ]+$/;
    const onlyLetters: boolean = regexLetters.test(valueInput);

    return onlyLetters
}

const isSecurePass = (password: string): boolean => {
    /*
        "\S"                     - Checks if the string do NOT contains white space.
        "(?=.*[A-Z])"            - Checks if the string contains at least one uppercase letter.
        "(?=.*[!@#$%^&*?:|])"    - Checks if the string contains at least one special character.
        "{10,}$"                 - Checks if the string has at least 10 characters in total.
    
    */
    const regex = /^(?=.*[!@#$%^&*?:|])(?=.*[A-Z])\S{10,}$/;
    return regex.test(password); 
}

export {
    isValidEmail, hasOnlyLetters, checkRememberMe,
    addErrorBorder, removeErrorBorder, hasErrorBorder,
    addErrorMessage, removeErrorMessage, hasErrorMessage,
    setError, removeErrors, enableSubmitButton, 
    disableSubmitButton, checkLoginButton, checkResetButton, 
    checkSignupButton, checkChangePassButton, isSecurePass
};