
// ---------------------------
//   BASIC CONCEPT
//----------------------------



// console.log('working');


// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = ` ${data?.main?.temp.toFixed(2)} C`;
//     document.body.appendChild(newPara);
// }


// async function showWeather() {
//     try{
//     let latitude = 15.3333;
//     let longitude = 74.0833;
//  // Replace 'YOUR_API_KEY' with your actual API key
//  let API_key = "32105326773b7e05ca97b6d343a6f5c2";

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`);
    
//     const data = await response.json();
//     console.log("Weather data:->", data);
    

//     // let newPara = document.createElement('p');
//     //     newPara.textContent = ` ${data?.main?.temp.toFixed(2)} C`;
//     //     document.body.appendChild(newPara);
//     renderWeatherInfo(data);
//     }

//     catch(err){
//      // handle error here
//      console.log("error found",err);
//     }
// }

// // finding our position using geo location

// function getLocation(){

//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("device dont have geo location");
//     }
// }

// function showPosition(pos){

//     let lat = pos.coords.latitude;
//     let longi = pos.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }


//--------------------------------
// ORIGINAL PROJECT CODE
//--------------------------------
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initial variables needed???
// yes,because if we are in one tab only that tab needed to be visible other should be hidden

let currentTab = userTab;
const API_key = "32105326773b7e05ca97b6d343a6f5c2";
currentTab.classList.add("current-tab");

//if we click on any of the two tabs the corresponding function call must take place

function switchTab(clickedTab){
    if(clickedTab != currentTab){
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    currentTab.classList.add("current-tab");
    }

    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }

    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
        //grantAccessContainer.classList.add("active");
    }
}


userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

//check if your coordinates are already present in session storage
function getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        // local coordinates not available
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }


}

 async function fetchUserWeatherInfo(coordinates){

    const {lat,lon} = coordinates;
    //make grant access container invisible and make the loader visible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err){
        loadingScreen.classList.remove("active");
     // H.W
    }
     
}

function renderWeatherInfo(weatherInfo){

    //first fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    
    //fetch info from json() objects

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `http://openweathermap.org/images/flags/${weatherInfo?.sys?.country.toLowerCase()}.png`; // Corrected placeholder for country icon source
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`; // Corrected placeholder for weather icon source
    temp.innerText = ` ${weatherInfo?.main?.temp} degC`;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation(){

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        alert("cant support the navigator");
    }
}

function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon : position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);
const searchInput = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value; // Corrected from ariaValueMax to value.

    if (cityName === "") { // Corrected from = to ===
        return;
    } else {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await resp.json(); // Corrected from dat and resp.JSON() to data and resp.json()
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        alert("incorrect"); // Corrected from alert.apply("incorrect");
    }
}