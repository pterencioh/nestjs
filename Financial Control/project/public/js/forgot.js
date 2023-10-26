import { ErrorTypes } from "./utils/errorUtils.js";
import { isValidEmail, setError, removeErrors, checkResetButton } from "./utils/utils.js";
var centeredDiv = document.getElementsByClassName("centered-div")[0];
var emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);
var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", validateReset);
function validateEmail() {
    var isValidValue = isValidEmail(emailElement.value);
    if (!isValidValue) {
        setError(emailElement, centeredDiv, resetButton, ErrorTypes.email, "Please provide a valid email. i.e. 'example@example.com'");
        checkResetButton(emailElement, resetButton.id);
        return;
    }
    var hasBorderError = (emailElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.email);
    checkResetButton(emailElement, resetButton.id);
}
function validateReset() {
    var configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailElement.value
        })
    };
    fetch('api/auth/reset', configAPI)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            console.log(response)
        var userNotFound = (response.statusCode == 404);
        var hasEmailError = (emailElement.style.borderColor == "red");
        if (userNotFound && !hasEmailError) {
            var errorMessage = "Sorry, but the email provided is not correct or he is not registered.";
            setError(emailElement, centeredDiv, resetButton, ErrorTypes.email, errorMessage);
            checkResetButton(emailElement, resetButton.id);
            return;
        }
        var alreadyExistRequest = (response.statusCode == 400);
        if (alreadyExistRequest) {
            alert("ATTENTION, there is already a password reset request in the system, please check your email!");
            window.open("/", "_self");
            return;
        }
        var changeRequestSend = (response.statusCode == 200);
        if (changeRequestSend) {
            alert("The password change reset was successfully sent to your email!");
            window.open("/", "_self");
            return;
        }
    });
}
