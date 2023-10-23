import { ErrorTypes }  from "./utils/errorUtils";
import {
    isValidEmail, checkRememberMe, checkLoginButton,
    addErrorBorder, hasErrorBorder, addErrorMessage,
    setError, removeErrors
} from "./utils/utils";

export interface ConfigAPI {
    method: string,
    headers: {
        "Content-Type": string
    },
    body: string
}

checkLocalStorage();

const showPasswordElement = document.getElementById("showPassword") as HTMLAnchorElement;
showPasswordElement.addEventListener("click", showPassword);

const emailElement = document.getElementById("email") as HTMLInputElement;
emailElement.addEventListener("change", validateEmail);

const passwordElement = document.getElementById("password") as HTMLInputElement;
passwordElement.addEventListener("change", validateForm);

const loginElement = document.getElementById("login") as HTMLButtonElement;
loginElement.addEventListener("click", validateLogin);

const centeredDiv = document.getElementsByClassName("centered-div")[0] as HTMLDivElement;


function showPassword(): void {
    const inputPassword = document.getElementById("password") as HTMLInputElement;
    let inputType: string = inputPassword.getAttribute("type");

    inputType = inputType === 'password' ? 'text' : 'password';
    inputPassword.setAttribute("type", inputType);
}
function validateEmail(): void {
    const isValidValue: boolean = isValidEmail(emailElement.value);

    if (!isValidValue) {
        const errorMessage: string = "Please provide a valid email. i.e. 'example@example.com'";
        const nextElement = document.getElementsByClassName("password")[0] as HTMLDivElement;
        setError(emailElement, centeredDiv, nextElement, ErrorTypes.email, errorMessage);
        return;
    }

    const hasBorderError: boolean = (emailElement.style.borderColor === "red");
    if (hasBorderError)
        removeErrors(emailElement, ErrorTypes.email);

    checkLoginButton(passwordElement, emailElement, loginElement.id);
}

function validateForm(): void {
    const isPasswordFilled: boolean = (passwordElement.value !== "");
    const hasPasswordError: boolean = (passwordElement.style.borderColor == "red");

    if (!isPasswordFilled) {
        const errorMessage: string = "Please fill in the password field.";
        const nextElement = document.getElementsByClassName("options")[0] as HTMLDivElement;
        setError(passwordElement, centeredDiv, nextElement, ErrorTypes.password, errorMessage);
        return;
    }

    if (isPasswordFilled && hasPasswordError)
        removeErrors(passwordElement, ErrorTypes.password);

    const isEmailFilled: boolean = (emailElement.value != "");

    if (!isEmailFilled) {
        const errorMessage: string = "Please fill in the email field.";
        const nextElement = document.getElementsByClassName("password")[0] as HTMLDivElement;
        setError(emailElement, centeredDiv, nextElement, ErrorTypes.email, errorMessage);
        return;
    }

    checkLoginButton(passwordElement, emailElement, loginElement.id);
}

function validateLogin(): void {
    var configAPI: ConfigAPI = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailElement.value,
            password: passwordElement.value
        })
    };

    fetch('api/auth/signin', configAPI)
        .then(response => { return response.json() })
        .then(response => {
            const hasAnswer = (!response.jwt);
            if (hasAnswer) {
                const emailOnError: boolean = hasErrorBorder(emailElement);
                const passwordOnError: boolean = hasErrorBorder(passwordElement);

                if (emailOnError && passwordOnError)
                    return;

                const errorMessage: string = "I'm sorry, but the email and/or password provided is not correct or does not exist."
                addErrorBorder(emailElement);
                addErrorBorder(passwordElement);
                addErrorMessage(centeredDiv, loginElement, ErrorTypes.login, errorMessage);
                return;
            }

            
            const user: string = response.jwt;
            checkRememberMe(user);
            window.open("https://www.google.com.br","_self");
        })
        .catch(error => console.log(error))
}

function checkLocalStorage() : void {
    const token : string = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) 
        window.open("https://www.google.com.br","_self");  
}



