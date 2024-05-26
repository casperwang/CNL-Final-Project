document.getElementById("signIn").addEventListener("click", signIn);
document.getElementById("logOut").addEventListener("click", logOut);
document.getElementById("qrcode").addEventListener("click", showQRcode);
document.getElementById("input").addEventListener("keypress", joinMeeting);
window.onload = onLoad;
// localStorage has items NAME, TOKEN, MEETING

function onLoad() {
  var name = localStorage.getItem("NAME");
  var token = localStorage.getItem("TOKEN");
  var meeting = localStorage.getItem("MEETING");
  if(token !== null){
    document.getElementById("input").style.visibility = "visible";
    document.getElementById("name").innerText = name;
    document.getElementById("signIn").style.display = "none";
    document.getElementById("logOut").style.display = "block";
  }
  if(meeting !== null){
    document.getElementById("input").style.visibility = "hidden";
    document.getElementById("meetingInfo").style.visibility = "visible";
    document.getElementById("meetingURL").innerText = meeting;
  }
}

function signIn() {
  console.log("signIn");
  chrome.runtime.sendMessage("signIn", (response) => {
    console.log(response);
    document.getElementById("input").style.visibility = "visible";
    document.getElementById("name").innerText = response.name;
    document.getElementById("signIn").style.display = "none";
    document.getElementById("logOut").style.display = "block";
    localStorage.setItem("NAME", response.name);
    localStorage.setItem("TOKEN", response.token);
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
    localStorage.removeItem("NAME");
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("MEETING");
  })
}

function showQRcode() {
  console.log("qrcode");
  chrome.runtime.sendMessage("qrcode", (response) => {
    console.log(response)
  })
}

function joinMeeting(e) {
  console.log("join meeting");
  if(e.key === "Enter"){
    console.log(e.target.value);
    let token = localStorage.getItem("TOKEN");
    chrome.runtime.sendMessage({token: token, url: e.target.value}, (response) => {
      console.log(response)
      document.getElementById("input").style.visibility = "hidden";
      document.getElementById("meetingInfo").style.visibility = "visible";
      document.getElementById("meetingURL").innerText = e.target.value;
      localStorage.setItem("MEETING", e.target.value);
    })
  }
}

chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){
  // TODO: when meeting is end background will send message -> remove item from localStorage
})