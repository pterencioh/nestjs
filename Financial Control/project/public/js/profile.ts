const elementBackButton = document.getElementById('back') as HTMLButtonElement;
const elementSaveButton = document.getElementById('save') as HTMLButtonElement;
const elementAttach = document.getElementById('file-input') as HTMLInputElement;
const elementProfileImage = document.getElementById('perfil-img') as HTMLImageElement;
const elementEditIcon = document.getElementById('edit-icon') as HTMLImageElement;
const elementSpinner = document.getElementById('spinner') as HTMLImageElement;
var token = sessionStorage.getItem("jwt") || localStorage.getItem("jwt");

setUpPageConfig();

function setUpPageConfig(){
        isUserAuthenticated();
        openAttachOnClick();
        setAttachOnChange();
        saveProfileOnClick();
}

function isUserAuthenticated() {
    if(!token)
        window.open("/", "_self");

    fetch('api/auth/jwt', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jwt: token
        })
    })

    .then(response => { return response.json() })
    .then(responseJSON => {
        setFormInfos(responseJSON.jwt);
    })

    .catch(err => {
        console.error("Error: " + err);
        window.open("/", "_self");
    })
}

function setFormInfos(jwt: { name: string, profile_image: string }) : void {
    setProfileImage(jwt.profile_image);
    setNameUser(jwt.name);
    setMessage("We are happy to see that you are part of our community!");
}

function setMessage(message: string): void {
    var divMessage = document.getElementsByClassName("message")[0];
    var label = document.createElement("label");
    label.innerHTML = `${message}`;
    divMessage.append(label);
}

function setProfileImage(src: string) : void {
    var elementImg = document.getElementById("perfil-img");
    elementImg.setAttribute("src", src);
}

function setNameUser(name: string) : void{
    var divGreetings = document.getElementsByClassName("greetings")[0];
    var label = document.createElement("label");
    label.innerHTML = `Hello dear, ${name}`;
    divGreetings.append(label);
}

function openAttachOnClick() : void {
    const elementsId = ['perfil-img','edit-icon'];

    elementsId.forEach(element => {
        setOpenEvent(element);
    });
}

function setOpenEvent(elementsId: string) : void{
    document.getElementById(elementsId).addEventListener('click', function() {
        document.getElementById('file-input').click();
    });
}

function setAttachOnChange(): void{
     elementAttach.addEventListener('change', function() {
        var attachment = this.files[0] as File;        
        if (attachment) {
            const reader: FileReader = new FileReader();
            reader.onload = function(event: ProgressEvent<FileReader>) {
                const profileImageURL = event.target.result.toString();
                elementProfileImage.setAttribute('src', profileImageURL);
            };
            reader.readAsDataURL(attachment);

            enableSaveButton();
        }
    });
}

function enableSaveButton(): void {
    elementSaveButton.removeAttribute("disabled");
}

function disableButton(element): void {
    element.setAttribute("disabled","");
}

function hideProfileImages(){
    elementProfileImage.style.display = "none";
    elementEditIcon.style.display = "none";
}

function setLoadingIcon(){
    elementSpinner.style.display = "flex";
}

function configLoadingIcon(){
    disableButton(elementSaveButton);
    disableButton(elementBackButton);
    hideProfileImages();

    setLoadingIcon();
}

function saveProfileOnClick(){
    elementSaveButton.addEventListener('click', () => {
        configLoadingIcon();

        const formData = new FormData();
        const attchment: File = elementAttach.files[0];
        formData.append('image', attchment);
        fetch('api/profiles/' + token, {
            method: 'POST',
            body: formData
        })
        
        .then(response => { return response.json() })
        .then(responseJSON => {
            const hasAnswer = (responseJSON.jwt);
            if (!hasAnswer){
                alert("I'm sorry, but an error occurred during your upload. Please contact an administrator!");
                return;
            }
            
            let typeToken = sessionStorage.getItem("jwt") ? "session" : "";
            typeToken = (localStorage.getItem("jwt") && typeToken == "") ? "local" : typeToken;

            if(typeToken === "session")
                sessionStorage.setItem("jwt", responseJSON.jwt);

            if(typeToken === "local")
                localStorage.setItem("jwt", responseJSON.jwt);

            
            setTimeout(() => { 
                window.open("/profile.html","_self");
            }, 8000)
         
        })
    
        .catch(err => {
            console.error("Error: " + err);
        })
    }); 

}
