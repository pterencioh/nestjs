import { ErrorTypes } from "./utils/errorUtils.js";
import { setError, removeErrors, checkChangePassButton, isSecurePass } from "./utils/utils.js";
checkRequest();
var centeredDiv = document.getElementsByClassName("centered-div")[0];
var passwordElement = document.getElementById("password");
passwordElement.addEventListener("change", validatePassword);
var showPasswordElement = document.getElementById("showPassword");
showPasswordElement.addEventListener("click", showPassword);
var confirmPassElement = document.getElementById("confirmPassword");
confirmPassElement.addEventListener("change", verifyPassword);
var showConfirmElement = document.getElementById("showConfirmPassword");
showConfirmElement.addEventListener("click", showConfirm);
var changePassElement = document.getElementById("changePass");
changePassElement.addEventListener("click", setNewPass);
function checkRequest() {
    var urlParams = new URLSearchParams(window.location.search);
    var isURLParamsFilled = (urlParams.size !== 0);
    if (!isURLParamsFilled)
        window.open("/", "_self");
    var configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jwt: urlParams.get('jwt')
        })
    };
    fetch('/api/auth/jwt', configAPI)
        .then(function (response) { return response.json(); })
        .then(function (response) {
        if (response.answer === false)
            window.open("/", "_self");
    });
}
function validatePassword() {
    var isPasswordFilled = (passwordElement.value !== "");
    var hasPasswordError = (passwordElement.style.borderColor == "red");
    var nextElement = document.getElementsByClassName("showPassword")[0];
    if (!isPasswordFilled) {
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, "Please fill in the password field.");
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }
    var matchRules = isSecurePass(passwordElement.value);
    if (!matchRules) {
        var errorMessage = "Your password must have: \n→ NO spaces\n→ At least 10 characters \n→ A special character: !@#$%^&*?:| \n→ A capital letter";
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
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
    checkChangePassButton(passwordElement, confirmPassElement);
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
    var nextElement = document.getElementsByClassName("showPassword")[0];
    if (!isPasswordFilled) {
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, "Please fill in the password field.");
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }
    if (!isConfirmFilled) {
        setError(confirmPassElement, centeredDiv, nextElement, ErrorTypes.confirm, "Please confirm your password.");
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }
    var isSamePassword = (passwordElement.value == confirmPassElement.value);
    if (!isSamePassword) {
        var nextElementForPassword = document.getElementsByClassName("showPassword")[0];
        var nextElementForConfirm = document.getElementsByClassName("showConfirmPassword")[0];
        setError(passwordElement, centeredDiv, nextElementForPassword, ErrorTypes.password, "Your password doesn't match!");
        setError(confirmPassElement, centeredDiv, nextElementForConfirm, ErrorTypes.confirm, "Your password doesn't match!");
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }
    var hasPasswordError = (passwordElement.style.borderColor == "red");
    var hasConfirmError = (confirmPassElement.style.borderColor == "red");
    if (isSamePassword && hasPasswordError && hasConfirmError) {
        removeErrors(passwordElement, ErrorTypes.password);
        removeErrors(confirmPassElement, ErrorTypes.confirm);
    }
    checkChangePassButton(passwordElement, confirmPassElement);
    return;
}
function showConfirm() {
    var inputConfirm = document.getElementById("confirmPassword");
    var inputType = inputConfirm.getAttribute("type");
    inputType = inputType === 'password' ? 'text' : 'password';
    inputConfirm.setAttribute("type", inputType);
}
function setNewPass() {
    var urlParams = new URLSearchParams(window.location.search);
    var configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jwt: urlParams.get('jwt'),
            password: passwordElement.value
        })
    };
    fetch("api/auth/reset/password", configAPI)
        .then(function (response) { return response.json(); })
        .then(function (response) {
        if (response.answer) {
            alert("Password successfully updated.");
            window.open("/", "_self");
        }
    });
}
