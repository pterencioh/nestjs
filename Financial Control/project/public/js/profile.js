var elementBackButton = document.getElementById('back');
var elementSaveButton = document.getElementById('save');
var elementAttach = document.getElementById('file-input');
var elementProfileImage = document.getElementById('perfil-img');
var elementEditIcon = document.getElementById('edit-icon');
var elementSpinner = document.getElementById('spinner');
var token = sessionStorage.getItem("jwt") || localStorage.getItem("jwt");
setUpPageConfig();
function setUpPageConfig() {
    isUserAuthenticated();
    openAttachOnClick();
    setAttachOnChange();
    saveProfileOnClick();
}
function isUserAuthenticated() {
    if (!token)
        window.open("/", "_self");
    fetch('api/auth/jwt', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jwt: token
        })
    })
        .then(function (response) { return response.json(); })
        .then(function (responseJSON) {
        setFormInfos(responseJSON.jwt);
    })
        .catch(function (err) {
        console.error("Error: " + err);
        window.open("/", "_self");
    });
}
function setFormInfos(jwt) {
    setProfileImage(jwt.profile_image);
    setNameUser(jwt.name);
    setMessage("We are happy to see that you are part of our community!");
}
function setMessage(message) {
    var divMessage = document.getElementsByClassName("message")[0];
    var label = document.createElement("label");
    label.innerHTML = "".concat(message);
    divMessage.append(label);
}
function setProfileImage(src) {
    var elementImg = document.getElementById("perfil-img");
    elementImg.setAttribute("src", src);
}
function setNameUser(name) {
    var divGreetings = document.getElementsByClassName("greetings")[0];
    var label = document.createElement("label");
    label.innerHTML = "Hello dear, ".concat(name);
    divGreetings.append(label);
}
function openAttachOnClick() {
    var elementsId = ['perfil-img', 'edit-icon'];
    elementsId.forEach(function (element) {
        setOpenEvent(element);
    });
}
function setOpenEvent(elementsId) {
    document.getElementById(elementsId).addEventListener('click', function () {
        document.getElementById('file-input').click();
    });
}
function setAttachOnChange() {
    elementAttach.addEventListener('change', function () {
        var attachment = this.files[0];
        if (attachment) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var profileImageURL = event.target.result.toString();
                elementProfileImage.setAttribute('src', profileImageURL);
            };
            reader.readAsDataURL(attachment);
            enableSaveButton();
        }
    });
}
function enableSaveButton() {
    elementSaveButton.removeAttribute("disabled");
}
function disableButton(element) {
    element.setAttribute("disabled", "");
}
function hideProfileImages() {
    elementProfileImage.style.display = "none";
    elementEditIcon.style.display = "none";
}
function setLoadingIcon() {
    elementSpinner.style.display = "flex";
}
function configLoadingIcon() {
    disableButton(elementSaveButton);
    disableButton(elementBackButton);
    hideProfileImages();
    setLoadingIcon();
}
function saveProfileOnClick() {
    elementSaveButton.addEventListener('click', function () {
        configLoadingIcon();
        var formData = new FormData();
        var attchment = elementAttach.files[0];
        formData.append('image', attchment);
        fetch('api/profiles/' + token, {
            method: 'POST',
            body: formData
        })
            .then(function (response) { return response.json(); })
            .then(function (responseJSON) {
            var hasAnswer = (responseJSON.jwt);
            if (!hasAnswer) {
                alert("I'm sorry, but an error occurred during your upload. Please contact an administrator!");
                return;
            }
            var typeToken = sessionStorage.getItem("jwt") ? "session" : "";
            typeToken = (localStorage.getItem("jwt") && typeToken == "") ? "local" : typeToken;
            if (typeToken === "session")
                sessionStorage.setItem("jwt", responseJSON.jwt);
            if (typeToken === "local")
                localStorage.setItem("jwt", responseJSON.jwt);
            setTimeout(function () {
                window.open("/profile.html", "_self");
            }, 8000);
        })
            .catch(function (err) {
            console.error("Error: " + err);
        });
    });
}
