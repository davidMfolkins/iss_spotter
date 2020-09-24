const request = require('request');

const fetchMyIP = function(callback) {
  const url = 'https://api.ipify.org?format=json';

  request(url, (error, response, body) => {

    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};



const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/json/${ip}`, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const lat = JSON.parse(body).data.latitude;
    const long = JSON.parse(body).data.longitude;
    const latLong = {latitude: lat, longitude: long};

    callback(null, latLong);
  });
};

const fetchISSFlyOverTimes = function(latLong, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latLong.latitude}&lon=${latLong.longitude}`;
  request(url, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    const flyBy = JSON.parse(body).response;
    callback(null, flyBy);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, latLong) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(latLong, (error, nextPass) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPass);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };
