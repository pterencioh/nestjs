import {
    isValidEmail, setError, removeErrors, checkChangeButton
} from "./utils/utils.js";

const mainDiv = document.getElementsByClassName("centered-div")[0];
const emailElement = document.getElementById("email");
emailElement.addEventListener("change", validateEmail);
const changeButton = document.getElementById("change");
changeButton.addEventListener("click", validateChange);


function validateEmail() {
    const isValidValue = isValidEmail(emailElement.value);

    if (!isValidValue) {
        const errorMessage = "Please provide a valid email. i.e. 'example@example.com'";
        setError(emailElement, mainDiv, changeButton, "email", errorMessage);
        checkChangeButton(emailElement, "change");
        return
    }

    const hasBorderError = emailElement.style.borderColor == "red";
    if (hasBorderError)
        removeErrors(emailElement, "email");

    checkChangeButton(emailElement, "change");
}

function validateChange() {
    const configAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailElement.value
        })
    };

    fetch('/forgot', configAPI)
    .then(response => { return response.json() })
    .then(responseJSON => {
        const userNotFound = (responseJSON.status == 404);
        const hasEmailError = (emailElement.style.borderColor == "red");
        if(userNotFound && !hasEmailError){
            const errorMessage = "Sorry, but the email provided is not correct or he is not registered.";
            setError(emailElement, mainDiv, changeButton, "email", errorMessage);
            checkChangeButton(emailElement, "change");
            return
        }

        const alreadyExistRequest = (responseJSON.status == 409);
        if(alreadyExistRequest){
            alert("ATTENTION, there is already a password change request in the system, please check your email!");
            window.open("/","_self");
            return
        }
        
        const changeRequestSend = (responseJSON.status == 200);
        if(changeRequestSend){
            alert("The password change request was successfully sent to your email!");
            window.open("/","_self");
            return
        }
    })
}