import { ErrorTypes } from "./utils/errorUtils.js";
import { isValidEmail, setError, removeErrors, checkSignupButton, hasOnlyLetters, disableSubmitButton, isSecurePass } from "./utils/utils.js";
var centeredDiv = document.getElementsByClassName("centered-div")[0];
var nameElement = document.getElementById("name");
nameElement.addEventListener("change", validateName);
var emailElement = document.getElementById("username");
emailElement.addEventListener("change", validateEmail);
var passwordElement = document.getElementById("password");
passwordElement.addEventListener("change", validatePassword);
var showPasswordElement = document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);
var confirmPassElement = document.getElementById("confirmPassword");
confirmPassElement.addEventListener("change", verifyPassword);
var showConfirmElement = document.getElementById("showConfirmPassword");
showConfirmElement.addEventListener("click", showConfirm);
var signupElement = document.getElementById("signup");
signupElement.addEventListener("click", signupUser);
function validateName() {
    var isNameValid = hasOnlyLetters(nameElement.value);
    var nextElement = document.getElementsByClassName("username")[0];
    if (!isNameValid) {
        setError(nameElement, centeredDiv, nextElement, ErrorTypes.name, "Please fill in your name using letters only!");
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    var isLengthValid = (nameElement.value.length >= 10);
    if (!isLengthValid) {
        setError(nameElement, centeredDiv, nextElement, ErrorTypes.name, "Please fill in at least your first and last name!");
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    var hasBorderError = (nameElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(nameElement, ErrorTypes.name);
    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}
function validateEmail() {
    var isValidValue = isValidEmail(emailElement.value);
    if (!isValidValue) {
        var errorMessage = "Please provide a valid email. i.e. 'example@example.com'";
        var nextElement = document.getElementsByClassName("password")[0];
        setError(emailElement, centeredDiv, nextElement, ErrorTypes.username, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    var hasBorderError = (emailElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.username);
    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}
function validatePassword() {
    var isPasswordFilled = (passwordElement.value !== "");
    var hasPasswordError = (passwordElement.style.borderColor == "red");
    var nextElement = document.getElementsByClassName("showPassword")[0];
    if (!isPasswordFilled) {
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, "Please fill in the password field.");
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    var matchRules = isSecurePass(passwordElement.value);
    if (!matchRules) {
        var errorMessage = "Your password must have: \n→ NO spaces\n→ At least 10 characters \n→ A special character: !@#$%^&*?:| \n→ A capital letter";
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    if (isPasswordFilled && hasPasswordError)
        removeErrors(passwordElement, ErrorTypes.password);
    var isConfirmFilled = (confirmPassElement.value !== "");
    var hasConfirmError = (confirmPassElement.style.borderColor == "red");
    if (isConfirmFilled)
        confirmPassElement.value = "";
    if (hasConfirmError)
        removeErrors(confirmPassElement, ErrorTypes.confirm);
    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}
function showPassword() {
    var inputPassword = document.getElementById("password");
    var inputType = inputPassword.getAttribute("type");
    inputType = inputType === 'password' ? 'text' : 'password';
    inputPassword.setAttribute("type", inputType);
}
function verifyPassword() {
    var isPasswordFilled = (passwordElement.value !== "");
    var isConfirmFilled = (confirmPassElement.value !== "");
    if (!isPasswordFilled) {
        var errorMessage = "Please fill in the password field.";
        var nextElement = document.getElementsByClassName("showPassword")[0];
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    if (!isConfirmFilled) {
        var errorMessage = "Please confirm your password.";
        var nextElement = document.getElementsByClassName("showConfirmPassword")[0];
        setError(confirmPassElement, centeredDiv, nextElement, ErrorTypes.confirm, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    var isSamePassword = (passwordElement.value == confirmPassElement.value);
    if (!isSamePassword) {
        var errorMessage = "Your password doesn't match!";
        var nextElementForPassword = document.getElementsByClassName("showPassword")[0];
        var nextElementForConfirm = document.getElementsByClassName("showConfirmPassword")[0];
        setError(passwordElement, centeredDiv, nextElementForPassword, ErrorTypes.password, errorMessage);
        setError(confirmPassElement, centeredDiv, nextElementForConfirm, ErrorTypes.confirm, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    var hasPasswordError = (passwordElement.style.borderColor == "red");
    var hasConfirmError = (confirmPassElement.style.borderColor == "red");
    if (isSamePassword && hasPasswordError && hasConfirmError) {
        removeErrors(passwordElement, ErrorTypes.password);
        removeErrors(confirmPassElement, ErrorTypes.confirm);
    }
    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}
function showConfirm() {
    var inputConfirm = document.getElementById("confirmPassword");
    var inputType = inputConfirm.getAttribute("type");
    inputType = inputType === 'password' ? 'text' : 'password';
    inputConfirm.setAttribute("type", inputType);
}
function signupUser() {
    var configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: nameElement.value,
            email: emailElement.value,
            password: passwordElement.value
        })
    };
    fetch('/api/auth/signup', configAPI)
        .then(function (response) { return response.json(); })
        .then(function (responseJSON) {
        var usernameUnavailable = (responseJSON.statusCode == 409);
        if (usernameUnavailable) {
            var hasUsernameError = (emailElement.style.borderColor == "red");
            if (!hasUsernameError) {
                var errorMessage = "Sorry, but the chosen username is already in use.";
                var nextElement = document.getElementsByClassName("password")[0];
                setError(emailElement, centeredDiv, nextElement, ErrorTypes.username, errorMessage);
                checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
                return;
            }
        }
        var userCreated = (responseJSON.jwt);
        if (userCreated) {
            sessionStorage.setItem("token", responseJSON.jwt);
            window.open("https://www.youtube.com.br", "_self");
            return;
        }
        if (!userCreated && !usernameUnavailable) {
            setError(emailElement, centeredDiv, signupElement, ErrorTypes.signup, responseJSON.message);
            disableSubmitButton(signupElement.id);
            return;
        }
    });
}
