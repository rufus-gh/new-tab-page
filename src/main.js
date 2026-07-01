const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

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
    let query = document.querySelector("input.searchbar").value;

    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    window.location.href = url;
}

document.querySelector(".search-icon").addEventListener('click', function (event) {
    search();
});

document.querySelector("input.searchbar").addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        search();
    }
})