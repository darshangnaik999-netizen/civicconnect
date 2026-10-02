document.getElementById("complaintForm")?.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let mobile = document.getElementById("mobile").value;
    let category = document.getElementById("category").value;
    let location = document.getElementById("location").value;
    let description = document.getElementById("description").value;

    // Generate complaint ID
    let complaintId =
        "CC" + Math.floor(1000 + Math.random() * 9000);

    let complaint = {
        id: complaintId,
        name: name,
        mobile: mobile,
        category: category,
        location: location,
        description: description,
        status: "Received"
    };

    // Save complaint
    localStorage.setItem(
        complaintId,
        JSON.stringify(complaint)
    );

    document.getElementById("result").innerHTML =

        "<h2>✅ Complaint Submitted!</h2>" +

        "<p>Your Complaint ID is:</p>" +

        "<h2>" + complaintId + "</h2>" +

        "<p>Please save this ID to track your complaint.</p>";

    document.getElementById("complaintForm").reset();

});
function trackComplaint() {

    let id = document.getElementById("complaintId").value.trim();

    let data = localStorage.getItem(id);

    let result = document.getElementById("trackResult");

    if (data) {

        let complaint = JSON.parse(data);

        result.innerHTML =

            "<div class='complaint-card'>" +

            "<h2>✅ Complaint Found</h2>" +

            "<p><b>Complaint ID:</b> " +
            complaint.id +
            "</p>" +

            "<p><b>Citizen:</b> " +
            complaint.name +
            "</p>" +

            "<p><b>Issue:</b> " +
            complaint.category +
            "</p>" +

            "<p><b>Location:</b> " +
            complaint.location +
            "</p>" +

            "<p><b>Description:</b> " +
            complaint.description +
            "</p>" +

            "<h3>Status: " +
            complaint.status +
            "</h3>" +

            "</div>";

    } else {

        result.innerHTML =
            "<h3>❌ Complaint not found</h3>" +
            "<p>Please check your Complaint ID.</p>";

    }
}
let map;
let marker;

function getLocation() {

    let status =
        document.getElementById("locationStatus");

    if (!navigator.geolocation) {

        status.innerHTML =
            "❌ Geolocation is not supported.";

        return;
    }

    status.innerHTML =
        "📍 Detecting your location...";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            let latitude =
                position.coords.latitude;

            let longitude =
                position.coords.longitude;

            // Save coordinates
            document.getElementById("location").value =
                latitude + "," + longitude;

            status.innerHTML =
                "✅ Location detected<br>" +
                "Latitude: " + latitude.toFixed(6) +
                "<br>" +
                "Longitude: " + longitude.toFixed(6);

            // Create map
            if (!map) {

                map = L.map("map").setView(
                    [latitude, longitude],
                    16
                );

                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        attribution:
                        "&copy; OpenStreetMap contributors"
                    }
                ).addTo(map);

            } else {

                map.setView(
                    [latitude, longitude],
                    16
                );
            }

            // Remove old marker
            if (marker) {
                map.removeLayer(marker);
            }

            // Add marker
            marker = L.marker(
                [latitude, longitude]
            ).addTo(map);

            marker.bindPopup(
                "📍 Complaint Location"
            ).openPopup();

        },

        function(error) {

            status.innerHTML =
                "❌ Unable to detect location.<br>" +
                "Please allow location permission.";

        }

    );
}