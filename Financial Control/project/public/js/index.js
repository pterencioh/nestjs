import { ErrorTypes } from "./utils/errorUtils.js";
import { isValidEmail, checkRememberMe, checkLoginButton, addErrorBorder, hasErrorBorder, addErrorMessage, setError, removeErrors } from "./utils/utils.js";
checkLocalStorage();
var showPasswordElement = document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);
var emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);
var passwordElement = document.getElementById("password");
passwordElement.addEventListener("change", validateForm);
var loginElement = document.getElementById("login");
loginElement.addEventListener("click", validateLogin);
var centeredDiv = document.getElementsByClassName("centered-div")[0];
function showPassword() {
    var inputPassword = document.getElementById("password");
    var inputType = inputPassword.getAttribute("type");
    inputType = inputType === 'password' ? 'text' : 'password';
    inputPassword.setAttribute("type", inputType);
}
function validateEmail() {
    var isValidValue = isValidEmail(emailElement.value);
    if (!isValidValue) {
        var errorMessage = "Please provide a valid email. i.e. 'example@example.com'";
        var nextElement = document.getElementsByClassName("password")[0];
        setError(emailElement, centeredDiv, nextElement, ErrorTypes.email, errorMessage);
        return;
    }
    var hasBorderError = (emailElement.style.borderColor === "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.email);
    checkLoginButton(passwordElement, emailElement, loginElement.id);
}
function validateForm() {
    var isPasswordFilled = (passwordElement.value !== "");
    var hasPasswordError = (passwordElement.style.borderColor == "red");
    if (!isPasswordFilled) {
        var errorMessage = "Please fill in the password field.";
        var nextElement = document.getElementsByClassName("options")[0];
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        return;
    }
    if (isPasswordFilled && hasPasswordError)
        removeErrors(passwordElement, ErrorTypes.password);
    var isEmailFilled = (emailElement.value != "");
    if (!isEmailFilled) {
        var errorMessage = "Please fill in the email field.";
        var nextElement = document.getElementsByClassName("password")[0];
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
        .then(function (response) { return response.json(); })
        .then(function (response) {
            console.log(response);
/*         var hasAnswer = (!response.jwt);
        if (hasAnswer) {
            var emailOnError = hasErrorBorder(emailElement);
            var passwordOnError = hasErrorBorder(passwordElement);
            if (emailOnError && passwordOnError)
                return;
            var errorMessage = "I'm sorry, but the email and/or password provided is not correct or does not exist.";
            addErrorBorder(emailElement);
            addErrorBorder(passwordElement);
            addErrorMessage(centeredDiv, loginElement, ErrorTypes.login, errorMessage);
            return;
        }
        var user = response.jwt;
        checkRememberMe(user);
        window.open("https://www.google.com.br", "_self"); */
    })
        .catch(function (error) { return console.log(error); });
}
function checkLocalStorage() {
    var token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token)
        window.open("https://www.google.com.br", "_self");
}
