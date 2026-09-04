// Preset district profiles across California
const DISTRICT_PRESETS = {
    sf_bay: {
        latitude: 37.88,
        longitude: -122.23,
        housing_median_age: 41,
        total_rooms: 880,
        total_bedrooms: 129,
        population: 322,
        households: 126,
        median_income: 8.3252,
        ocean_proximity: 'NEAR BAY'
    },
    la_coastal: {
        latitude: 34.02,
        longitude: -118.49,
        housing_median_age: 32,
        total_rooms: 2150,
        total_bedrooms: 420,
        population: 1100,
        households: 390,
        median_income: 5.8500,
        ocean_proximity: '<1H OCEAN'
    },
    inland_valley: {
        latitude: 36.75,
        longitude: -119.77,
        housing_median_age: 24,
        total_rooms: 1850,
        total_bedrooms: 380,
        population: 1350,
        households: 410,
        median_income: 2.3500,
        ocean_proximity: 'INLAND'
    },
    norcal: {
        latitude: 40.80,
        longitude: -124.16,
        housing_median_age: 38,
        total_rooms: 2400,
        total_bedrooms: 480,
        population: 1200,
        households: 460,
        median_income: 3.1200,
        ocean_proximity: 'NEAR OCEAN'
    }
};

let map, marker;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initLiveRatioCalculations();

    const form = document.getElementById('predictionForm');
    const predictBtn = document.getElementById('predictBtn');
    const btnText = predictBtn.querySelector('.btn-text');
    const spinner = predictBtn.querySelector('.spinner');

    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const resultContent = document.getElementById('resultContent');
    const predictedPrice = document.getElementById('predictedPrice');
    const ciRange = document.getElementById('ciRange');
    const pricePerRoom = document.getElementById('pricePerRoom');

    // Handle Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        closeAlert();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        // Basic client validation
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        if (isNaN(lat) || lat < 32.0 || lat > 42.5) {
            showAlert("Please enter a valid California latitude between 32.0 and 42.5.");
            return;
        }
        if (isNaN(lon) || lon < -125.0 || lon > -114.0) {
            showAlert("Please enter a valid California longitude between -125.0 and -114.0.");
            return;
        }

        // Set loading state
        predictBtn.disabled = true;
        btnText.textContent = "RUNNING INFERENCE PIPELINE...";
        spinner.style.display = "inline-block";

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                showAlert(result.error || "An error occurred during prediction.");
                return;
            }

            // Display Prediction
            const price = result.predicted_value;
            predictedPrice.textContent = result.formatted_value;

            // Compute Estimated CI & Price/Room for extra insight
            // Model RMSE is ~$47k
            const lowerBound = Math.max(15000, price - 47000);
            const upperBound = price + 47000;
            ciRange.textContent = `$${Math.round(lowerBound).toLocaleString()} - $${Math.round(upperBound).toLocaleString()}`;

            const rooms = parseFloat(data.total_rooms) || 1;
            const ppr = Math.round(price / rooms);
            pricePerRoom.textContent = `$${ppr.toLocaleString()}/room`;

            resultPlaceholder.style.display = "none";
            resultContent.style.display = "block";

            // Update map pin
            if (marker) {
                marker.setLatLng([lat, lon]);
                map.setView([lat, lon], Math.max(map.getZoom(), 7));
            }

        } catch (err) {
            console.error(err);
            showAlert("Failed to connect to prediction server. Please ensure app is running.");
        } finally {
            predictBtn.disabled = false;
            btnText.textContent = "PREDICT HOUSE VALUE";
            spinner.style.display = "none";
        }
    });

    // Run initial live calculation
    updateRatios();
});

// Initialize Leaflet Map
function initMap() {
    const latInput = document.getElementById('latitude');
    const lonInput = document.getElementById('longitude');

    const initialLat = parseFloat(latInput.value) || 36.7783;
    const initialLon = parseFloat(lonInput.value) || -119.4179;

    map = L.map('mapContainer').setView([initialLat, initialLon], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    marker = L.marker([initialLat, initialLon], { draggable: true }).addTo(map);

    // Map click moves marker and updates input fields
    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        // Restrict within broad California bounding box
        if (lat >= 32.0 && lat <= 42.5 && lng >= -125.0 && lng <= -114.0) {
            marker.setLatLng([lat, lng]);
            latInput.value = lat.toFixed(4);
            lonInput.value = lng.toFixed(4);
            autoSuggestOceanProximity(lat, lng);
        } else {
            showAlert("Selected point is outside California bounds.");
        }
    });

    // Marker drag updates input fields
    marker.on('dragend', () => {
        const pos = marker.getLatLng();
        latInput.value = pos.lat.toFixed(4);
        lonInput.value = pos.lng.toFixed(4);
        autoSuggestOceanProximity(pos.lat, pos.lng);
    });

    // Coordinate inputs update marker
    latInput.addEventListener('input', syncMarkerFromInputs);
    lonInput.addEventListener('input', syncMarkerFromInputs);
}

function syncMarkerFromInputs() {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);
    if (!isNaN(lat) && !isNaN(lon) && marker) {
        marker.setLatLng([lat, lon]);
    }
}

// Heuristic to update ocean proximity on map click
function autoSuggestOceanProximity(lat, lon) {
    const select = document.getElementById('ocean_proximity');
    // Near Bay Area: lat ~ 37.4 - 38.2, lon ~ -122.5 to -122.0
    if (lat >= 37.3 && lat <= 38.3 && lon >= -122.6 && lon <= -122.0) {
        select.value = "NEAR BAY";
    } else if (lon < -120.5) {
        select.value = "<1H OCEAN";
    } else {
        select.value = "INLAND";
    }
}

// Live Feature Engineering Ratios
function initLiveRatioCalculations() {
    const fields = ['total_rooms', 'total_bedrooms', 'population', 'households'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateRatios);
        }
    });
}

function updateRatios() {
    const rooms = parseFloat(document.getElementById('total_rooms').value) || 0;
    const bedrooms = parseFloat(document.getElementById('total_bedrooms').value) || 0;
    const population = parseFloat(document.getElementById('population').value) || 0;
    const households = parseFloat(document.getElementById('households').value) || 0;

    const roomsPerHhold = households > 0 ? (rooms / households).toFixed(2) : "--";
    const popPerHhold = households > 0 ? (population / households).toFixed(2) : "--";
    const bedroomsPerRoom = rooms > 0 ? (bedrooms / rooms).toFixed(3) : "--";

    document.getElementById('disp_rooms_per_hhold').textContent = roomsPerHhold;
    document.getElementById('disp_pop_per_hhold').textContent = popPerHhold;
    document.getElementById('disp_bedrooms_per_room').textContent = bedroomsPerRoom;
}

// Apply Preset
function applyPreset(presetKey) {
    const preset = DISTRICT_PRESETS[presetKey];
    if (!preset) return;

    for (const [key, val] of Object.entries(preset)) {
        const el = document.getElementById(key);
        if (el) {
            el.value = val;
        }
    }

    updateRatios();
    syncMarkerFromInputs();

    if (map) {
        map.setView([preset.latitude, preset.longitude], 8);
    }

    // Trigger prediction automatically
    const form = document.getElementById('predictionForm');
    if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
}

function showAlert(message) {
    const alertBanner = document.getElementById('alertBanner');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alertBanner.style.display = 'flex';
}

function closeAlert() {
    const alertBanner = document.getElementById('alertBanner');
    if (alertBanner) {
        alertBanner.style.display = 'none';
    }
}
