let show = document.querySelector('#show');
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
document.getElementById('time').value = timeZone;
let long, lat;
// console.log(navigator);
if(navigator.geolocation){
    // console.log('dsgdsgsd');
    navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        // console.log(latitude)

        doSomeWork(longitude,latitude)
        
        // linkAdd = url;
        document.getElementById('lat').value = position.coords.latitude;
        document.getElementById('long').value = position.coords.longitude;
    })
}
else{
    document.getElementById('lat').value = "Unable";
    document.getElementById('long').value = "Unable";
}



function doSomeWork(long,lat){
    
    // console.log(long, lat);
    const url= `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        // console.log(data);
        document.getElementById('country').value = data.address.country;
        document.getElementById('postCode').value = data.address.postcode;
        document.getElementById('city').value = data.address.county;
    })
    // .catch(() => {
    //     locationElement.textContent = "Unable to retrieve location data.";
    // });
}

let now = new Date();
document.getElementById('std').value = (-now.getTimezoneOffset()/60);
document.getElementById('stdSec').value = (-now.getTimezoneOffset()*60);

const offsetStdMinutes = now.getTimezoneOffset();
const offsetStd = -offsetStdMinutes / 60;
const offsetStdSeconds = -offsetStdMinutes * 60;

  // Determine if DST is in effect
  const january = new Date(now.getFullYear(), 0, 1);
  const july = new Date(now.getFullYear(), 6, 1);
  const isDst = now.getTimezoneOffset() < Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
    // console.log(isDst);
  // DST offset in hours and seconds (only if DST is in effect)
  const offsetDst = isDst ? offsetStd - 1 : offsetStd;
  const offsetDstSeconds = isDst ? offsetStdSeconds - 3600 : offsetStdSeconds;

  document.getElementById('dst').value = offsetDst;
  document.getElementById('dstSec').value = offsetDstSeconds;

let btn = document.getElementById('btn');
btn.addEventListener('click', () => {
  let address = document.getElementById('address').value;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  fetch(url)
  .then((res) => res.json())
  .then(data => {
    let latitude = data[0].lat;
    let longitude = data[0].lon;
    const url= `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        // console.log(data);
       let lat = data.lat;
       let long = data.lon;
       let country = data.address.country;
       let city = data.address.city;
       let postCode = data.address.postcode;
       
       getTimeZone(lat, lat, country, address, postCode);
    })
  })
})

function getTimeZone(lat, long, country, city, postcode){
  // console.log(country, city, postcode);
  show.innerHTML = ` <form action="#">
  <div class="label">
      <label for="timeZone">Name of Time Zone: </label>
      <input type="text" value = ${timeZone}>
  </div>
  <div class="label">
      <label for="lat">Lat: </label>
      <input type="text" value = ${lat}>
      <label for="long">Long: </label>
      <input type="text" value = ${long}>
  </div>
  <div class="label">
      <label for="Std">OffSet STD: </label>
      <input type="text" value = ${offsetStd}>
  </div>
  <div class="label">
      <label for="stdSec">OffSet STD Seconds: </label>
      <input type="text" value = ${offsetStdSeconds}>
  </div>
  <div class="label">
      <label for="Dst">OffSet DST: </label>
      <input type="text" value = ${offsetDst}>
  </div>
  <div class="label">
      <label for="dstSec">OffSet DST Seconds: </label>
      <input type="text" value = ${offsetDstSeconds}>
  </div>
  <div class="label">
      <label for="country">Country: </label>
      <input type="text" value = ${country}>
  </div>
  <div class="label">
      <label for="postCode">PostCode: </label>
      <input type="text" value = ${postcode}>
  </div>
  <div class="label">
      <label for="city">City</label>
      <input type="text" value = ${city}>
  </div>
</form>`
}