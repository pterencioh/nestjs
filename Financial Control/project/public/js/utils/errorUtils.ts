export enum ErrorTypes {
  name,
  username,
  email,
  password,
  confirm,
  login,
  signup
}

const addErrorBorder = (currentInput: HTMLInputElement): void => {
  currentInput.style.borderColor = 'red';
};

const removeErrorBorder = (currentInput: HTMLInputElement): void => {
  currentInput.style.borderColor = '';
};

const hasErrorBorder = (currentInput: HTMLInputElement): boolean => {
  return currentInput.style.borderColor == 'red';
};

const addErrorMessage = (centeredDiv: HTMLDivElement, nextElement: HTMLElement, errorType: ErrorTypes, errorMessage: string): void => {
  let newElement: HTMLParagraphElement = document.createElement('p');
  newElement.classList.add('errorMessage');
  newElement.setAttribute('id', `error_${errorType}`);
  newElement.innerText = errorMessage;

  centeredDiv.insertBefore(newElement, nextElement);
};

const removeErrorMessage = (errorType: ErrorTypes): void => {
  const element = document.getElementById(`error_${errorType}`) as HTMLParagraphElement;
  element.remove();
};

const hasErrorMessage = (errorType: ErrorTypes): boolean => {
  const element = document.getElementById(`error_${errorType}`) as HTMLParagraphElement;
  return element != undefined;
};

const setError = (currentInput: HTMLInputElement, centeredDiv: HTMLDivElement, nextElement: HTMLElement, errorType: ErrorTypes, errorMessage: string): void => {
  const isElementOnError: boolean = hasErrorBorder(currentInput);

  if (!isElementOnError) {
    addErrorBorder(currentInput);
    addErrorMessage(centeredDiv, nextElement, errorType, errorMessage);
    return;
  }

  const existErrorMessage: boolean = hasErrorMessage(errorType);
  const getErrorMessage: string = document.getElementById(`error_${errorType}`).innerText || '';
  const sameError: boolean = (existErrorMessage && getErrorMessage == errorMessage);

  if (sameError) return;

  if (!sameError) {
    removeErrorMessage(errorType);
    addErrorMessage(centeredDiv, nextElement, errorType, errorMessage);
  }
};

const removeErrors = (currentInput: HTMLInputElement, errorType: ErrorTypes): void => {
  removeErrorBorder(currentInput);
  removeErrorMessage(errorType);
};

export {
  addErrorBorder,
  removeErrorBorder,
  hasErrorBorder,
  addErrorMessage,
  removeErrorMessage,
  hasErrorMessage,
  setError,
  removeErrors,
};
