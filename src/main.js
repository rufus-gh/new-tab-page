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

function resolveBackgroundUrl(url) {
    const hasQuery = url.includes('?');
    const separator = hasQuery ? '&' : '?';
    return `${url}${separator}w=1920&h=1080&fit=crop&q=80`;
}

function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });
}

function markBackgroundLoaded() {
    document.body.classList.add('background-loaded');
}

async function applyRandomBackground() {
    try {
        const rawUrl = await getRandomBackground();
        const optimizedUrl = resolveBackgroundUrl(rawUrl);

        await preloadImage(optimizedUrl);
        document.body.style.backgroundImage = `url(${optimizedUrl})`;
    } catch (error) {
        console.error('Background loading failed:', error);
    } finally {
        markBackgroundLoaded();
    }
}

applyRandomBackground();

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
        url = `https://www.google.com/search?q=${encodeURIComponent(rawSearch)}`;
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

/* geolocation for the weather */

const weatherCardEls = {
    iconImg: document.querySelector('.weather-icon img'),
    temp: document.querySelector('.temp'),
    description: document.querySelector('.description'),
};

const WEATHER_CODE_MAP = {
    0: { description: 'Clear sky', dayIcon: '01d', nightIcon: '01n' },
    1: { description: 'Mainly clear', dayIcon: '02d', nightIcon: '02n' },
    2: { description: 'Partly cloudy', dayIcon: '03d', nightIcon: '03n' },
    3: { description: 'Overcast', dayIcon: '04d', nightIcon: '04n' },
    45: { description: 'Fog', dayIcon: '50d', nightIcon: '50n' },
    48: { description: 'Depositing rime fog', dayIcon: '50d', nightIcon: '50n' },
    51: { description: 'Light drizzle', dayIcon: '09d', nightIcon: '09n' },
    53: { description: 'Moderate drizzle', dayIcon: '09d', nightIcon: '09n' },
    55: { description: 'Dense drizzle', dayIcon: '09d', nightIcon: '09n' },
    56: { description: 'Light freezing drizzle', dayIcon: '13d', nightIcon: '13n' },
    57: { description: 'Dense freezing drizzle', dayIcon: '13d', nightIcon: '13n' },
    61: { description: 'Slight rain', dayIcon: '10d', nightIcon: '10n' },
    63: { description: 'Moderate rain', dayIcon: '10d', nightIcon: '10n' },
    65: { description: 'Heavy rain', dayIcon: '10d', nightIcon: '10n' },
    66: { description: 'Light freezing rain', dayIcon: '13d', nightIcon: '13n' },
    67: { description: 'Heavy freezing rain', dayIcon: '13d', nightIcon: '13n' },
    71: { description: 'Slight snow fall', dayIcon: '13d', nightIcon: '13n' },
    73: { description: 'Moderate snow fall', dayIcon: '13d', nightIcon: '13n' },
    75: { description: 'Heavy snow fall', dayIcon: '13d', nightIcon: '13n' },
    77: { description: 'Snow grains', dayIcon: '13d', nightIcon: '13n' },
    80: { description: 'Slight rain showers', dayIcon: '09d', nightIcon: '09n' },
    81: { description: 'Moderate rain showers', dayIcon: '09d', nightIcon: '09n' },
    82: { description: 'Violent rain showers', dayIcon: '09d', nightIcon: '09n' },
    85: { description: 'Slight snow showers', dayIcon: '13d', nightIcon: '13n' },
    86: { description: 'Heavy snow showers', dayIcon: '13d', nightIcon: '13n' },
    95: { description: 'Thunderstorm', dayIcon: '11d', nightIcon: '11n' },
    96: { description: 'Thunderstorm with slight hail', dayIcon: '11d', nightIcon: '11n' },
    99: { description: 'Thunderstorm with heavy hail', dayIcon: '11d', nightIcon: '11n' },
};

function getWeatherVisuals(weatherCode, isDay) {
    const fallback = {
        description: 'Weather unavailable',
        dayIcon: '50d',
        nightIcon: '50n',
    };

    const weatherInfo = WEATHER_CODE_MAP[weatherCode] || fallback;
    const iconName = isDay ? weatherInfo.dayIcon : weatherInfo.nightIcon;

    return {
        description: weatherInfo.description,
        iconUrl: `https://openweathermap.org/img/wn/${iconName}@2x.png`,
    };
}

function updateWeatherUI(data) {
    const current = data?.current;
    const units = data?.current_units;

    if (!current || !units) {
        weatherCardEls.description.textContent = 'Weather unavailable';
        return;
    }

    const weatherCode = current.weather_code;
    const isDay = current.is_day === 1;
    const temperature = current.temperature_2m;
    const unit = units.temperature_2m || '°C';
    const { description, iconUrl } = getWeatherVisuals(weatherCode, isDay);

    weatherCardEls.temp.textContent = `${temperature} ${unit}`;
    weatherCardEls.description.textContent = description;
    weatherCardEls.iconImg.src = iconUrl;
    weatherCardEls.iconImg.alt = description;
}

navigator.geolocation.getCurrentPosition(
    (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                updateWeatherUI(data);
            })
            .catch(() => {
                weatherCardEls.description.textContent = 'Weather unavailable';
            });
    },
    (error) => {
        console.error("Location error:", error);
        weatherCardEls.description.textContent = 'Location unavailable';
    }
);

