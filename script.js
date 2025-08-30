function search(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success,error);
    }
    else{
        document.getElementById("demo").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function success(position){
 
    const apikey = "c0036066518f432f8eb24d2fa569c825";
    var query = position.coords.latitude + "," + position.coords.longitude;
    var apiurl = 'https://api.opencagedata.com/geocode/v1/json?';
    var geocodeurl = apiurl + 'key=' + apikey + '&q=' + encodeURIComponent(query) + '&pretty=1' + '&no_annotations=1';
    document.getElementById("buffer").innerText = 'Fetching....';
    fetch(geocodeurl)
    .then(response => response.json())
    .then(data => {
        document.getElementById("buffer").innerText = 'Fetched!!!';
        document.getElementById("buffer").innerText = '';
        if (data.results && data.results.length > 0){
          const location = data.results[0].formatted;
          document.getElementById("print").innerText = "𝙔𝙤𝙪𝙧 𝙡𝙤𝙘𝙖𝙩𝙞𝙤𝙣 𝙞𝙨: " + location;   
          spotfinder(position.coords.latitude, position.coords.longitude);
        }
        else{
            document.getElementById("print").innerText = 'Location not found';
        }
    })
    .catch(error => {
        console.error('Error fetching location:', error);
        document.getElementById("print").innerText = 'Error fetching location';
    });
}

function error(error){
    document.getElementById("demo").innerHTML = "Error: " + error.message;
}

function spotfinder(lat,lon){
    const apikey = "5ae2e3f221c38a28845f05b68da7feb165a710822fb78296c3a2bdf0";
    const radius = "15000";
    const limit = "1000";

    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&apikey=${apikey}`;
    document.getElementById("buffer").innerText = 'Fetching Spots nearby....';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        document.getElementById("buffer").innerText = '';
        if (data.features && data.features.length > 0){
            const spots = data.features;
            const namedspots = spots.filter(s => s.properties.name && s.properties.name.trim() !== "");
            const displayspots = namedspots.length > 0 ? namedspots: spots;
            const maxsuggestions = 2;
            const random = displayspots.sort(() => 0.5 - Math.random());
            const suggestions = random.slice(0,maxsuggestions);
            let output = '<br><br><h2>Spots Nearby</h2><br>';
            suggestions.forEach((spot,idx)=>{
            const name = spot.properties.name && spot.properties.name.trim() !== "" ? spot.properties.name : "Unknown";
            const kindraw = spot.properties.kinds;
            const kindTags = kindraw.split(',').map(k => k.replace(/_/g, ' ')).map(k => k.charAt(0).toUpperCase() + k.slice(1)).filter(Boolean);
            const kindDisplay = kindTags.length > 0 ? kindTags.map(tag => `<span class="kind-tag">${tag}</span>`).join(' ') : "N/A";
            output += `<div style="margin-bottom:10px;"><span class="spot-name"><b>${idx+1}. ${name}</b></span><br><i>Type/Description:</i> ${kindDisplay}</div>`;
            });
            document.getElementById("print").innerHTML += output;
        }
        else{
            document.getElementById("print").innerText = 'No spots found';
        }
    })
    .catch(error => {
        console.error('Error fetching spots:', error);
        document.getElementById("print").innerText = 'Error fetching spots';
    });
}