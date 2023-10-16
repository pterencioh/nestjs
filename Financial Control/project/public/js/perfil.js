const checkLocalStorage = () => {
    const name =  localStorage.getItem("name") || sessionStorage.getItem("name");
    const avatar =  localStorage.getItem("avatar") || sessionStorage.getItem("avatar");
    const loginType = localStorage.getItem("loginType") || sessionStorage.getItem("loginType");

    if(!name && !avatar && loginType)
        window.open("/","_self");

    createHTML(name, avatar);

}

const createHTML = (name, avatar) => {
    const mainDiv = document.getElementsByClassName("centered-div")[0];
    const img = document.createElement("img");
    img.setAttribute("src", avatar);
    img.setAttribute("alt", name);
    img.classList.add("imgAvatar");
    mainDiv.appendChild(img);

    const divInfo = document.createElement("div");
    divInfo.classList.add("info");

        const h1 = document.createElement("h1");
        h1.textContent = "Hello, " +  name;
        divInfo.appendChild(h1);

        const p = document.createElement("p");
        p.textContent = "We are happy to see that you is a part of our community!";
        divInfo.appendChild(p);

    mainDiv.appendChild(divInfo);

    const hr = document.createElement("hr");
    mainDiv.appendChild(hr);

    const button = document.createElement("button");
    button.setAttribute("type", "submit");
    button.setAttribute("id", "logoff");
    button.textContent = "Log off";
    button.addEventListener("click", logoff);
    mainDiv.appendChild(button);
}

function logoff(){
    localStorage.clear();
    sessionStorage.clear();
    window.open("/","_self");
}
checkLocalStorage();