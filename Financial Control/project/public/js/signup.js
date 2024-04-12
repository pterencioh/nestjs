import { ErrorTypes } from "./utils/errorUtils.js";
import { isValidEmail, setError, removeErrors, checkSignupButton, hasOnlyLetters, disableSubmitButton, isSecurePass } from "./utils/utils.js";
const centeredDiv = document.getElementsByClassName("centered-div")[0];
const nameElement = document.getElementById("name");
nameElement.addEventListener("change", validateName);
const emailElement = document.getElementById("username");
emailElement.addEventListener("change", validateEmail);
const passwordElement = document.getElementById("password");
passwordElement.addEventListener("change", validatePassword);
const showPasswordElement = document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);
const confirmPassElement = document.getElementById("confirmPassword");
confirmPassElement.addEventListener("change", verifyPassword);
const showConfirmElement = document.getElementById("showConfirmPassword");
showConfirmElement.addEventListener("click", showConfirm);
const signupElement = document.getElementById("signup");
signupElement.addEventListener("click", signupUser);
function validateName() {
    const isNameValid = hasOnlyLetters(nameElement.value);
    const nextElement = document.getElementsByClassName("username")[0];
    if (!isNameValid) {
        setError(nameElement, centeredDiv, nextElement, ErrorTypes.name, "Please fill in your name using letters only!");
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    const isLengthValid = (nameElement.value.length >= 10);
    if (!isLengthValid) {
        setError(nameElement, centeredDiv, nextElement, ErrorTypes.name, "Please fill in at least your first and last name!");
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    const hasBorderError = (nameElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(nameElement, ErrorTypes.name);
    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}
function validateEmail() {
    const isValidValue = isValidEmail(emailElement.value);
    if (!isValidValue) {
        const errorMessage = "Please provide a valid email. i.e. 'example@example.com'";
        const nextElement = document.getElementsByClassName("password")[0];
        setError(emailElement, centeredDiv, nextElement, ErrorTypes.username, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    const hasBorderError = (emailElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.username);
    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}
function validatePassword() {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");
    const nextElement = document.getElementsByClassName("showPassword")[0];
    if (!isPasswordFilled) {
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, "Please fill in the password field.");
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    const matchRules = isSecurePass(passwordElement.value);
    if (!matchRules) {
        const errorMessage = "Your password must have: \n→ NO spaces\n→ At least 10 characters \n→ A special character: !@#$%^&*?:| \n→ A capital letter";
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    if (isPasswordFilled && hasPasswordError)
        removeErrors(passwordElement, ErrorTypes.password);
    const isConfirmFilled = (confirmPassElement.value !== "");
    const hasConfirmError = (confirmPassElement.style.borderColor == "red");
    if (isConfirmFilled)
        confirmPassElement.value = "";
    if (hasConfirmError)
        removeErrors(confirmPassElement, ErrorTypes.confirm);
    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}
function showPassword() {
    const inputPassword = document.getElementById("password");
    let inputType = inputPassword.getAttribute("type");
    inputType = inputType === 'password' ? 'text' : 'password';
    inputPassword.setAttribute("type", inputType);
}
function verifyPassword() {
    const isPasswordFilled = (passwordElement.value !== "");
    const isConfirmFilled = (confirmPassElement.value !== "");
    if (!isPasswordFilled) {
        const errorMessage = "Please fill in the password field.";
        const nextElement = document.getElementsByClassName("showPassword")[0];
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    if (!isConfirmFilled) {
        const errorMessage = "Please confirm your password.";
        const nextElement = document.getElementsByClassName("showConfirmPassword")[0];
        setError(confirmPassElement, centeredDiv, nextElement, ErrorTypes.confirm, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    const isSamePassword = (passwordElement.value == confirmPassElement.value);
    if (!isSamePassword) {
        const errorMessage = "Your password doesn't match!";
        const nextElementForPassword = document.getElementsByClassName("showPassword")[0];
        const nextElementForConfirm = document.getElementsByClassName("showConfirmPassword")[0];
        setError(passwordElement, centeredDiv, nextElementForPassword, ErrorTypes.password, errorMessage);
        setError(confirmPassElement, centeredDiv, nextElementForConfirm, ErrorTypes.confirm, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }
    const hasPasswordError = (passwordElement.style.borderColor == "red");
    const hasConfirmError = (confirmPassElement.style.borderColor == "red");
    if (isSamePassword && hasPasswordError && hasConfirmError) {
        removeErrors(passwordElement, ErrorTypes.password);
        removeErrors(confirmPassElement, ErrorTypes.confirm);
    }
    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}
function showConfirm() {
    const inputConfirm = document.getElementById("confirmPassword");
    let inputType = inputConfirm.getAttribute("type");
    inputType = inputType === 'password' ? 'text' : 'password';
    inputConfirm.setAttribute("type", inputType);
}
function signupUser() {
    const configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: nameElement.value,
            email: emailElement.value,
            password: passwordElement.value
        })
    };
    fetch('/api/auth/signup', configAPI)
        .then(response => { return response.json(); })
        .then(responseJSON => {
        const usernameUnavailable = (responseJSON.statusCode == 409);
        if (usernameUnavailable) {
            const hasUsernameError = (emailElement.style.borderColor == "red");
            if (!hasUsernameError) {
                const errorMessage = "Sorry, but the chosen username is already in use.";
                const nextElement = document.getElementsByClassName("password")[0];
                setError(emailElement, centeredDiv, nextElement, ErrorTypes.username, errorMessage);
                checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
                return;
            }
        }
        const userCreated = (responseJSON.jwt);
        if (userCreated) {
            sessionStorage.setItem("jwt", responseJSON.jwt);
            window.open("/perfil.html", "_self");
            return;
        }
        if (!userCreated && !usernameUnavailable) {
            setError(emailElement, centeredDiv, signupElement, ErrorTypes.signup, responseJSON.message);
            disableSubmitButton(signupElement.id);
            return;
        }
    });
}
