const fs = require('fs');
const asyncLib = require('async');
const request = require('request');
const sharp = require('sharp');
const smartcrop = require('smartcrop-sharp');


function fetchAndCrop(src, dest, width, height, continueCallback) {
  console.log('fetching', src);
  request(src, { encoding: null }, function process(error, response, body) {
    if (error) return console.error(error);
    continueCallback();
    smartcrop.crop(body, { width: width, height: height }).then(function(result) {
      var crop = result.topCrop;
      sharp(body)
        .extract({ width: crop.width, height: crop.height, left: crop.x, top: crop.y })
        .resize(width, height)
        .grayscale()
        .jpeg()
        .toFile(dest);
    });
  });
}

function fetchAndSave(src, dest, continueCallback) {
  console.log('fetching', src);
  request(src, { encoding: null }, function process(error, response, body) {
    if (error) return console.error(error);
    sharp(body)
      .jpeg()
      .toFile(dest, function(err, info) {
        if (err) console.log(err, info);
        continueCallback();
      });
  });
}



// Get array of legislators
fs.readFile('./src/data/legislators.json', function(err, data) {
  const legislators = JSON.parse(data);

  asyncLib.eachLimit(legislators, 10, function(legislator, continueCallback) {
    const src = legislator.photo_url;
    const filename = legislator.ocdId.match(/[^\/w]+$/)[0].replace(':','.');
    const dest = `./public/legislators-original/${filename}.jpg`;

    const width = 200;
    const height = 200;

    fetchAndSave(src, dest, continueCallback)
    // fetchAndCrop(src, dest, width, height, continueCallback);
  })
})


// var src = 'http://legislature.maine.gov/uploads/visual_edit/davis-color.jpg'
// var src = 'https://raw.githubusercontent.com/jwagner/smartcrop-gm/master/test/flower.jpg';
// fetchAndCrop(src, './src/data/flower-square.jpg', 100, 100);
