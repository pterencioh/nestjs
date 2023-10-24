import { ConfigAPI } from ".";
import { ErrorTypes } from "./utils/errorUtils";
import {
    isValidEmail, setError, removeErrors, checkResetButton
} from "./utils/utils";

const centeredDiv = document.getElementsByClassName("centered-div")[0] as HTMLDivElement;
const emailElement = document.getElementById("email") as HTMLInputElement;
emailElement.addEventListener("change", validateEmail);
const resetButton = document.getElementById("reset") as HTMLButtonElement;
resetButton.addEventListener("click", validateChange);


function validateEmail(): void {
    const isValidValue: boolean = isValidEmail(emailElement.value);

    if (!isValidValue) {
        const errorMessage: string = "Please provide a valid email. i.e. 'example@example.com'";
        setError(emailElement, centeredDiv, resetButton, ErrorTypes.email, errorMessage);
        checkResetButton(emailElement, resetButton.id);
        return;
    }

    const hasBorderError: boolean = (emailElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.email);

    checkResetButton(emailElement, "change");
}

function validateChange(): void {
    const configAPI: ConfigAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailElement.value
        })
    };

    fetch('/forgot', configAPI)
    .then(response => { return response.json() })
    .then(responseJSON => {
        const userNotFound: boolean = (responseJSON.status == 404);
        const hasEmailError: boolean = (emailElement.style.borderColor == "red");
        if(userNotFound && !hasEmailError){
            const errorMessage: string = "Sorry, but the email provided is not correct or he is not registered.";
            setError(emailElement, centeredDiv, resetButton, ErrorTypes.email, errorMessage);
            checkResetButton(emailElement, "change");
            return;
        }

        const alreadyExistRequest: boolean = (responseJSON.status == 409);
        if(alreadyExistRequest){
            alert("ATTENTION, there is already a password change request in the system, please check your email!");
            window.open("/","_self");
            return;
        }
        
        const changeRequestSend: boolean = (responseJSON.status == 200);
        if(changeRequestSend){
            alert("The password change request was successfully sent to your email!");
            window.open("/","_self");
            return;
        }
    })
}