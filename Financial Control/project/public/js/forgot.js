import { ErrorTypes } from "./utils/errorUtils.js";
import { isValidEmail, setError, removeErrors, checkChangeButton } from "./utils/utils.js";
var centeredDiv = document.getElementsByClassName("centered-div")[0];
var emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);
var changeButton = document.getElementById("change");
changeButton.addEventListener("click", validateChange);
function validateEmail() {
    var isValidValue = isValidEmail(emailElement.value);
    if (!isValidValue) {
        var errorMessage = "Please provide a valid email. i.e. 'example@example.com'";
        setError(emailElement, centeredDiv, changeButton, ErrorTypes.email, errorMessage);
        checkChangeButton(emailElement, changeButton.id);
        return;
    }
    var hasBorderError = (emailElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.email);
    checkChangeButton(emailElement, "change");
}
function validateChange() {
    var configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailElement.value
        })
    };
    fetch('/forgot', configAPI)
        .then(function (response) { return response.json(); })
        .then(function (responseJSON) {
        var userNotFound = (responseJSON.status == 404);
        var hasEmailError = (emailElement.style.borderColor == "red");
        if (userNotFound && !hasEmailError) {
            var errorMessage = "Sorry, but the email provided is not correct or he is not registered.";
            setError(emailElement, centeredDiv, changeButton, ErrorTypes.email, errorMessage);
            checkChangeButton(emailElement, "change");
            return;
        }
        var alreadyExistRequest = (responseJSON.status == 409);
        if (alreadyExistRequest) {
            alert("ATTENTION, there is already a password change request in the system, please check your email!");
            window.open("/", "_self");
            return;
        }
        var changeRequestSend = (responseJSON.status == 200);
        if (changeRequestSend) {
            alert("The password change request was successfully sent to your email!");
            window.open("/", "_self");
            return;
        }
    });
}
