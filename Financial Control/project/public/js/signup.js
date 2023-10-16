import {
    isValidEmail, setError, removeErrors, checkSignupButton,
    hasOnlyLetters, disableSubmitButton
} from "./utils/utils.js";

const mainDiv = document.getElementsByClassName("centered-div")[0];
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

    if (!isNameValid) {
        const errorMessage = "Please fill in your name using letters only!"
        const beforeElement = document.getElementsByClassName("username")[0];
        setError(nameElement, mainDiv, beforeElement, "name", errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return
    }

    const hasBorderError = nameElement.style.borderColor == "red";
    if (hasBorderError)
        removeErrors(nameElement, "name");

    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}

function validateEmail() {
    const isValidValue = isValidEmail(emailElement.value);

    if (!isValidValue) {
        const errorMessage = "Please provide a valid email. i.e. 'example@example.com'";
        const beforeElement = document.getElementsByClassName("password")[0];
        setError(emailElement, mainDiv, beforeElement, "username", errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return
    }

    const hasBorderError = emailElement.style.borderColor == "red";
    if (hasBorderError)
        removeErrors(emailElement, "username");

    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}

function validatePassword() {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");

    if (!isPasswordFilled) {
        const errorMessage = "Please fill in the password field.";
        const beforeElement = document.getElementsByClassName("showPassword")[0];
        setError(passwordElement, mainDiv, beforeElement, "password", errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return
    }

    if (isPasswordFilled && hasPasswordError)
        removeErrors(passwordElement, "password");

    const isConfirmFilled = (confirmPassElement.value !== "");
    const hasConfirmError = (confirmPassElement.style.borderColor == "red");
    if (isConfirmFilled)
        confirmPassElement.value = "";

    if (hasConfirmError)
        removeErrors(confirmPassElement, "confirm");

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
        const beforeElement = document.getElementsByClassName("showPassword")[0];
        setError(passwordElement, mainDiv, beforeElement, "password", errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return
    }

    if (!isConfirmFilled) {
        const errorMessage = "Please confirm your password.";
        const beforeElement = document.getElementsByClassName("showConfirmPassword")[0];
        setError(confirmPassElement, mainDiv, beforeElement, "confirm", errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return
    }

    const isSamePassword = (passwordElement.value == confirmPassElement.value);
    if (!isSamePassword) {
        const errorMessage = "Your password doesn't match!";
        const beforeElementForPassword = document.getElementsByClassName("showPassword")[0];
        const beforeElementForConfirm = document.getElementsByClassName("showConfirmPassword")[0];
        setError(passwordElement, mainDiv, beforeElementForPassword, "password", errorMessage);
        setError(confirmPassElement, mainDiv, beforeElementForConfirm, "confirm", errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return
    }

    const hasPasswordError = (passwordElement.style.borderColor == "red");
    const hasConfirmError = (confirmPassElement.style.borderColor == "red");

    if (isSamePassword && hasPasswordError && hasConfirmError) {
        removeErrors(passwordElement, "password");
        removeErrors(confirmPassElement, "confirm");
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

    fetch('/signup', configAPI)
        .then(response => { return response.json() })
        .then(responseJSON => {
            const usernameUnavailable = (responseJSON.status == 409);
            if(usernameUnavailable){
                const hasUsernameError = (emailElement.style.borderColor == "red");
                if(!hasUsernameError){
                    const errorMessage = "Sorry, but the chosen username is already in use.";
                    const beforeElement = document.getElementsByClassName("password")[0];
                    setError(emailElement, mainDiv, beforeElement, "username", errorMessage);
                    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
                    return
                }
            }

            const userCreated = (responseJSON.status == 200);
            if(userCreated){
                sessionStorage.setItem("name", responseJSON.data.name);
                sessionStorage.setItem("avatar", responseJSON.data.avatar);
                window.open("/perfil","_self");
                return
            }

            if(!userCreated && !usernameUnavailable){
                setError(emailElement, mainDiv, signupElement, "signup", responseJSON.message);
                disableSubmitButton("signup");
                return
            }

        });

}