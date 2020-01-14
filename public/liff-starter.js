var userName = 'Guest';

window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1653721993-E9RBl7Rz";   // change the default LIFF value if you are not using a node server

    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {    
    displayIsInClientInfo();
    registerButtonHandlers();

    // check if the user is logged in/out, and hide inappropriate button
    if (liff.isLoggedIn()) {
        document.getElementById('liffLoginButton').style.display = 'none';
    } else {
        document.getElementById('liffLogoutButton').style.display = 'none';
    }
}

/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
    if (liff.isInClient()) {
        document.getElementById('liffLoginButton').classList.toggle('hidden');
        document.getElementById('liffLogoutButton').classList.toggle('hidden');
        document.getElementById('isInClientMessage').textContent = 'You are opening the app in the in-app browser of LINE.';
    } else {
        document.getElementById('isInClientMessage').textContent = 'You are opening the app in an external browser.';
    }
}

/**
* Register event handlers for the buttons displayed in the app
*/
function registerButtonHandlers() {
    // closeWindow call
    if (liff.isInClient()) {
        document.getElementById('closeWindowButton').addEventListener('click', function() {
            if (!liff.isInClient()) {
                sendAlertIfNotInClient();
            } else {
                liff.closeWindow();
            }
        });        
    } else {
        document.getElementById('closeWindowButton').style.display = 'none';
    }

    // sendMessages call
    document.getElementById('sendMessageButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            if (liff.isLoggedIn()) {
                liff.getProfile().then(function(profile) {
                        window.alert('Hi juga ' + profile.displayName);
                    }).catch(function(error) {
                        console.log(error);
                    });
            } else {
                window.alert('Hi juga Guest');
            }
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': "Hi!"
            }]).then(function() {
                liff.getProfile().then(function(profile) {
                        window.alert('Hi juga ' + profile.displayName);
                    }).catch(function(error) {
                        console.log(error);
                    });
            }).catch(function(error) {
                window.alert('Error sending message: ' + error);
            });
        }
    });

    // get profile call        
    document.getElementById('getProfileButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.getProfile().then(function(profile) {
                    window.alert('Ermmmm, you are ' + profile.displayName + ' right? Am I wrong?');
                }).catch(function(error) {
                    console.log(error);
                });
        } else {
            window.alert('Ermmmm, you are Guest right? Am I wrong?');
        }
    });

    // login call, only when external browser is used
    document.getElementById('liffLoginButton').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
            liff.login();
        }
    });

    // logout call only when external browse
    document.getElementById('liffLogoutButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });
}

/**
* Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
*/
function sendAlertIfNotInClient() {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
}