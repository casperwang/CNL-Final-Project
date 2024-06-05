let backend = "https://cnl.casperwang.dev/";
chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){
  if (message === "signIn") {
    firebaseAuth()
    .then((result) => {
      senderResponse(result);
    })
  } else if(message === 'logout') {
    console.log("User logout");
    firebaseLogOut()
    .then((result) => {
      senderResponse(result);
    })
  } else if(message.type === "join"){
    console.log(message);
    apiURL = backend + "join_meeting/?user_id=" + message.token + "&meeting_url=" + message.url;
    fetch(apiURL, {
      method: 'POST',
    }).then((res) => {
      console.log(res)
      if(res.ok || res.status === 409)
        return res.json();
      throw new Error(res);
    }).then((res) => {
      console.log(res);
      senderResponse(res);
    }).catch((res) => {
      console.log(res);
      if(res.status === 404)
        showInfo("The meeting is not created.", "", "info.png");
      senderResponse("error");
    })
  } else if(message.type === "qrcode") {
    let ID = setInterval(() => {
      let queryOptions = { active: true, lastFocusedWindow: true };
      chrome.tabs.query(queryOptions, (tabs) => {
        console.log(tabs);
        console.log(message.url);
        if(tabs.length === 0 || (tabs[0].url !== message.url && tabs[0].url !== message.url + "/")){
          console.log("go to correct url!");
        }else{
          console.log("correct url");
          let apiURL = backend + "get_online_qrcode/?user_id=" + message.token + "&meeting_url=" + message.url;
          fetch(apiURL, {
            method: 'GET',
          }).then((res) => {
            if(res.ok)
              return res.json();
            throw new Error(res);
          }).then((res) => {
            console.log(res);
            if(res.status === "success"){
              showInfo("Scan it to take a roll call.", "", "https://api.qrserver.com/v1/create-qr-code/?data=" + res.content);
            }else if(res.status === "done"){
              console.log("done");
              showInfo("The meeting is finished.", "", "info.png");
              senderResponse("stop");
              clearInterval(ID);
            }
          }).catch((res) => {
            console.log(res);
            if(res.status === 404)
              showInfo("You are not in the meeting.", "Please join it first.", "info.png");
            senderResponse("error");
            clearInterval(ID);
          });
        }
      });
    }, 20000);
  }
  return true;
})

function showInfo(title, message, icon) {
  chrome.notifications.create("",
    {
      type: "basic",
      title: title,
      message: message,
      iconUrl: icon
    },
    function(id) {
      console.log("notifications", id);
    }
  );
}

const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

// A global promise to avoid concurrency issues
let creating;

// Chrome only allows for a single offscreenDocument. This is a helper function
// that returns a boolean indicating if a document is already active.
async function hasDocument() {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const matchedClients = await clients.matchAll();
  return matchedClients.some(
    (c) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)
  );
}

async function setupOffscreenDocument(path) {
  // If we do not have a document, we are already setup and can skip
  if (!(await hasDocument())) {
    // create offscreen document
    if (creating) {
      await creating;
    } else {
      creating = chrome.offscreen.createDocument({
        url: path,
        reasons: [
            chrome.offscreen.Reason.DOM_SCRAPING
        ],
        justification: 'authentication'
      });
      await creating;
      creating = null;
    }
  }
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}

async function getAuth() {
  return await new Promise(async (resolve, reject) => {
    const auth = await chrome.runtime.sendMessage({
      type: 'firebase-auth',
      target: 'offscreen',
      action: 'login'
    });
    auth?.name !== 'FirebaseError' ? resolve(auth) : reject(auth);
  })
}

async function logOut() {
  return await new Promise(async (resolve, reject) => {
    const auth = await chrome.runtime.sendMessage({
      type: 'firebase-auth',
      target: 'offscreen',
      action: 'logout'
    });
    auth?.name !== 'FirebaseError' ? resolve(auth) : reject(auth);
  })
}

async function firebaseAuth() {
  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

  const auth = await getAuth()
    .then((auth) => {
      console.log('User Authenticated', auth);
      return auth;
    })
    .catch(err => {
      if (err.code === 'auth/operation-not-allowed') {
        console.error('You must enable an OAuth provider in the Firebase' +
                      ' console in order to use signInWithPopup. This sample' +
                      ' uses Google by default.');
      } else {
        console.error(err);
        return err;
      }
    })
    .finally(closeOffscreenDocument)

  return auth;
}

async function firebaseLogOut() {
  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

  const auth = await logOut()
    .then((auth) => {
      console.log('User Logout', auth);
      return auth;
    })
    .catch(err => {
      if (err.code === 'auth/operation-not-allowed') {
        console.error('You must enable an OAuth provider in the Firebase' +
                      ' console in order to use signInWithPopup. This sample' +
                      ' uses Google by default.');
      } else {
        console.error(err);
        return err;
      }
    })
    .finally(closeOffscreenDocument)

  return auth;
}
