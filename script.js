// Map initialization
const map = L.map('map').setView([-7.970889, 112.668351], 13);

let currentMarker = undefined
const latlng = {
    lat: 0,
    lng: 0
}

// osm layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function mark(event) {
    cancel()
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    latlng.lat = lat;
    latlng.lng = lng;

    const marker = new L.marker([lat, lng]).addTo(map)
    
    currentMarker = marker

    marker.bindPopup(`
        <div style="width:120px;">
            <div class="mb-1">
                <label for="nama" class="form-label"> Nama </label>
                <input type="text" class="form-control" name="nama" id="nama"/>
            </div>
            <div class="mb-1">
                <label for="kategori" class="form-label"> Kategori </label>
                <input type="text" class="form-control" name="kategori" id="kategori"/>
            </div>
            <div class="mb-1">
                <label for="deskripsi" class="form-label"> Deskripsi </label>
                <textarea type="text" name="deskripsi" class="form-control" style="resize:none;" cols="5" rows="1" id="deskripsi"></textarea>
            </div>
            <div class="mb-1">
                <label for="alamat" class="form-label"> Alamat </label>
                <textarea type="text" name="alamat" class="form-control" style="resize:none;" cols="5" rows="1" id="alamat"></textarea>
            </div>
            <div class="mb-1">
                <label for="rating" class="form-label"> Rating </label>
                <textarea type="text" name="rating" class="form-control" style="resize:none;" cols="5" rows="1" id="rating"></textarea>
            </div>
            <div class="d-flex">
                <button onclick="addPlace()" class="btn btn-primary" type="button">Tambah</button>
                <button onclick="cancel()" class="btn btn-danger" type="button">Batal</button>
            </div>
        </div>
    `)
    .openPopup()
}

function addPlace() {
    const nama = document.getElementById('nama').value 
    const kategori = document.getElementById('kategori').value 
    const deskripsi = document.getElementById('deskripsi').value
    const alamat = document.getElementById('alamat').value
    const rating = document.getElementById('rating').value

    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {
        if(xhr.status === 200 && xhr.readyState === 4) {
            console.log(xhr.responseText)
        }
    }

    xhr.open("POST", "insert.php", true)
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.send(`nama=${nama}&kategori=${kategori}&deskripsi=${deskripsi}&lat=${latlng.lat}&lng=${latlng.lng}&alamat=${alamat}&rating=${rating},`)

    currentMarker = undefined
    map.closePopup()

    return false    
}

function cancel() {
    if (currentMarker !== undefined) {
        map.removeLayer(currentMarker)
    }
}

map.on('click', mark)  

//===================================================================================================================
// Fetch and add places to the map
function fetchPlaces() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            const places = JSON.parse(xhr.responseText);

            places.forEach(place => {
                const marker = L.marker([place.lat, place.lng]).addTo(map);
                marker.bindPopup(`
                    <strong>${place.name}</strong>
                    <p>${place.description}</p>
                    <p>Alamat: ${place.alamat}</p>
                    <p>Kategori: ${place.category}</p>
                    <p>Rating: ${place.rating}</p>
                `);
            });
        }
    };

    xhr.open("GET", "fetch_places.php", true);
    xhr.send();
}

// Call fetchPlaces when the script is loaded
fetchPlaces();

//========================================================================

// Function to make marker draggable
function makeDraggable(marker, place) {
    marker.options.draggable = true; // Allow marker to be draggable

    marker.on('dragend', function(event) { // Menangani saat marker digeser
        const newLatLng = event.target.getLatLng();
        
        // Update popup to allow editing and updating
        marker.bindPopup(`
            <div style="width: 150px;">
                <div class="mb-1">
                    <label for="nama" class="form-label">Nama</label>
                    <input type="text" class="form-control" id="update-nama" value="${place.name}">
                </div>
                <div class="mb-1">
                    <label for="kategori" class="form-label">Kategori</label>
                    <input type="text" class="form-control" id="update-kategori" value="${place.category}">
                </div>
                <div class="mb-1">
                    <label for="deskripsi" class="form-label">Deskripsi</label>
                    <textarea class="form-control" id="update-deskripsi" rows="2">${place.description}</textarea>
                </div>
                <div class="mb-1">
                    <label for="alamat" class="form-label">Alamat</label>
                    <textarea class="form-control" id="update-alamat" rows="2">${place.alamat}</textarea>
                </div>
                <div class="mb-1">
                    <label for="rating" class="form-label">Rating</label>
                    <input type="number" class="form-control" id="update-rating" value="${place.rating}">
                </div>
                <button class="btn btn-primary" onclick="updatePlace(${place.id}, ${newLatLng.lat}, ${newLatLng.lng})">Update</button>
                <button onclick="closePopup()" class="btn btn-danger" type="button">Batal</button>

            </div>
        `).openPopup();
    });
}

function closePopup() {
    map.closePopup(); // Menutup pop-up
}


// Fetch all places and add them to the map
function fetchPlaces() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const places = JSON.parse(xhr.responseText);

            places.forEach(place => {
                const marker = L.marker([place.lat, place.lng], { draggable: true }).addTo(map);

                makeDraggable(marker, place); // Enable draggable feature

                marker.bindPopup(`
                    <strong>${place.name}</strong>
                    <p>${place.description}</p>
                    <p>Alamat: ${place.alamat}</p>
                    <p>Kategori: ${place.category}</p>
                    <p>Rating: ${place.rating}</p>
                `);
            });
        }
    };

    xhr.open("GET", "fetch_places.php", true);
    xhr.send();
}

// Function to update place
function updatePlace(id, lat, lng) {
    const nama = document.getElementById("update-nama").value;
    const kategori = document.getElementById("update-kategori").value;
    const deskripsi = document.getElementById("update-deskripsi").value;
    const alamat = document.getElementById("update-alamat").value;
    const rating = document.getElementById("update-rating").value;

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Menutup pop-up dan menampilkan pesan konfirmasi
            map.closePopup(); // Tutup pop-up setelah update
            swal("Update berhasil!", "Data tempat telah diperbarui.", "success"); // Pesan konfirmasi
        }
    };

    xhr.open("POST", "update_place.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(`id=${id}&nama=${nama}&kategori=${kategori}&deskripsi=${deskripsi}&lat=${lat}&lng=${lng}&alamat=${alamat}&rating=${rating}`);
}

// Fetch existing places when the script is loaded
fetchPlaces();

// DELETE
function handleMarkerRightClick(event) {
    const marker = event.target;

    swal({
        title: 'Anda Yakin Menghapus Alamat?',
        content: {
            element: "div",
        },
        buttons: {
                text: "OK",
                value: true,
                visible: true,
                className: "btn btn-primary"
            
        }
    }, function(value) {
        if (value) {
            deleteMarker(marker);
        }
    });
}

function deleteMarker(marker) {
    const placeId = marker.placeId;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Tempat berhasil dihapus.");
            map.removeLayer(marker);
        }
    };
    xhr.open("POST", "delete.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(`id=${placeId}`);
    window.location.href = "http://localhost/case4.1/";
}


// Fetch all places and add them to the map
function fetchPlaces() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const places = JSON.parse(xhr.responseText);

            places.forEach(place => {
                const marker = L.marker([place.lat, place.lng], { draggable: true }).addTo(map);

                makeDraggable(marker, place); // Enable draggable feature

                marker.bindPopup(`
                    <strong>${place.name}</strong>
                    <p>${place.description}</p>
                    <p>Alamat: ${place.alamat}</p>
                    <p>Kategori: ${place.category}</p>
                    <p>Rating: ${place.rating}</p>
                `);

                marker.on('contextmenu', handleMarkerRightClick); // Add right-click event listener
                marker.placeId = place.id; // Attach place ID to marker
            });
        }
    };

    xhr.open("GET", "fetch_places.php", true);
    xhr.send();
}
