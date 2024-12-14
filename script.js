"use strict";

// api cidweather
const API = "cd870bd6bce36abfd019f320222ff312";

const jourEl = document.querySelector(".jour");
const dateEl = document.querySelector(".date");
const btnEL = document.querySelector(".btn_search");
const barEl = document.querySelector(".bar_input");
const icons = document.querySelector(".icons");
const infoJourEl = document.querySelector('.info_jour');
const listContentEl = document.querySelector('.list_content ul');

const jours = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
];

const jour = new Date();
const jourName = jours[jour.getDay()];
// console.log(jourName);
jourEl.textContent = jourName;

let date = jour.getDate();
let mois = jour.toLocaleDateString("default", { mois: "Long" });
let annee = jour.getFullYear();
console.log(date, mois, annee);
jourEl.textContent =  mois;

btnEL.addEventListener("click", (e) => {
    e.preventDefault();

    if (barEl.value !== "") {
        const Search = barEl.value;
        // si la bar de recherche est vide et losqu'on lance la recherche,
        barEl.value = "";

        findLocation(Search);
    } else {
        // affiche ceci
        console.log("Entrez la Ville ou le nom du Pays");
    }
});

async function findLocation(name) {
    icons.innerHTML = "";
    infoJourEl.innerHTML = "";
    listContentEl.innerHTML = "";
    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data = await fetch(API_URL);
        const result = await data.json();
        console.log(result);

        if (result.cod !== "404") {

            const ImageContent = displayImageContent(result);

            const info = infocontent(result);


            displayForeCast(result.coord.lat, result.coord.lon);

           setTimeout(()=>{
            //  const ImageContent = displayImageContent(result);
             icons.insertAdjacentHTML("afterbegin", ImageContent);
             icons.classList.add("fadeIn");
             infoJourEl.insertAdjacentHTML("afterbegin", info);
           }, 1000)
        } else {
            const message = `<h2 class="temperature">${result.cod}</h2>
    <h3 class="nuages">${result.message}</h3>`;
            icons.insertAdjacentHTML("afterbegin", message);
        }

        // const ImageContent = displayImageContent(result);
        // const html =
    } catch (error) { }
}

function displayImageContent(data) {
    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon
        }@2x.png" alt="">
    <h2 class="temperature">${Math.round(data.main.temp - 275.15)}°C</h2>
    <h3 class="nuages">${data.weather[0].description}</h3>`;
}

function infocontent(result) {
    return `<div class="content">
                        <p class="titre">Nom</p>
                        <span class="value">${result.name}</span>
                    </div>

                    <div class="content">
                        <p class="titre">Température</p>
                        <span class="value">${Math.round(result.main.temp - 275.15)}°C</span>
                    </div>

                    <div class="content">
                        <p class="titre">Humidité</p>
                        <span class="value">${result.main.humidity}%</span>
                    </div>

                    <div class="content">
                        <p class="titre">Vitesse du vent</p>
                        <span class="value">${result.wind.speed}km/h</span>
                    </div>`;
}


async function  displayForeCast(lat, lon){
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}`;
    const data = await fetch(ForeCast_API);
    const result = await data.json();
    // console.log(data);

    const uniqueForeCastDays = [];
    const daysForeCast = result.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqueForeCastDays.includes(forecastDate)){
            return uniqueForeCastDays.push(forecastDate);
        }
    })
    console.log(daysForeCast);

    daysForeCast.forEach((content, index)=>{
        if(index <=3){
            listContentEl.insertAdjacentHTML("afterbegin", forecast(content))
        }
    })
}

function forecast(frContent){

    const jour = new Date(frContent.dt_txt);
    const jourName = jours[jour.getDay()];
    console.log(jourName);
    const splitJour = jourName.split("", 3);
    // console.log(splitJour);
    const joinJour = splitJour.join("");
    console.log(joinJour);

    return`<li>
                            <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png" alt="">
                            <span>${joinJour}</span>
                            <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
                        </li>`;
}