const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Icon URLs
const ICONS = {
    youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
  github: 'https://cdn-icons-png.flaticon.com/512/2111/2111432.png',
  duckduckgo: 'https://cdn-icons-png.flaticon.com/512/14776/14776050.png',
  chatgpt: 'https://cdn-icons-png.flaticon.com/512/12222/12222589.png',
    google: 'https://cdn-icons-png.flaticon.com/512/2702/2702602.png',
};

async function getRandomBackground() {
    const response = await fetch(
        `https://api.unsplash.com/photos/random?query=nature&orientation=landscape`,
        {
            headers: {
                Authorization: `Client-ID ${ACCESS_KEY}`,
            },
        }
    );

    const data = await response.json();

    return data.urls.full;
}

document.querySelector('.loader').style.display = 'block';

/*
getRandomBackground().then((url) => {
  document.body.style.backgroundImage = `url(${url}&w=1920&h=1080&fit=crop&q=80)`;
});*/

setTimeout(() => {
    document.querySelector('.loader').style.display = 'none';
}, 1000);

function search() {
    let url;
    let rawSearch = document.querySelector("input.searchbar").value;
    if (rawSearch.startsWith("/yt")) {
        let query = encodeURIComponent(rawSearch.replace("/yt ", ""));
        url = `https://www.youtube.com/results?search_query=${query}`;
    } else if (rawSearch.startsWith("/gh")) {
        let query = encodeURIComponent(rawSearch.replace("/gh ", ""));
        url = `https://github.com/search?q=${query}&type=repositories`
    } else if (rawSearch.startsWith("/chat")) {
        let query = encodeURIComponent(rawSearch.replace("/chat ", ""));
        url = `https://chatgpt.com/?q=${query}`
    } else if (rawSearch.startsWith("/duck")) {
        let query = encodeURIComponent(rawSearch.replace("/duck ", ""));
        url = `https://duckduckgo.com/?q=${query}`
    } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }

    window.location.href = url;
}

function updateIcons() {
    let rawSearch = document.querySelector("input.searchbar").value;
    let icon = document.querySelector('.icon')
    if (rawSearch.startsWith("/yt")) {
        icon.style.background = `url(${ICONS.youtube}) center / 30px 30px no-repeat`;
    } else if (rawSearch.startsWith("/gh")) {
        icon.style.background = `url(${ICONS.github}) center / 30px 30px no-repeat`;
    } else if (rawSearch.startsWith("/chat")) {
        icon.style.background = `url(${ICONS.chatgpt}) center / 30px 30px no-repeat`;
    } else if (rawSearch.startsWith("/duck")) {
        icon.style.background = `url(${ICONS.duckduckgo}) center / 40px 40px no-repeat`;
    } else {
        icon.style.background = `url(${ICONS.google}) center / 30px 30px no-repeat`;
    }
}

document.querySelector(".search-icon").addEventListener('click', function (event) {
    search();
});

document.querySelector("input.searchbar").addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        search();
    }
});

document.querySelector("input.searchbar").addEventListener('input', function (event) {
    updateIcons();
});

/* MAKES SURE WHEN THE USER TYPES IT GOES INTO THE SEARCHBAR */

const mainInput = document.querySelector(".searchbar");

let userInOtherInput = false;

window.addEventListener("load", () => {
  mainInput.focus();
});

document.addEventListener("focusin", (e) => {
  const el = e.target;

  if (el !== mainInput && isEditable(el)) {
    userInOtherInput = true;
  } else {
    userInOtherInput = false;
  }
});

document.addEventListener("focusout", (e) => {
  setTimeout(() => {
    const active = document.activeElement;
    userInOtherInput = active && isEditable(active) && active !== mainInput;
  }, 0);
});

function isEditable(el) {
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.isContentEditable
  );
}

document.addEventListener("keydown", (e) => {
  if (userInOtherInput) return;

  const active = document.activeElement;
  const typingInInput = isEditable(active);

  if (!typingInInput) {
    mainInput.focus();
  }
});