import { ConfigAPI } from ".";
import { ErrorTypes } from "./utils/errorUtils";
import {
    setError, removeErrors, checkChangePassButton
} from "./utils/utils";

const centeredDiv = document.getElementsByClassName("centered-div")[0] as HTMLDivElement;

const passwordElement = document.getElementById("password") as HTMLInputElement;
passwordElement.addEventListener("change", validatePassword);

const showPasswordElement = document.getElementById("showPassword") as HTMLAnchorElement;
showPasswordElement.addEventListener("click", showPassword);

const confirmPassElement = document.getElementById("confirmPassword") as HTMLInputElement;
confirmPassElement.addEventListener("change", verifyPassword);

const showConfirmElement = document.getElementById("showConfirmPassword") as HTMLAnchorElement;
showConfirmElement.addEventListener("click", showConfirm);

const changePassElement = document.getElementById("changePass") as HTMLButtonElement;
changePassElement.addEventListener("click", setNewPass);

function validatePassword(): void {
    const isPasswordFilled: boolean = (passwordElement.value !== "");
    const hasPasswordError: boolean = (passwordElement.style.borderColor == "red");

    if (!isPasswordFilled) {
        const errorMessage: string = "Please fill in the password field.";
        const nextElement = document.getElementsByClassName("showPassword")[0] as HTMLDivElement;
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }

    if (isPasswordFilled && hasPasswordError)
        removeErrors(passwordElement, ErrorTypes.password);

    const isConfirmFilled: boolean = (confirmPassElement.value !== "");
    const hasConfirmError: boolean = (confirmPassElement.style.borderColor == "red");
    if (isConfirmFilled)
        confirmPassElement.value = "";

    if (hasConfirmError)
        removeErrors(confirmPassElement, ErrorTypes.confirm);

    checkChangePassButton(passwordElement, confirmPassElement);
}

function showPassword(): void {
    const inputPassword = document.getElementById("password") as HTMLInputElement;
    let inputType: string = inputPassword.getAttribute("type");

    inputType = inputType === 'password' ? 'text' : 'password';
    inputPassword.setAttribute("type", inputType);
}

function verifyPassword(): void {
    const isPasswordFilled: boolean = (passwordElement.value !== "");
    const isConfirmFilled: boolean = (confirmPassElement.value !== "");

    if (!isPasswordFilled) {
        const errorMessage: string = "Please fill in the password field.";
        const nextElement = document.getElementsByClassName("showPassword")[0] as HTMLDivElement;
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }

    if (!isConfirmFilled) {
        const errorMessage: string = "Please confirm your password.";
        const nextElement = document.getElementsByClassName("showConfirmPassword")[0] as HTMLDivElement;
        setError(confirmPassElement, centeredDiv, nextElement, ErrorTypes.confirm, errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }

    const isSamePassword: boolean = (passwordElement.value == confirmPassElement.value);
    if (!isSamePassword) {
        const errorMessage: string = "Your password doesn't match!";
        const nextElementForPassword = document.getElementsByClassName("showPassword")[0] as HTMLDivElement;
        const nextElementForConfirm = document.getElementsByClassName("showConfirmPassword")[0] as HTMLDivElement;
        setError(passwordElement, centeredDiv, nextElementForPassword, ErrorTypes.password, errorMessage);
        setError(confirmPassElement, centeredDiv, nextElementForConfirm, ErrorTypes.confirm, errorMessage);
        checkChangePassButton(passwordElement, confirmPassElement);
        return;
    }

    const hasPasswordError: boolean = (passwordElement.style.borderColor == "red");
    const hasConfirmError: boolean = (confirmPassElement.style.borderColor == "red");

    if (isSamePassword && hasPasswordError && hasConfirmError) {
        removeErrors(passwordElement, ErrorTypes.password);
        removeErrors(confirmPassElement, ErrorTypes.confirm);
    }

    checkChangePassButton(passwordElement, confirmPassElement);
    return;
}

function showConfirm(): void {
    const inputConfirm = document.getElementById("confirmPassword") as HTMLInputElement;
    let inputType: string = inputConfirm.getAttribute("type");

    inputType = inputType === 'password' ? 'text' : 'password';
    inputConfirm.setAttribute("type", inputType);
}

function setNewPass(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const configAPI: ConfigAPI = {
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