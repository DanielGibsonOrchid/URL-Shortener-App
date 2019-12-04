/**** 
  *
  * Declare variables
  *
****/ 
const form = document.getElementById("url-form");
const inputField = document.getElementById("url-input");
const tileWrapper = document.getElementById("short-url-tile-wrapper");
const clearBtnDiv = document.getElementById('clear-btn-div');
const clearBtn = document.getElementById('clear-btn');
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenuLinks = document.getElementById("mobile-menu-links");
const bodyTag = document.getElementsByTagName('body')[0];

// Elements for Modal Window
const anchorTags = document.getElementsByTagName("a");
const modalWindow = document.getElementById("modal");
const closeModel = document.getElementsByClassName("close-modal")[0];
const signUpBtnTop = document.getElementsByClassName("btn-sign-up-desktop")[0];
const signUpBtnMobile = document.getElementsByClassName("btn-sign-up-mobile")[0];
const getStarted1 = document.getElementsByClassName("get-started")[0];
const getStarted2 = document.getElementById("getStarted");

// Local storage varialbes
let previousLocalSave = '';
let newLocalSave = [];

// Regex for testing if valid URL
const urlRGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

// variable for validation styles
const validationError = document.getElementsByClassName("validation");

// Check if loading animation is needed variable
const loadingAnimationElement = document.getElementsByClassName("loaderFlex")[0];


/**** 
  *
  * On form submit check URL is valid
  *
****/ 
form.addEventListener('submit', event => {

  event.preventDefault();

  let isValidUrl = urlRGEX.test(inputField.value);

  // If invalid add validation error style
  if ( !isValidUrl ) {
    validationError[0].style.display = "block";
    inputField.style.border = "3px solid #F56366";
    inputField.style.marginBottom = "2.2rem";

  } else {
  // if valid remove validation error style and pass URL through to API POST function
    validationError[0].style.display = "none";
    inputField.style.border = "none";
    inputField.style.marginBottom = "1rem";

    // Check if URL is in correct format. Needs "https://" or "http://"
    if (inputField.value.trimLeft().substring(0,3) === "www") {
      inputField.value = "https://" + inputField.value.trimLeft();
      postData(inputField.value);
      // Show loading animation
      loadingAnimation(true);
      // clear input field after submit
      inputField.value = '';
    } else {
      postData(inputField.value);
      loadingAnimation(true);
      inputField.value = '';
    }
  }
});


/**** 
  *
  * Fetch Post Request from API Rel.ink
  *
****/ 
async function postData(url) {
  try {
    const response = await fetch('https://rel.ink/api/links/', {
      method: 'POST',
      body: JSON.stringify({url: url}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    const shortUrl = "https://rel.ink/" + json.hashid;
    const longUrl = json.url;
    //Send URL Data to function to handle embedding it to the website
    addHtmlTile(shortUrl, longUrl);
    showClearBtn();
    loadingAnimation(false);
  } catch (error) {
    console.error('Error:', error);
  }
}


/**** 
  *
  * Check local storage on page load for previous shorten URL's
  *
****/ 
window.onload = () => {
  if (localStorage.getItem("html") !== null) {
    previousLocalSave = JSON.parse(localStorage.getItem("html"));
    
    // Embed URLs to HTML
    newLocalSave = [...previousLocalSave, ...newLocalSave];
    for (i=0; i < previousLocalSave.length; i++) {
      tileWrapper.innerHTML += previousLocalSave[i];
    }

    addEventListenerToCopyBtn();
    showClearBtn();
  }
}


/**** 
  *
  * Create HTML tile to display shortened URL
  *
****/ 
addHtmlTile = (shortUrl, longUrl) => {
  const div = document.createElement('div');
  div.className = 'copy-link-tile';
  div.innerHTML = `
    <span class="long-link">
      ${longUrl}
    </span>
    <div class="wrapper-copy-link">
      <span class="short-link">
        ${shortUrl}
      </span>
      <button class="btn-primary shorten-it btn-copy">
        Copy
      </button>
    </div>
  `
  tileWrapper.appendChild(div);

  addEventListenerToCopyBtn();

  // Save URL's and HTML tiles to local storage
  newLocalSave.push(div.outerHTML);
  localStorage.setItem("html", JSON.stringify(newLocalSave));
}


/**** 
  *
  * if Copy Button is clicked send to handle Copy Link function
  *
****/ 
addEventListenerToCopyBtn = () => {
  let copyBtns = document.querySelectorAll(".btn-copy");
  
  for (let i = 0; i < copyBtns.length; i++) {
  
    copyBtns[i].addEventListener('click', event => {
      event.preventDefault();
      handleCopyLink(copyBtns[i]);
    }, false);
  }
}


/**** 
  *
  * Handles copy button click to copy short link to clipboard
  *
****/ 
handleCopyLink = activeBtn => {
  activeBtn.innerText = "Copied!";
  activeBtn.classList.add("copied-btn");

  // Grab shortened URL that relates to the copy button
  let shortLink = activeBtn.offsetParent.children[1].firstElementChild.innerHTML.trim();
  
  // Create a temporary input element to push shortLink value to then copy it to the clipboard
  let hiddenInput = document.createElement('input');
  bodyTag.appendChild(hiddenInput);
  hiddenInput.setAttribute('value', shortLink);

  // Select input element and copy to clipboard
  hiddenInput.select();
  document.execCommand('copy');

  // Remove input element
  bodyTag.removeChild(hiddenInput);
}


/**** 
  *
  * Adds an HTML button to clear local Storage if URL tiles exist
  *
****/ 
showClearBtn = () => {
  if (tileWrapper.hasChildNodes() === true) {
    clearBtn.style.display = "inline-flex";
  }
}


/**** 
  *
  * Clear local storage and remove tiles
  *
****/ 
clearBtn.addEventListener("click", () => {
  localStorage.clear();
  clearBtn.style.display = "none";
  tileWrapper.innerHTML = '';
})


/**** 
  *
  * Toggle Mobile Menu
  *
****/ 
mobileMenuBtn.addEventListener("click", () => {
  if (mobileMenuLinks.style.display === "block") {
    mobileMenuLinks.style.display = "none"
  } else {
    mobileMenuLinks.style.display = "block";
  }
});


/**** 
  *
  * Modal window for Coming Soon features
  *
****/ 
// Function to open modal window
openModel = element => {
  element.addEventListener("click", () => {
    modalWindow.style.display = "block";
  }, false)
}

// All anchor tags open modal except last two which are for Frontend Mentor and myself link
for (let i = 0; i < anchorTags.length - 2; i++) {
  openModel(anchorTags[i]);
}

// Other buttons on page open modal
openModel(signUpBtnTop);
openModel(signUpBtnMobile);
openModel(getStarted1);
openModel(getStarted2);

// Close Model when clicking X
closeModel.addEventListener("click", () => {
  modalWindow.style.display = "none";
});

// Close Model when clicking anywhere outside of model
window.onclick = function (event) {
  if (event.target == modalWindow) {
    modalWindow.style.display = "none";
  }
}


/**** 
  *
  * Loading animation
  *
****/ 
loadingAnimation = (boolean) => {
  if (boolean) {
    loadingAnimationElement.style.display = "flex";
  } else {
    loadingAnimationElement.style.display = "none";
  }
}