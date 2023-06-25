const currentURL = new URL(document.location.href);
let hashIndex = currentURL.href.indexOf("auth/discord#");

if (hashIndex !== -1) {
    const params = currentURL.href.slice(hashIndex + 13);
    setCookie("token", params.split("access_token=")[1].split("&")[0])
    setCookie("tokenType", params.split("token_type=")[1].split("&")[0])
}

function manage() {
    window.location.href = "embed/manageembed"
}

function toggle(number) {
    if (number === "1") {
        const arrow1 = document.getElementById("arrow-1")
        const div1 = document.getElementById("divtoaug-1")
        console.log(arrow1.innerHTML)
        console.log(div1)
        if (arrow1.innerHTML.includes("navigate_next")) {
            arrow1.innerHTML = "expand_more"
            div1.style.height = "250px"
        }
        else {
            arrow1.innerHTML = "navigate_next"
            div1.style.height = "90px"
        }
    }
    else {
        const arrow2 = document.getElementById("arrow-2")
        const div2 = document.getElementById("divtoaug-2")
        const separation = document.getElementById("separation")
        if (arrow2.innerHTML.includes("navigate_next")) {
            arrow2.innerHTML = "expand_more"
            div2.style.height = "450px"
            separation.style.display = "flex"
        }
        else {
            arrow2.innerHTML = "navigate_next"
            div2.style.height = "90px"
            separation.style.display = 'none'
        }
    }
}

// cookies
function setCookie(cname, cvalue, exdays = 14) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function redirect(lien) {
    if (window.location.href.includes("auth/")) window.location.href = window.location.href.replace(/auth\/.*/, lien);
    else window.location.href = lien;
    if (window.location.href.includes("embed/")) window.location.href = window.location.href.replace(/embed\/.*/, lien);
    else window.location.href = lien;
    if (window.location.href.includes("embed/manageembed")) window.location.href = window.location.href.replace(/embed\/.*/, lien);
    else window.location.href = lien;
}

// load
window.onload = async () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [
        getCookie("token"),
        getCookie("tokenType"),
    ];

    if (!accessToken) {
        window.location.href("/");
        return (document.getElementById("login").style.display = "flex");
    }

    fetch("https://discord.com/api/users/@me", {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
        .then((result) => result.json())
        .then((response) => {
            const { username, discriminator, id, avatar } = response;
            if (document.getElementById("login")) document.getElementById("login").style.display = "none";
            if (document.getElementById("conect")) document.getElementById("conect").style.display = "flex";
            if (document.getElementById("pseudo")) document.getElementById("pseudo").innerText += ` ${username}`;
            if (document.getElementById("avatar")) document.getElementById("avatar").src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg`;
        })

        .catch(console.error);

    async function getUsersGuilds(authToken) {
        const url = `http://localhost:3000/getUsersGuilds/${authToken}`;
        const response = fetch(url, {
            method: 'POST',
        })
        return await response;
    }

    // Exemple d'utilisation
    const authToken = getCookie("token");
    getUsersGuilds(authToken)
        .then(async guilds => {
            console.log(guilds);
        });



    const navserv = document.getElementById("servers")
    const guilds = await getUsersGuilds(accessToken);
    const servs = document.querySelectorAll(".navbar-server-content");
    const serversContainer = document.getElementById("servers");
    if (navserv) {
        for (let i = 0; i < guilds.length; i++) {
            const serveur = guilds[i];

            const serverDiv = document.createElement("div");
            serverDiv.className = "navbar-server-content";

            const serverImg = document.createElement("img");
            serverDiv.setAttribute("onclick", "getguildid(event)");
            if (serveur.icon === null) {
                serverImg.src = `https://pbs.twimg.com/media/DcCEn_SX4AEA6I9.jpg`;
            } else {
                serverImg.src = `https://cdn.discordapp.com/icons/${serveur.id}/${serveur.icon}.jpg`;
                serverImg.alt = serveur.id;
            }

            const serverName = document.createElement("span");
            function truncateText(text, maxLength) {
                if (text.length > maxLength) {
                    return text.slice(0, maxLength) + "...";
                }
                return text;
            }

            const truncatedText = truncateText(serveur.name, 12);
            serverName.textContent = truncatedText;

            serverDiv.appendChild(serverImg);
            serverDiv.appendChild(serverName);
            serversContainer.appendChild(serverDiv);
        }
        const buttom = document.createElement("div");
        buttom.className = "navbar-server-buttom";
        serversContainer.appendChild(buttom);
    }


};

function getguildid(event) {
    const clickedDiv = event.target.closest(".navbar-server-content");
    if (clickedDiv) {
        const image = clickedDiv.querySelector("img");
        const alt = image.getAttribute("alt");
        setCookie("guildId", alt)
    }
    if (window.location.href.includes("auth/")) window.location.href = window.location.href.replace(/auth\/.*/, "bvn.html");
    else window.location.href = "bvn.html";
    if (window.location.href.includes("embed/")) window.location.href = window.location.href.replace(/embed\/.*/, "bvn.html");
    else window.location.href = "bvn.html";
    if (window.location.href.includes("embed/manageembed")) window.location.href = window.location.href.replace(/embed\/.*/, lien);
    else window.location.href = "bvn.html";

}

const searchInput = document.querySelector(".navbar-search-input");
searchInput.addEventListener("input", function (event) {
    const elementsToFilter = document.querySelectorAll(".navbar-server-content");
    const searchText = event.target.value.toLowerCase();
    elementsToFilter.forEach(element => {
        const elementText = element.textContent.toLowerCase();

        if (elementText.includes(searchText)) {
            element.style.display = "flex";
        } else {
            element.style.display = "none";
        }
    });
});
const search = document.getElementById("search");
search.addEventListener("input", function (event) {
    const elementsToFilter = document.querySelectorAll(".pl");
    const searchText = event.target.value.toLowerCase();
    elementsToFilter.forEach(element => {
        const elementText = element.textContent.toLowerCase();

        if (elementText.includes(searchText)) {
            element.style.display = "flex";
        } else {
            element.style.display = "none";
        }
    });
});

function logout() {
    setCookie("token", "")
    setCookie("tokenType", "")
    setCookie("guildId", "")
    window.location.href = "index.html"
}

function messageTriger() {
    if (getCookie("guildId").length === 0) return;
    const url = `http://localhost:3000/guilds/${getCookie("guildId")}/roles`;
    fetch(url, {
        method: 'GET',
    })
}