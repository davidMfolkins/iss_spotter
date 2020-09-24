const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  
  //cant use this code, ipvigilante has blocked me :()
  // const ip = JSON.parse(body).ip;

  // return request(`https://ipvigilante.com/json/${ip}`)
  const latLong = { latitude: '45.51150', longitude: '-73.56830' }
  return latLong
};

const fetchISSFlyOverTimes = function(body) {

  const latLong = { latitude: '45.51150', longitude: '-73.56830' }
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latLong.latitude}&lon=${latLong.longitude}`;

  return request(url)
}

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const { response } = JSON.parse(data);
    return response;
  });
};

module.exports = { nextISSTimesForMyLocation };
