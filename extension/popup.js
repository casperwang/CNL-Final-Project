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
    document.getElementById("meetingInfo").style.visibility = "hidden";
    localStorage.removeItem("NAME");
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("MEETING");
  })
}

function showQRcode(token, url) {
  console.log("qrcode");
  let ID = window.setInterval(() => {
    chrome.runtime.sendMessage({type: "qrcode", token: token, url: url}, (response) => {
      console.log(response);
      if(response === "stop"){
        window.clearInterval(ID);
      }
    });
  }, 60000);
}

function joinMeeting(e) {
  console.log("join meeting");
  if(e.key === "Enter"){
    let url = e.target.value;
    console.log(url);
    let token = localStorage.getItem("TOKEN");
    chrome.runtime.sendMessage({type: "join", token: token, url: url}, (response) => {
      console.log(response);
      document.getElementById("input").style.visibility = "hidden";
      document.getElementById("meetingInfo").style.visibility = "visible";
      document.getElementById("meetingURL").innerText = url;
      localStorage.setItem("MEETING", url);
      showQRcode(token, url);
    })
  }
}