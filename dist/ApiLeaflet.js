import { Cargaison } from "./models/Cargaison";
import { TypeCargaison } from "./enums/TypeCargaison";
import { EtatAvancement } from "./enums/EtatAvancement";
import { EtatGlobal } from "./enums/EtatGlobal";
const countryTransportCapabilities = {
    landlocked: [
        "mali",
        "burkina faso",
        "niger",
        "chad",
        "central african republic",
        "south sudan",
        "switzerland",
        "austria",
        "luxembourg",
        "czech republic",
        "slovakia",
        "hungary",
        "belarus",
        "moldova",
        "kazakhstan",
        "uzbekistan",
        "kyrgyzstan",
        "tajikistan",
        "afghanistan",
        "nepal",
        "bhutan",
        "laos",
        "paraguay",
        "bolivia",
        "zambia",
        "zimbabwe",
        "botswana",
        "lesotho",
        "swaziland",
        "rwanda",
        "burundi",
        "uganda",
        "south sudan",
        "ethiopia",
        "armenia",
        "azerbaijan",
        "mongolia",
        "andorra",
        "vatican",
        "san marino",
        "liechtenstein",
        "macedonia",
        "serbia",
        "kosovo",
        "montenegro",
    ],
    limitedMaritime: [
        "jordan",
        "iraq",
        "lebanon",
        "israel",
        "palestine",
        "kuwait",
        "bahrain",
        "qatar",
        "montenegro",
        "bosnia and herzegovina",
        "slovenia",
        "albania",
        "georgia",
        "ukraine",
        "russia",
    ],
    islands: [
        "madagascar",
        "sri lanka",
        "maldives",
        "seychelles",
        "mauritius",
        "comoros",
        "cape verde",
        "sao tome and principe",
        "malta",
        "cyprus",
        "iceland",
        "ireland",
        "united kingdom",
        "japan",
        "philippines",
        "indonesia",
        "malaysia",
        "singapore",
        "brunei",
        "new zealand",
        "australia",
        "papua new guinea",
        "fiji",
        "tonga",
        "samoa",
        "solomon islands",
        "vanuatu",
        "palau",
        "micronesia",
        "marshall islands",
        "kiribati",
        "tuvalu",
        "nauru",
        "cuba",
        "jamaica",
        "haiti",
        "dominican republic",
        "puerto rico",
        "trinidad and tobago",
        "barbados",
        "bahamas",
        "antigua and barbuda",
        "saint lucia",
        "grenada",
        "saint vincent and the grenadines",
        "dominica",
        "saint kitts and nevis",
    ],
};
const transportHubs = {
    ports: [
        { name: "Port de Dakar", coords: [14.6937, -17.4441] },
        { name: "Port de Marseille", coords: [43.3047, 5.3756] },
        { name: "Port de New York", coords: [40.6892, -74.0445] },
        { name: "Port de Shanghai", coords: [31.2304, 121.4737] },
        { name: "Port de Rotterdam", coords: [51.9244, 4.4777] },
        { name: "Port de Singapour", coords: [1.265, 103.82] },
        { name: "Port de Dubaï", coords: [25.06, 55.13] },
        { name: "Port de Tokyo", coords: [35.61, 139.78] },
        { name: "Port de Hambourg", coords: [53.54, 9.96] },
        { name: "Port de Los Angeles", coords: [33.73, -118.26] },
    ],
    airports: [
        { name: "Aéroport Dakar (DSS)", coords: [14.7397, -17.4902] },
        { name: "Paris Charles de Gaulle (CDG)", coords: [49.0097, 2.5479] },
        { name: "Londres Heathrow (LHR)", coords: [51.47, -0.4543] },
        { name: "New York JFK (JFK)", coords: [40.6413, -73.7781] },
        { name: "Dubai International (DXB)", coords: [25.2532, 55.3657] },
        { name: "Tokyo Narita (NRT)", coords: [35.7647, 140.3864] },
        { name: "Francfort (FRA)", coords: [50.0379, 8.5622] },
        { name: "Amsterdam Schiphol (AMS)", coords: [52.3086, 4.7639] },
        { name: "Singapour Changi (SIN)", coords: [1.3592, 103.9892] },
        { name: "Los Angeles (LAX)", coords: [33.9416, -118.4085] },
    ],
};
const PROXIMITY_THRESHOLD_KM = 100;
let map = null;
let departureMarker = null;
let arrivalMarker = null;
let routePolyline = null;
let departureCoords = null;
let arrivalCoords = null;
let selectionMode = null;
let departureCountryData = null;
let arrivalCountryData = null;
function showErrorToast(message, details = "") {
    const toastContainer = document.getElementById("toast-root") || createToastContainer();
    const toast = document.createElement("div");
    toast.className = "bg-red-600 border-l-4 border-red-800 text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in";
    toast.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="fas fa-exclamation-triangle text-red-200"></i>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-bold">Transport Incompatible</h3>
                <p class="text-sm mt-1">${message}</p>${details ? ` <p class="text-xs mt-2 text-red-200">${details}</p>` : ""}
            </div>
            <button onclick="this.parentElement?.parentElement?.remove()"
class="ml-auto text-red-200 hover:text-white">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 8000);
}
function showWarningToast(message, details = "") {
    const toastContainer = document.getElementById("toast-root") || createToastContainer();
    const toast = document.createElement("div");
    toast.className =
        "bg-yellow-600 border-l-4 border-yellow-800 text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in";
    toast.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-yellow-200"></i>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-bold">Attention</h3>
                <p class="text-sm mt-1">${message}</p>${details ? ` <p class="text-xs mt-2 text-yellow-200">${details}</p>` : ""}
            </div>
            <button onclick="this.parentElement?.parentElement?.remove()"
class="ml-auto text-yellow-200 hover:text-white">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 6000);
}
function showSuccessToast(message) {
    const toastContainer = document.getElementById("toast-root") || createToastContainer();
    const toast = document.createElement("div");
    toast.className =
        "bg-green-600 border-l-4 border-green-800 text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in";
    toast.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="fas fa-check-circle text-green-200"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm font-bold">${message}</p>
            </div>
            <button onclick="this.parentElement?.parentElement?.remove()" class="ml-auto text-green-200 hover:text-white">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}
function createToastContainer() {
    let container = document.getElementById("toast-root");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-root";
        container.className = "fixed top-4 right-4 z-50 space-y-3";
        document.body.appendChild(container);
    }
    return container;
}
function extractCountryFromGeodata(data) {
    if (!data || !data.address)
        return null;
    return {
        country: data.address.country || "",
        countryCode: data.address.country_code || "",
        isLandlocked: false,
        hasLimitedMaritime: false,
        isIsland: false,
    };
}
function checkTransportCapabilities(countryName) {
    if (!countryName)
        return null;
    const country = countryName.toLowerCase();
    return {
        name: countryName,
        isLandlocked: countryTransportCapabilities.landlocked.includes(country),
        hasLimitedMaritime: countryTransportCapabilities.limitedMaritime.includes(country),
        isIsland: countryTransportCapabilities.islands.includes(country),
        canMaritime: !countryTransportCapabilities.landlocked.includes(country),
        canAerien: true,
        canRoutier: true,
    };
}
function calculateDirectDistance(coords1, coords2) {
    const R = 6371;
    const dLat = ((coords2[0] - coords1[0]) * Math.PI) / 180;
    const dLon = ((coords2[1] - coords1[1]) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coords1[0] * Math.PI) / 180) *
            Math.cos((coords2[0] * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function validateTransportType(transportType) {
    if (!departureCountryData || !arrivalCountryData || !transportType) {
        return true;
    }
    const departureCapabilities = checkTransportCapabilities(departureCountryData.country);
    const arrivalCapabilities = checkTransportCapabilities(arrivalCountryData.country);
    if (!departureCapabilities || !arrivalCapabilities) {
        return true;
    }
    switch (transportType) {
        case "MARITIME":
            if (departureCapabilities.isLandlocked) {
                showErrorToast(`Transport maritime impossible depuis ${departureCapabilities.name}`, `${departureCapabilities.name} est un pays enclavé sans accès à la mer. Utilisez le transport aérien ou routier.`);
                return false;
            }
            if (arrivalCapabilities.isLandlocked) {
                showErrorToast(`Transport maritime impossible vers ${arrivalCapabilities.name}`, `${arrivalCapabilities.name} est un pays enclavé sans accès à la mer. Utilisez le transport aérien ou routier.`);
                return false;
            }
            if (departureCapabilities.hasLimitedMaritime || arrivalCapabilities.hasLimitedMaritime) {
                showWarningToast("Transport maritime avec contraintes", "L'un des pays a un accès maritime limité. Vérifiez les ports disponibles.");
            }
            return true;
        case "ROUTIER":
            const distanceInput = document.getElementById("distanceKm");
            const distance = Number.parseFloat(distanceInput?.value || "0");
            if (distance > 5000) {
                showWarningToast("Distance importante pour transport routier", `${distance} km est une distance considérable. Le transport aérien pourrait être plus efficace.`);
            }
            if ((departureCapabilities.isIsland && !arrivalCapabilities.isIsland) ||
                (!departureCapabilities.isIsland && arrivalCapabilities.isIsland)) {
                showErrorToast("Transport routier impossible", "Le transport routier n'est pas possible entre un pays insulaire et continental. Utilisez le transport maritime ou aérien.");
                return false;
            }
            return true;
        case "AERIEN":
            return true;
        default:
            return true;
    }
}
function initMap() {
    setTimeout(() => {
        if (!window.L) {
            console.error("La bibliothèque Leaflet n'est pas chargée.");
            return;
        }
        map = window.L.map("map", {
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true,
            zoomControl: true,
        }).setView([20, 0], 2);
        const osmLayer = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 18,
        });
        const satelliteLayer = window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            attribution: "© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
            maxZoom: 18,
        });
        osmLayer.addTo(map);
        const baseLayers = {
            "Carte Standard": osmLayer,
            "Vue Satellite": satelliteLayer,
        };
        window.L.control.layers(baseLayers).addTo(map);
        map.zoomControl.setPosition("topright");
        map.on("click", onMapClick);
        setTimeout(() => {
            map?.invalidateSize();
        }, 100);
        console.log("Carte initialisée avec succès");
    }, 500);
}
function onMapClick(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    if (selectionMode === "departure") {
        setDeparturePoint(lat, lng);
        selectionMode = null;
        updateModeButtons();
    }
    else if (selectionMode === "arrival") {
        setArrivalPoint(lat, lng);
        selectionMode = null;
        updateModeButtons();
    }
}
async function setDeparturePoint(lat, lng) {
    departureCoords = [lat, lng];
    if (departureMarker) {
        map?.removeLayer(departureMarker);
    }
    if (map) {
        departureMarker = window.L.marker([lat, lng], {
            icon: window.L.icon({
                iconUrl: "data:image/svg+xml;base64," +
                    btoa(`
               <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
                   <path fill="#00bcd4" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 7.5 12.5 28.5 12.5 28.5S25 20 25 12.5C25 5.6 19.4 0 12.5 0z"/>
                   <circle cx="12.5" cy="12.5" r="7" fill="white"/>
                   <text x="12.5" y="17" text-anchor="middle" fill="#00bcd4" font-size="10" font-weight="bold">D</text>
               </svg>
           `),
            }),
        }).addTo(map);
    }
    const departureCoordsEl = document.getElementById("departure-coords");
    if (departureCoordsEl) {
        departureCoordsEl.textContent = `Coordonnées: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
    await reverseGeocode(lat, lng, "lieuDepart");
    if (arrivalCoords) {
        calculateDistance();
    }
}
async function setArrivalPoint(lat, lng) {
    arrivalCoords = [lat, lng];
    if (arrivalMarker) {
        map?.removeLayer(arrivalMarker);
    }
    if (map) {
        arrivalMarker = window.L.marker([lat, lng], {
            icon: window.L.icon({
                iconUrl: "data:image/svg+xml;base64," +
                    btoa(`
               <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
                   <path fill="#4caf50" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 7.5 12.5 28.5 12.5 28.5S25 20 25 12.5C25 5.6 19.4 0 12.5 0z"/>
                   <circle cx="12.5" cy="12.5" r="7" fill="white"/>
                   <text x="12.5" y="17" text-anchor="middle" fill="#4caf50" font-size="10" font-weight="bold">A</text>
               </svg>
           `),
            }),
        }).addTo(map);
    }
    const arrivalCoordsEl = document.getElementById("arrival-coords");
    if (arrivalCoordsEl) {
        arrivalCoordsEl.textContent = `Coordonnées: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
    await reverseGeocode(lat, lng, "lieuArrivee");
    if (departureCoords) {
        calculateDistance();
    }
}
function updateModeButtons() {
    const departureBtn = document.getElementById("select-departure-mode");
    const arrivalBtn = document.getElementById("select-arrival-mode");
    if (departureBtn) {
        departureBtn.className =
            "w-full px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-white text-xs transition-colors";
    }
    if (arrivalBtn) {
        arrivalBtn.className =
            "w-full px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs transition-colors";
    }
    if (selectionMode === "departure") {
        if (departureBtn) {
            departureBtn.className = "w-full px-3 py-1 bg-cyan-400 rounded text-gray-900 text-xs font-bold";
            departureBtn.innerHTML = '<i class="fas fa-crosshairs mr-1"></i> Cliquez sur la carte';
        }
        if (map) {
            map.getContainer().style.cursor = "crosshair";
        }
    }
    else {
        if (departureBtn) {
            departureBtn.innerHTML = '<i class="fas fa-map-marker-alt mr-1"></i> Départ';
        }
    }
    if (selectionMode === "arrival") {
        if (arrivalBtn) {
            arrivalBtn.className = "w-full px-3 py-1 bg-green-400 rounded text-gray-900 text-xs font-bold";
            arrivalBtn.innerHTML = '<i class="fas fa-crosshairs mr-1"></i> Cliquez sur la carte';
        }
        if (map) {
            map.getContainer().style.cursor = "crosshair";
        }
    }
    else {
        if (arrivalBtn) {
            arrivalBtn.innerHTML = '<i class="fas fa-map-marker-alt mr-1"></i> Arrivée';
        }
    }
    if (selectionMode === null) {
        if (map) {
            map.getContainer().style.cursor = "";
        }
    }
}
async function reverseGeocode(lat, lng, inputId) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        const inputEl = document.getElementById(inputId);
        if (inputEl) {
            inputEl.value = address;
        }
        const countryData = extractCountryFromGeodata(data);
        if (countryData) {
            if (inputId === "lieuDepart") {
                departureCountryData = countryData;
            }
            else if (inputId === "lieuArrivee") {
                arrivalCountryData = countryData;
            }
        }
        const currentTransportTypeEl = document.getElementById("typeTransport");
        const currentTransportType = currentTransportTypeEl?.value || "";
        if (currentTransportType) {
            setTimeout(() => validateTransportType(currentTransportType), 500);
        }
    }
    catch (error) {
        console.error("Erreur de géocodage inverse:", error);
        const inputEl = document.getElementById(inputId);
        if (inputEl) {
            inputEl.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    }
}
async function searchLocation(query, callback, inputId) {
    if (query.length < 3)
        return;
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`);
        const data = await response.json();
        if (data.length > 0) {
            const result = data[0];
            const countryData = extractCountryFromGeodata(result);
            if (countryData) {
                if (inputId === "lieuDepart") {
                    departureCountryData = countryData;
                }
                else if (inputId === "lieuArrivee") {
                    arrivalCountryData = countryData;
                }
            }
        }
        callback(data);
    }
    catch (error) {
        console.error("Erreur de recherche:", error);
    }
}
function calculateDistance() {
    if (!departureCoords || !arrivalCoords)
        return;
    const typeTransportEl = document.getElementById("typeTransport");
    const cargoType = typeTransportEl?.value || "";
    if (!validateTransportType(cargoType)) {
        clearMapAndDistanceInfo();
        return;
    }
    const directDistance = calculateDirectDistance(departureCoords, arrivalCoords);
    const realDistance = directDistance;
    const directDistanceEl = document.getElementById("direct-distance");
    const calculatedDistanceEl = document.getElementById("calculated-distance");
    const distanceKmInput = document.getElementById("distanceKm");
    if (directDistanceEl)
        directDistanceEl.textContent = `${Math.round(directDistance)} km`;
    if (calculatedDistanceEl)
        calculatedDistanceEl.textContent = `${Math.round(realDistance)} km`;
    if (distanceKmInput)
        distanceKmInput.value = `${Math.round(realDistance)}`;
    let estimatedTime = "";
    let estimatedCost = "";
    let transportIconClass = "";
    switch (cargoType) {
        case "MARITIME":
            estimatedTime = `${Math.ceil(realDistance / 35)} heures`;
            estimatedCost = `${(realDistance * 0.8).toLocaleString("fr-FR")} F`;
            transportIconClass = "fas fa-ship";
            break;
        case "AERIEN":
            estimatedTime = `${Math.ceil(realDistance / 650)} heures`;
            estimatedCost = `${(realDistance * 2.5).toLocaleString("fr-FR")} F`;
            transportIconClass = "fas fa-plane";
            break;
        case "ROUTIER":
            estimatedTime = `${Math.ceil(realDistance / 70)} heures`;
            estimatedCost = `${(realDistance * 0.3).toLocaleString("fr-FR")} F`;
            transportIconClass = "fas fa-truck";
            break;
        default:
            estimatedTime = "--";
            estimatedCost = "--";
            transportIconClass = "";
    }
    const estimatedTimeEl = document.getElementById("estimated-time");
    const estimatedCostEl = document.getElementById("estimated-cost");
    if (estimatedTimeEl)
        estimatedTimeEl.textContent = estimatedTime;
    if (estimatedCostEl)
        estimatedCostEl.textContent = estimatedCost;
    updateTransportIcon(transportIconClass);
    updateTransportIndicator(cargoType);
    if (cargoType) {
        drawRoute(cargoType);
    }
}
function drawRoute(cargoType) {
    if (!map)
        return;
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }
    let routeColor;
    switch (cargoType) {
        case "MARITIME":
            routeColor = "#0ea5e9";
            break;
        case "AERIEN":
            routeColor = "#f59e0b";
            break;
        case "ROUTIER":
            routeColor = "#10b981";
            break;
        default:
            routeColor = "#6b7280";
    }
    if (departureCoords && arrivalCoords) {
        routePolyline = window.L.polyline([departureCoords, arrivalCoords], {
            color: routeColor,
            weight: 3,
            opacity: 0.8,
        }).addTo(map);
        const group = window.L.featureGroup([departureMarker, arrivalMarker, routePolyline].filter(Boolean));
        map.fitBounds(group.getBounds().pad(0.1));
    }
}
function clearMapAndDistanceInfo() {
    if (map && routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }
    const distanceKmInput = document.getElementById("distanceKm");
    const directDistanceEl = document.getElementById("direct-distance");
    const calculatedDistanceEl = document.getElementById("calculated-distance");
    const estimatedTimeEl = document.getElementById("estimated-time");
    const estimatedCostEl = document.getElementById("estimated-cost");
    if (distanceKmInput)
        distanceKmInput.value = "";
    if (directDistanceEl)
        directDistanceEl.textContent = "-- km";
    if (calculatedDistanceEl)
        calculatedDistanceEl.textContent = "-- km";
    if (estimatedTimeEl)
        estimatedTimeEl.textContent = "--";
    if (estimatedCostEl)
        estimatedCostEl.textContent = "--";
    updateTransportIcon("");
    updateTransportIndicator("");
}
function clearAllMarkers() {
    if (map) {
        if (departureMarker) {
            map.removeLayer(departureMarker);
            departureMarker = null;
        }
        if (arrivalMarker) {
            map.removeLayer(arrivalMarker);
            arrivalMarker = null;
        }
    }
    clearMapAndDistanceInfo();
    departureCoords = null;
    arrivalCoords = null;
    departureCountryData = null;
    arrivalCountryData = null;
    const lieuDepartEl = document.getElementById("lieuDepart");
    const lieuArriveeEl = document.getElementById("lieuArrivee");
    const departureCoordsEl = document.getElementById("departure-coords");
    const arrivalCoordsEl = document.getElementById("arrival-coords");
    if (lieuDepartEl)
        lieuDepartEl.value = "";
    if (lieuArriveeEl)
        lieuArriveeEl.value = "";
    if (departureCoordsEl)
        departureCoordsEl.textContent = "Coordonnées: Non définies";
    if (arrivalCoordsEl)
        arrivalCoordsEl.textContent = "Coordonnées: Non définies";
    map?.setView([20, 0], 2);
}
function calculateDuration() {
    const startDateEl = document.getElementById("dateDepart");
    const endDateEl = document.getElementById("dateArrivee");
    const durationInfoEl = document.getElementById("duration-info");
    const startDate = startDateEl?.value;
    const endDate = endDateEl?.value;
    if (startDate && endDate && durationInfoEl) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        durationInfoEl.innerHTML = `<i class="fas fa-clock mr-2"></i>Durée prévue: ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    }
    else if (durationInfoEl) {
        durationInfoEl.textContent = "Sélectionnez les dates pour voir la durée du transport";
    }
}
function updateTransportIcon(iconClass) {
    const transportIconEl = document.getElementById("transport-icon");
    if (transportIconEl) {
        transportIconEl.className = `absolute right-3 top-1/2 transform -translate-y-1/2 text-lg opacity-50 ${iconClass}`;
    }
}
function updateTransportIndicator(type) {
    const indicatorEl = document.getElementById("transport-indicator");
    const transportModeEl = document.getElementById("transport-mode");
    if (indicatorEl && transportModeEl) {
        if (type) {
            indicatorEl.classList.remove("hidden");
            transportModeEl.textContent = type.toUpperCase();
        }
        else {
            indicatorEl.classList.add("hidden");
            transportModeEl.textContent = "";
        }
    }
}
function generateCargoNumber() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-4);
    return `CARG-${day}${month}-${timestamp}`;
}
document.addEventListener("DOMContentLoaded", () => {
    initMap();
    const selectDepartureModeBtn = document.getElementById("select-departure-mode");
    const selectArrivalModeBtn = document.getElementById("select-arrival-mode");
    const clearMarkersBtn = document.getElementById("clear-markers");
    const setDepartureBtn = document.getElementById("set-departure");
    const setArrivalBtn = document.getElementById("set-arrival");
    const typeTransportSelect = document.getElementById("typeTransport");
    const dateDepartInput = document.getElementById("dateDepart");
    const dateArriveeInput = document.getElementById("dateArrivee");
    const lieuDepartInput = document.getElementById("lieuDepart");
    const lieuArriveeInput = document.getElementById("lieuArrivee");
    const formCargaison = document.getElementById("form-cargaison");
    const clearFormBtn = document.getElementById("clear-form");
    const numeroInput = document.getElementById("numero");
    numeroInput.value = generateCargoNumber();
    selectDepartureModeBtn?.addEventListener("click", () => {
        selectionMode = selectionMode === "departure" ? null : "departure";
        updateModeButtons();
    });
    selectArrivalModeBtn?.addEventListener("click", () => {
        selectionMode = selectionMode === "arrival" ? null : "arrival";
        updateModeButtons();
    });
    clearMarkersBtn?.addEventListener("click", () => {
        clearAllMarkers();
    });
    setDepartureBtn?.addEventListener("click", () => {
        selectionMode = selectionMode === "departure" ? null : "departure";
        updateModeButtons();
    });
    setArrivalBtn?.addEventListener("click", () => {
        selectionMode = selectionMode === "arrival" ? null : "arrival";
        updateModeButtons();
    });
    typeTransportSelect?.addEventListener("change", function () {
        const selectedType = this.value; // Caster en TypeCargaison
        // Définir poidsMax automatiquement en fonction du type de transport
        let newPoidsMax;
        switch (selectedType) {
            case TypeCargaison.MARITIME:
                newPoidsMax = 50000;
                break;
            case TypeCargaison.AERIEN:
                newPoidsMax = 5000;
                break;
            case TypeCargaison.ROUTIER:
                newPoidsMax = 25000;
                break;
            default:
                newPoidsMax = 0; // Valeur par défaut si le type n'est pas reconnu
        }
        const poidsMaxInput = document.getElementById("poidsMax");
        if (poidsMaxInput) {
            poidsMaxInput.value = newPoidsMax.toString();
        }
        if (!validateTransportType(selectedType)) {
            this.value = "";
            clearMapAndDistanceInfo();
            return;
        }
        if (departureCoords && arrivalCoords) {
            calculateDistance();
        }
        else {
            let transportIconClass = "";
            switch (selectedType) {
                case "MARITIME":
                    transportIconClass = "fas fa-ship";
                    break;
                case "AERIEN":
                    transportIconClass = "fas fa-plane";
                    break;
                case "ROUTIER":
                    transportIconClass = "fas fa-truck";
                    break;
            }
            updateTransportIcon(transportIconClass);
            updateTransportIndicator(selectedType);
        }
    });
    dateDepartInput?.addEventListener("change", calculateDuration);
    dateArriveeInput?.addEventListener("change", calculateDuration);
    let departureTimeout;
    lieuDepartInput?.addEventListener("input", function () {
        clearTimeout(departureTimeout);
        const query = this.value;
        if (query.length >= 3) {
            departureTimeout = window.setTimeout(async () => {
                await searchLocation(query, (results) => {
                    if (results.length > 0) {
                        const result = results[0];
                        const lat = Number.parseFloat(result.lat);
                        const lng = Number.parseFloat(result.lon);
                        setDeparturePoint(lat, lng);
                        map?.setView([lat, lng], 10);
                    }
                }, "lieuDepart");
            }, 1000);
        }
    });
    let arrivalTimeout;
    lieuArriveeInput?.addEventListener("input", function () {
        clearTimeout(arrivalTimeout);
        const query = this.value;
        if (query.length >= 3) {
            arrivalTimeout = window.setTimeout(async () => {
                await searchLocation(query, (results) => {
                    if (results.length > 0) {
                        const result = results[0];
                        const lat = Number.parseFloat(result.lat);
                        const lng = Number.parseFloat(result.lon);
                        setArrivalPoint(lat, lng);
                        map?.setView([lat, lng], 10);
                    }
                }, "lieuArrivee");
            }, 1000);
        }
    });
    formCargaison?.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!departureCoords || !arrivalCoords) {
            showErrorToast("Points manquants", "Veuillez sélectionner les lieux de départ et d'arrivée.");
            return;
        }
        const transportType = document.getElementById("typeTransport")?.value;
        if (!transportType) {
            showErrorToast("Type requis", "Veuillez sélectionner un type de transport.");
            return;
        }
        if (!validateTransportType(transportType)) {
            return;
        }
        const poidsMaxInput = document.getElementById("poidsMax");
        const distanceKmInput = document.getElementById("distanceKm");
        const lieuDepartInput = document.getElementById("lieuDepart");
        const lieuArriveeInput = document.getElementById("lieuArrivee");
        const dateDepartInput = document.getElementById("dateDepart");
        const dateArriveeInput = document.getElementById("dateArrivee");
        const numeroInput = document.getElementById("numero");
        // Assurez-vous que poidsMax est à jour avant de créer l'instance de Cargaison
        let calculatedPoidsMax;
        switch (transportType) {
            case TypeCargaison.MARITIME:
                calculatedPoidsMax = 50000;
                break;
            case TypeCargaison.AERIEN:
                calculatedPoidsMax = 5000;
                break;
            case TypeCargaison.ROUTIER:
                calculatedPoidsMax = 25000;
                break;
            default:
                calculatedPoidsMax = 0;
        }
        poidsMaxInput.value = calculatedPoidsMax.toString(); // Mettre à jour le champ visible
        // Création d'une nouvelle instance de Cargaison avec toutes les données nécessaires
        const cargaison = new Cargaison({
            numero: numeroInput.value,
            poidsMax: calculatedPoidsMax, // Utiliser la valeur calculée
            type: transportType,
            distanceKm: Number.parseFloat(distanceKmInput?.value || "0"),
            lieuDepart: {
                nom: lieuDepartInput?.value || "",
                latitude: departureCoords[0], // Utiliser l'assertion non-nulle car vérifié plus haut
                longitude: departureCoords[1],
                pays: departureCountryData?.country || "",
            },
            lieuArrivee: {
                nom: lieuArriveeInput?.value || "",
                latitude: arrivalCoords[0], // Utiliser l'assertion non-nulle
                longitude: arrivalCoords[1],
                pays: arrivalCountryData?.country || "",
            },
            dateDepart: new Date(dateDepartInput?.value || ""),
            dateArrivee: new Date(dateArriveeInput?.value || ""),
            etatAvancement: EtatAvancement.EN_ATTENTE,
            etatGlobal: EtatGlobal.OUVERT,
            colis: [], // Initialiser avec un tableau vide de colis
        });
        // La méthode toJSON() de la classe Cargaison inclut maintenant toutes les données
        const dataToSend = cargaison.toJSON();
        try {
            const response = await fetch("http://localhost:3000/cargaisons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend), // Envoyer directement l'objet retourné par toJSON
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur HTTP: ${response.status} - ${errorData.message || response.statusText}`);
            }
            const result = await response.json();
            console.log("Cargaison créée avec succès sur le serveur:", result);
            showSuccessToast("Cargaison créée avec succès !");
            formCargaison.reset(); // Réinitialise le formulaire
            clearAllMarkers(); // Efface les marqueurs et infos de la carte
            numeroInput.value = generateCargoNumber(); // Génère un nouveau numéro pour la prochaine cargaison
        }
        catch (error) {
            console.error("Erreur lors de la création de la cargaison:", error);
            showErrorToast("Échec de la création de la cargaison", `Veuillez vérifier le serveur JSON. Détails: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    clearFormBtn?.addEventListener("click", () => {
        formCargaison?.reset();
        clearAllMarkers();
        const durationInfoEl = document.getElementById("duration-info");
        if (durationInfoEl) {
            durationInfoEl.textContent = "Sélectionnez les dates pour voir la durée du transport";
        }
        numeroInput.value = generateCargoNumber();
    });
});
window.currentPage = "creation-cargaison";
