import { ErrorTypes } from "./utils/errorUtils.js";
import { setError, removeErrors, checkChangePassButton } from "./utils/utils.js";
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
function validatePassword() {
    var isPasswordFilled = (passwordElement.value !== "");
    var hasPasswordError = (passwordElement.style.borderColor == "red");
    if (!isPasswordFilled) {
        var errorMessage = "Please fill in the password field.";
        var nextElement = document.getElementsByClassName("showPassword")[0];
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
    if (!isPasswordFilled) {
        var errorMessage = "Please fill in the password field.";
        var nextElement = document.getElementsByClassName("showPassword")[0];
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }
    if (!isConfirmFilled) {
        var errorMessage = "Please confirm your password.";
        var nextElement = document.getElementsByClassName("showConfirmPassword")[0];
        setError(confirmPassElement, centeredDiv, nextElement, ErrorTypes.confirm, errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }
    var isSamePassword = (passwordElement.value == confirmPassElement.value);
    if (!isSamePassword) {
        var errorMessage = "Your password doesn't match!";
        var nextElementForPassword = document.getElementsByClassName("showPassword")[0];
        var nextElementForConfirm = document.getElementsByClassName("showConfirmPassword")[0];
        setError(passwordElement, centeredDiv, nextElementForPassword, ErrorTypes.password, errorMessage);
        setError(confirmPassElement, centeredDiv, nextElementForConfirm, ErrorTypes.confirm, errorMessage);
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
            id: urlParams.get('id'),
            password: passwordElement.value
        })
    };
    fetch('/password', configAPI)
        .then(function (response) { return response.json(); })
        .then(function (responseJSON) {
        if (responseJSON.status == 200) {
            alert("Password successfully updated.");
            window.open("/", "_self");
        }
    });
}
