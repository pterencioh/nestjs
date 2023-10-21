import { addErrorBorder, removeErrorBorder, hasErrorBorder, addErrorMessage, removeErrorMessage, hasErrorMessage, setError, removeErrors } from "./errorUtils.js";
import { enableSubmitButton, disableSubmitButton, checkLoginButton, checkChangeButton, checkSignupButton, checkChangePassButton } from "./buttonUtils.js";
var checkRememberMe = function (userJWT) {
    var rememberMeElement = document.getElementById("rememberMe");
    var isChecked = (rememberMeElement.checked === true);
    if (isChecked) {
        localStorage.setItem("token", userJWT);
        return;
    }
    sessionStorage.setItem("token", userJWT);
};
var isValidEmail = function (valueInput) {
    /*
        "/^[a-zA-Z0-9._%+-]+" - Corresponds to the username before the @ symbol. It allows both uppercase and lowercase letters, numbers,
                                and a few special characters such as dot, hyphen, percent, and plus sign.
        "@[a-zA-Z0-9.-]+"     - Corresponds to the @ symbol and the email domain after the @ symbol. It permits letters, numbers, dots, and hyphens within the domain.
        "\.[a-zA-Z]{2,}$/"    - Matches the top-level domain (TLD) of the email. It requires at least two alphabet letters.
    */
    var regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var isValid = regexEmail.test(valueInput);
    return isValid;
};
var hasOnlyLetters = function (valueInput) {
    /*
        "^[A-Za-z ]" - Matches any uppercase or lowercase letter and spaces.
        "+$"         - Indicates that the preceding character (letters and spaces) should occur one or more times.
    */
    var regexLetters = /^[A-Za-z ]+$/;
    var onlyLetters = regexLetters.test(valueInput);
    return onlyLetters;
};
export { isValidEmail, hasOnlyLetters, checkRememberMe, addErrorBorder, removeErrorBorder, hasErrorBorder, addErrorMessage, removeErrorMessage, hasErrorMessage, setError, removeErrors, enableSubmitButton, disableSubmitButton, checkLoginButton, checkChangeButton, checkSignupButton, checkChangePassButton };
