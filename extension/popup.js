document.getElementById("signIn").addEventListener("click", onClick);

function onClick() {
  console.log("click");
  chrome.runtime.sendMessage("signIn");
}