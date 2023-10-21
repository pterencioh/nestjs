import { ConfigAPI } from ".";
import { ErrorTypes } from "./utils/errorUtils";
import {
    isValidEmail, setError, removeErrors, checkSignupButton,
    hasOnlyLetters, disableSubmitButton
} from "./utils/utils";

const centeredDiv = document.getElementsByClassName("centered-div")[0] as HTMLDivElement;
const nameElement = document.getElementById("name") as HTMLInputElement;
nameElement.addEventListener("change", validateName);

const emailElement = document.getElementById("username") as HTMLInputElement;
emailElement.addEventListener("change", validateEmail);

const passwordElement = document.getElementById("password") as HTMLInputElement;
passwordElement.addEventListener("change", validatePassword);

const showPasswordElement = document.getElementById("showPassword") as HTMLAnchorElement;
showPasswordElement.addEventListener("click", showPassword);

const confirmPassElement = document.getElementById("confirmPassword") as HTMLInputElement;
confirmPassElement.addEventListener("change", verifyPassword);

const showConfirmElement = document.getElementById("showConfirmPassword") as HTMLAnchorElement;
showConfirmElement.addEventListener("click", showConfirm);

const signupElement = document.getElementById("signup") as HTMLButtonElement;
signupElement.addEventListener("click", signupUser);

function validateName(): void {
    const isNameValid: boolean = hasOnlyLetters(nameElement.value);

    if (!isNameValid) {
        const errorMessage: string = "Please fill in your name using letters only!";
        const nextElement = document.getElementsByClassName("username")[0] as HTMLDivElement;
        setError(nameElement, centeredDiv, nextElement, ErrorTypes.name, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }

    const hasBorderError: boolean = (nameElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(nameElement, ErrorTypes.name);

    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}

function validateEmail(): void {
    const isValidValue: boolean = isValidEmail(emailElement.value);

    if (!isValidValue) {
        const errorMessage: string = "Please provide a valid email. i.e. 'example@example.com'";
        const nextElement = document.getElementsByClassName("password")[0] as HTMLDivElement;
        setError(emailElement, centeredDiv, nextElement, ErrorTypes.username, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }

    const hasBorderError: boolean = (emailElement.style.borderColor == "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.username);

    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}

function validatePassword(): void {
    const isPasswordFilled: boolean = (passwordElement.value !== "");
    const hasPasswordError: boolean = (passwordElement.style.borderColor == "red");

    if (!isPasswordFilled) {
        const errorMessage: string = "Please fill in the password field.";
        const nextElement = document.getElementsByClassName("showPassword")[0] as HTMLDivElement;
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
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

    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
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
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }

    if (!isConfirmFilled) {
        const errorMessage: string = "Please confirm your password.";
        const nextElement = document.getElementsByClassName("showConfirmPassword")[0] as HTMLDivElement;
        setError(confirmPassElement, centeredDiv, nextElement, ErrorTypes.confirm, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }

    const isSamePassword: boolean = (passwordElement.value == confirmPassElement.value);
    if (!isSamePassword) {
        const errorMessage: string = "Your password doesn't match!";
        const nextElementForPassword = document.getElementsByClassName("showPassword")[0] as HTMLDivElement;
        const nextElementForConfirm = document.getElementsByClassName("showConfirmPassword")[0] as HTMLDivElement;
        setError(passwordElement, centeredDiv, nextElementForPassword, ErrorTypes.password, errorMessage);
        setError(confirmPassElement, centeredDiv, nextElementForConfirm, ErrorTypes.confirm, errorMessage);
        checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
        return;
    }

    const hasPasswordError: boolean = (passwordElement.style.borderColor == "red");
    const hasConfirmError: boolean = (confirmPassElement.style.borderColor == "red");

    if (isSamePassword && hasPasswordError && hasConfirmError) {
        removeErrors(passwordElement, ErrorTypes.password);
        removeErrors(confirmPassElement, ErrorTypes.confirm);
    }

    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
}

function showConfirm(): void {
    const inputConfirm = document.getElementById("confirmPassword") as HTMLInputElement;
    let inputType: string = inputConfirm.getAttribute("type");

    inputType = inputType === 'password' ? 'text' : 'password';
    inputConfirm.setAttribute("type", inputType);
}

function signupUser(): void {
    const configAPI: ConfigAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: nameElement.value,
            email: emailElement.value,
            password: passwordElement.value
        })
    };

    fetch('/signup', configAPI)
        .then(response => { return response.json() })
        .then(responseJSON => {
            const usernameUnavailable: boolean = (responseJSON.status == 409);
            if(usernameUnavailable){
                const hasUsernameError: boolean = (emailElement.style.borderColor == "red");
                if(!hasUsernameError){
                    const errorMessage: string = "Sorry, but the chosen username is already in use.";
                    const nextElement = document.getElementsByClassName("password")[0] as HTMLDivElement;
                    setError(emailElement, centeredDiv, nextElement, ErrorTypes.username, errorMessage);
                    checkSignupButton(nameElement, emailElement, passwordElement, confirmPassElement);
                    return;
                }
            }

            const userCreated:boolean = (responseJSON.status == 200);
            if(userCreated){
/*                 sessionStorage.setItem("name", responseJSON.data.name);
                sessionStorage.setItem("avatar", responseJSON.data.avatar);
                window.open("/perfil","_self"); */
                return;
            }

            if(!userCreated && !usernameUnavailable){
                setError(emailElement, centeredDiv, signupElement, ErrorTypes.signup, responseJSON.message);
                disableSubmitButton(signupElement.id);
                return;
            }

        });

}