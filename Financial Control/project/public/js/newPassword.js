import {
    setError, removeErrors, checkChangePassButton
} from "./utils/utils.js";

const mainDiv = document.getElementsByClassName("centered-div")[0];

const passwordElement = document.getElementById("password");
passwordElement.addEventListener("change", validatePassword);

const showPasswordElement = document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);

const confirmPassElement = document.getElementById("confirmPassword");
confirmPassElement.addEventListener("change", verifyPassword);

const showConfirmElement = document.getElementById("showConfirmPassword");
showConfirmElement.addEventListener("click", showConfirm);

const changePassElement = document.getElementById("changePass");
changePassElement.addEventListener("click", setNewPass);

function validatePassword() {
    const isPasswordFilled = (passwordElement.value !== "");
    const hasPasswordError = (passwordElement.style.borderColor == "red");

    if (!isPasswordFilled) {
        const errorMessage = "Please fill in the password field.";
        const beforeElement = document.getElementsByClassName("showPassword")[0];
        setError(passwordElement, mainDiv, beforeElement, "password", errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
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

    checkChangePassButton(passwordElement, confirmPassElement);
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
        checkChangePassButton(passwordElement, confirmPassElement);
        return
    }

    if (!isConfirmFilled) {
        const errorMessage = "Please confirm your password.";
        const beforeElement = document.getElementsByClassName("showConfirmPassword")[0];
        setError(confirmPassElement, mainDiv, beforeElement, "confirm", errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
        return
    }

    const isSamePassword = (passwordElement.value == confirmPassElement.value);
    if (!isSamePassword) {
        const errorMessage = "Your password doesn't match!";
        const beforeElementForPassword = document.getElementsByClassName("showPassword")[0];
        const beforeElementForConfirm = document.getElementsByClassName("showConfirmPassword")[0];
        setError(passwordElement, mainDiv, beforeElementForPassword, "password", errorMessage);
        setError(confirmPassElement, mainDiv, beforeElementForConfirm, "confirm", errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
        return
    }

    const hasPasswordError = (passwordElement.style.borderColor == "red");
    const hasConfirmError = (confirmPassElement.style.borderColor == "red");

    if (isSamePassword && hasPasswordError && hasConfirmError) {
        removeErrors(passwordElement, "password");
        removeErrors(confirmPassElement, "confirm");
    }

    checkChangePassButton(passwordElement, confirmPassElement);
}

function showConfirm() {
    const inputConfirm = document.getElementById("confirmPassword");
    let inputType = inputConfirm.getAttribute("type");

    inputType = inputType === 'password' ? 'text' : 'password';
    inputConfirm.setAttribute("type", inputType);
}

function setNewPass() {
    const urlParams = new URLSearchParams(window.location.search);

    const configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: urlParams.get('id'),
            password: passwordElement.value
        })
    };

    fetch('/password', configAPI)
        .then(response => { return response.json() })
        .then(responseJSON => {
            if(responseJSON.status == 200){
                alert("Password successfully updated.");
                window.open("/","_self");
            }
        })

}