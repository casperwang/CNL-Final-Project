document.getElementById("signIn").addEventListener("click", signIn);
document.getElementById("logOut").addEventListener("click", logOut);
document.getElementById("qrcode").addEventListener("click", showQRcode);

function signIn() {
  console.log("signIn");
  chrome.runtime.sendMessage("signIn", (response) => {
    console.log(response);
    document.getElementById("input").style.visibility = "visible";
    document.getElementById("name").innerText = response.name;
    document.getElementById("signIn").style.display = "none";
    document.getElementById("logOut").style.display = "block";
  });
}

function logOut() {
  console.log("logout");
  chrome.runtime.sendMessage("logout", (response) => {
    console.log(response)
    document.getElementById("input").style.visibility = "hidden";
    document.getElementById("name").innerText = "CNL final";
    document.getElementById("signIn").style.display = "block";
    document.getElementById("logOut").style.display = "none";
  })
}

function showQRcode() {
  console.log("qrcode");
  chrome.runtime.sendMessage("qrcode", (response) => {
    console.log(response)
  })
}