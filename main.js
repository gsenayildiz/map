import { detecIcon, detecType, setStorage } from "./helpers.js";

//! HTML den Gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//! Olay  izleyicieri
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

//! Ortak Kullanım Alanı
let map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let layerGroup = [];

//kullanıcının konumunu öğrenme
navigator.geolocation.getCurrentPosition(loadMap,console.log("Kullanıcı Kabul Etmedi"));

//haritaya tıklanılınca çalışır
function onMapClick(e){
  form.style.display = "flex";
  coords = [e.latlng.lat, e.latlng.lng];
  console.log(coords);    
};

//kullanıcının konumuna göre haritayı gösterme
function loadMap(e){
 //haritanın kurulumu
 map = new L.map("map").setView([e.coords.latitude, e.coords.longitude], 10);
 L.control;
 //haritanın nasıi gözükeceğini belirler
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//haritada imleçleri tutacağımız katman
layerGroup = L.layerGroup().addTo(map);

//localden gelen notları listeleme
renderNoteList(notes);

//haritada bir tıklanma olduğunda çalısacak fonksiyon 
map.on("click", onMapClick);
};

//ekrana marker basma
function renderMarker(item) {//marker olusturur       //katmana ekler      //tıklanıldığında popup çıkar
    console.log(item);
    L.marker(item.coords,{icon:detecIcon(item.status)}).addTo(layerGroup).bindPopup(`${item.desc}`);

};


//form gönderildiğinde çalışır
function handleSubmit(e){
    e.preventDefault();
    const desc = e.target[0].value;
    const date = e.target[1].value;
    const status = e.target[2].value;
    
    // Notes dizisine eleman ekleme
    notes.push({ id: new Date().getTime(), desc , date, status, coords});
    console.log(notes);
    //locol storage güncelleme
    setStorage(notes);

    //notları ekrana aktarabilmek için fonksiyona notes  dizisini parametre olarak gönderdik
    renderNoteList(notes);

    //form gönderildiğinde kapanır
    form.style.display = "none";
};

function renderNoteList(item){
    list.innerHTML = "";
     
    layerGroup.clearLayers();
    item.forEach((item) => {
        const listElement = document.createElement("li");
        //datasına id ekleme
        listElement.dataset.id = item.id;
        listElement.innerHTML =
         `
        <div>
        <p>${item.desc}</p>
        <p><span>Tarih:</span>${item.date}</p> 
        <p><span>Durum:</span>${detecType(item.status)}</p>
        </div>
        <i class="bi bi-x" id="delete"></i>
        <i class="bi bi-airplane-fill" id="fly"></i>
        `;
        //öncesine ekleme appnchild da olur
       list.insertAdjacentElement("afterbegin", listElement);
      //ekrana marker basma
      renderMarker(item);
    });
};

function handleClick(e){ 
    console.log(e.target.id);
    //güncellenecek elemanının id sine öğrenme
 const id = e.target.parentElement.dataset.id;
 console.log(e.target.id);
 if (e.target.id === "delete"){
    console.log("tıklanıldı");
    //idsinibildiğimiz elemanı diziden kaldırma
   notes = notes.filter((note) => note.id != id);
    console.log(notes);

//localstrage yi güncelleme
    setStorage(notes);

 //ekranı güncelleme   
    renderNoteList(notes);
    
 }

 if(e.target.id === "fly"){
   const note = notes.find((note) => note.id == id);
   map.flyTo(note.coords);
 };
 
};