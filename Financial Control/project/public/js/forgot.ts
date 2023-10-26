import { ConfigAPI } from ".";
import { ErrorTypes } from "./utils/errorUtils";
import {
    isValidEmail, setError, removeErrors, checkResetButton
} from "./utils/utils";

const centeredDiv = document.getElementsByClassName("centered-div")[0] as HTMLDivElement;
const emailElement = document.getElementById("email") as HTMLInputElement;
emailElement.addEventListener("change", validateEmail);
const resetButton = document.getElementById("reset") as HTMLButtonElement;
resetButton.addEventListener("click", validateReset);


function validateEmail(): void {
    const isValidValue: boolean = isValidEmail(emailElement.value);

    if (!isValidValue) {
        setError(emailElement, centeredDiv, resetButton, ErrorTypes.email, "Please provide a valid email. i.e. 'example@example.com'");
        checkResetButton(emailElement, resetButton.id);
        return;
    }

    const hasBorderError: boolean = (emailElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.email);

    checkResetButton(emailElement, resetButton.id);
}

function validateReset(): void {
    const configAPI: ConfigAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailElement.value
        })
    };

    fetch('api/auth/reset', configAPI)
    .then(response => { return response.json() })
    .then(response => {
        const userNotFound: boolean = (response.statusCode == 404);
        const hasEmailError: boolean = (emailElement.style.borderColor == "red");
        if(userNotFound && !hasEmailError){
            const errorMessage: string = "Sorry, but the email provided is not correct or he is not registered.";
            setError(emailElement, centeredDiv, resetButton, ErrorTypes.email, errorMessage);
            checkResetButton(emailElement, resetButton.id);
            return;
        }

        const alreadyExistRequest: boolean = (response.statusCode == 400);
        if(alreadyExistRequest){
            alert("ATTENTION, there is already a password reset request in the system, please check your email!");
            window.open("/","_self");
            return;
        }
        
        const changeRequestSend: boolean = (response.statusCode == 200);
        if(changeRequestSend){
            alert("The password change reset was successfully sent to your email!");
            window.open("/","_self");
            return;
        }
    })
}