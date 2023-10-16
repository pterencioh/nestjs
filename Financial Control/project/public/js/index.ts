import {
    checkRememberMe, isValidEmail, checkLoginButton,
    addErrorBorder, hasErrorBorder, addErrorMessage,
    setError, removeErrors, hasErrorMessage
} from "./utils/utils.js";

checkLocalStorage();

const showPasswordElement = <HTMLAnchorElement>document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);

const emailElement = <HTMLInputElement>document.getElementById("email");
emailElement.addEventListener("change", validateEmail);

const passwordElement = <HTMLInputElement>document.getElementById("password");
passwordElement.addEventListener("change", validateForm);

const loginElement = <HTMLButtonElement>document.getElementById("login");
loginElement.addEventListener("click", validateLogin);

const mainDiv = <HTMLDivElement>document.getElementsByClassName("centered-div")[0];


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
        const beforeElement = document.getElementsByClassName("password")[0];
        setError(emailElement, mainDiv, beforeElement, "email", errorMessage);
        return
    }

    const hasBorderError = emailElement.style.borderColor == "red";
    if (hasBorderError)
        removeErrors(emailElement, "email");

    checkLoginButton(passwordElement, emailElement, "login");
}

function validateForm() {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");

    if (!isPasswordFilled) {
        const errorMessage = "Please fill in the password field."
        const beforeElement = document.getElementsByClassName("options")[0];
        setError(passwordElement, mainDiv, beforeElement, "password", errorMessage)
        return
    }

    if (isPasswordFilled && hasPasswordError)
        removeErrors(passwordElement, "password");

    const isEmailFilled = (emailElement.value != "");

    if (!isEmailFilled) {
        const errorMessage = "Please fill in the email field."
        const beforeElement = document.getElementsByClassName("password")[0];
        setError(emailElement, mainDiv, beforeElement, "email", errorMessage);
        return
    }

    checkLoginButton(passwordElement, emailElement, "login");
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

    console.log(configAPI);
    fetch('api/auth/signin', configAPI)
        .then(response => { return response.json() })
        .then(response => {
            console.log(response);
            if (!response.answer) {
                const emailOnError = hasErrorBorder(emailElement);
                const passwordOnError = hasErrorBorder(passwordElement);

                if (emailOnError && passwordOnError)
                    return

                const errorMessage = "I'm sorry, but the email and/or password provided is not correct or does not exist."
                addErrorBorder(emailElement);
                addErrorBorder(passwordElement);
                addErrorMessage(mainDiv, loginElement, "login", errorMessage);
                return
            }

            console.log("asdadaa");
/*             const user = response.data;
            checkRememberMe(user);
            window.open("/perfil","_self") */
        })
        .catch(error => console.log(error))
}

function checkLocalStorage() {
    const name = localStorage.getItem("name");
    const avatar = localStorage.getItem("avatar");
    const hasName = (name !== null);
    const hasAvatar = (avatar !== null);

    if (hasName && hasAvatar) {
        window.open("/perfil", "_self");
    }
}



