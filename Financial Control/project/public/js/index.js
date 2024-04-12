import { ErrorTypes } from "./utils/errorUtils.js";
import { isValidEmail, checkRememberMe, checkLoginButton, addErrorBorder, hasErrorBorder, addErrorMessage, setError, removeErrors } from "./utils/utils.js";
checkLocalStorage();
const showPasswordElement = document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);
const emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);
const passwordElement = document.getElementById("password");
passwordElement.addEventListener("change", validateForm);
const loginElement = document.getElementById("login");
loginElement.addEventListener("click", validateLogin);
const centeredDiv = document.getElementsByClassName("centered-div")[0];
function showPassword() {
    const inputPassword = document.getElementById("password");
    let inputType = inputPassword.getAttribute("type");
    inputType = inputType === 'password' ? 'text' : 'password';
    inputPassword.setAttribute("type", inputType);
}
function validateEmail() {
    const isValidValue = isValidEmail(emailElement.value);
    if (!isValidValue) {
        const errorMessage = "Please provide a valid email. i.e. 'example@example.com'";
        const nextElement = document.getElementsByClassName("password")[0];
        setError(emailElement, centeredDiv, nextElement, ErrorTypes.email, errorMessage);
        return;
    }
    const hasBorderError = (emailElement.style.borderColor === "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.email);
    checkLoginButton(passwordElement, emailElement, loginElement.id);
}
function validateForm() {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");
    if (!isPasswordFilled) {
        const errorMessage = "Please fill in the password field.";
        const nextElement = document.getElementsByClassName("options")[0];
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        return;
    }
    if (isPasswordFilled && hasPasswordError)
        removeErrors(passwordElement, ErrorTypes.password);
    const isEmailFilled = (emailElement.value != "");
    if (!isEmailFilled) {
        const errorMessage = "Please fill in the email field.";
        const nextElement = document.getElementsByClassName("password")[0];
        setError(emailElement, centeredDiv, nextElement, ErrorTypes.email, errorMessage);
        return;
    }
    checkLoginButton(passwordElement, emailElement, loginElement.id);
}
function validateLogin() {
    var configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailElement.value,
            password: passwordElement.value
        })
    };
    fetch('api/auth/signin', configAPI)
        .then(response => { return response.json(); })
        .then(response => {
        const hasAnswer = (!response.jwt);
        if (hasAnswer) {
            const emailOnError = hasErrorBorder(emailElement);
            const passwordOnError = hasErrorBorder(passwordElement);
            if (emailOnError && passwordOnError)
                return;
            const errorMessage = "I'm sorry, but the email and/or password provided is not correct or does not exist.";
            addErrorBorder(emailElement);
            addErrorBorder(passwordElement);
            addErrorMessage(centeredDiv, loginElement, ErrorTypes.login, errorMessage);
            return;
        }
        const user = response.jwt;
        checkRememberMe(user);
        window.open("/perfil.html", "_self");
    })
        .catch(error => console.log(error));
}
function checkLocalStorage() {
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    if (token)
        window.open("/perfil.html", "_self");
}
