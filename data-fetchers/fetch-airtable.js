require('dotenv').config()
const _        = require('lodash')
const fs       = require('fs')
const asyncLib = require('async')
const fetch    = require('node-fetch')

// Configure Airtable API
// const Airtable = require('airtable')
//                .configure({ apiKey: process.env.AIRTABLE_API_KEY });
// const base = Airtable.base(process.env.AIRTABLE_BASE);

const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE);


// Abstracted function to fetch all records of a particular table
function getRecordsFromTable(tableName, iteratee, cb) {
  console.log('fetching', tableName)

  base(tableName).select({
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
      iteratee(record)
    });

    fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; }
    console.log('retrieved', tableName)
    cb()
  });
}




// ----------------------------------------------------------------------------
// Fetch Legislator's table and merge with existing legislator data
// ----------------------------------------------------------------------------

function fetchLegislatorsAndBills() {
  fs.readFile('./src/data/legislators.json', function(err, data) {
    if (err) {
      console.log(err)
      return;
    }

    const legislators = JSON.parse(data)
    const legislatorsByOcdId = {}

    legislators.forEach(function(legislator) {
      legislatorsByOcdId[legislator.ocdId] = legislator
    })


    const billNameRegExp = /^(LD|HP)\s/

    getRecordsFromTable('legislators', function(record) {
      const fields = record.fields

      const ocdIdChamber = fields.legislative_chamber === "House" ? 'sldl' : 'sldu'
      const ocdId = `ocd-division/country:us/state:me/${ocdIdChamber}:${fields.district_number}`

      const votes = {}
      _.forOwn(fields, function(value, key) {
        if (key.match(billNameRegExp)) {
          votes[key] = _.capitalize(value)
        }
      })

      const legislator = {
        political_party: fields.political_party,
        term_limited: fields.term_limited,
        seeking_reelection: parseBool(fields.seeking_reelection),
        votes: votes,
      }

      Object.assign(legislatorsByOcdId[ocdId], legislator)
    }, function() {

      // Fetch bills from Airtable and calculate voting score
      fetchBillData(function(bills) {
        // Index bills by id
        const billsById = {}
        bills.forEach(function(bill) {
          billsById[bill.id] = bill
        })

        const missingBillIds = []

        // Iterate through each legislator's votes and tally scores
        legislators.forEach(function(legislator) {
          let mpaTally = 0,
          mpaTotal = 0,
          voterTally = 0,
          voterTotal = 0;

          _.forOwn(legislator.votes, function(legislator_stance, billId) {
            const bill = billsById[billId]
            if (bill == null) {
              missingBillIds.push(billId)
              delete(legislator.votes[billId])
              return false
            }
            const { mpa_stance, voter_stance } = bill

            // ignore votes that are 'excused' or 'n/a'
            if (!legislator_stance.match(/Excused|n\/a/i)) {
              if (parseBool(bill.is_2018_bill) && bill.mpa_stance) {
                if (legislator_stance === bill.mpa_stance) mpaTally++
                mpaTotal++
              }
              if (bill.voter_stance) {
                if (legislator_stance === bill.voter_stance) voterTally++
                voterTotal++
              }
            }
          })

          legislator.mpaScore = Math.round(mpaTally / mpaTotal * 100)
          legislator.voterScore = Math.round(voterTally / voterTotal * 100)
        })

        if (missingBillIds.length !== 0) {
          console.log("The following bill ids appeared in the legislator's voting record, but not in the bills table.")
          console.log(_.uniq(missingBillIds))
        }

        // Write to file
        const payload = JSON.stringify(legislators, null, '  ')
        fs.writeFile('./src/data/legislators.json', payload, function(err) {
          if (err) console.log(err)
          console.log('--- Done ---')
        })
      })
    })
  })
}





// ----------------------------------------------------------------------------
// Fetch Bill information
// ----------------------------------------------------------------------------

const bills = []
const billKeys = []
const billPhotos = []

function fetchBillData(cb) {

  // Fetch bills table from Airtable and create array
  getRecordsFromTable('bills', function(record) {
    const fields = record.fields
    const { mpa_stance, voter_stance } = fields

    if (fields.photo) {
      const photo = fields.photo[0]

      if (photo.filename == null) console.log('no filename', photo)
      const photoExt = photo.filename.match(/\.\w+$/)[0]
      const photoFilenamePart = fields.id.replace(/\s+/g, '-')
      const photoFilename = `${photoFilenamePart}${photoExt}`
      const photoFilePath = `/bill-photos/${photoFilename}`

      billPhotos.push({
        url: photo.thumbnails.large.url,
        filename: photoFilename,
      })

      fields.photo = photoFilePath
    }

    fields.mpa_stance = _.capitalize(mpa_stance)
    fields.voter_stance = _.capitalize(voter_stance)

    bills.push(fields)
  }, function() {

    fetchBillPhotos(billPhotos)
    cb(bills)

    // Write to file
    fs.writeFile(
      './src/data/bills.json',
      JSON.stringify(bills, null, '  '),
      function(err) {
        if (err) console.log(err)
      }
    )
  });
}


function fetchBillPhotos(billPhotos) {
  asyncLib.eachLimit(billPhotos, 10, function(billPhoto, fetchNext) {
    const { url, filename } = billPhoto;
    console.log('fetching', filename, url);

    fetch(billPhoto.url)
      .then(res => {
        const dest = fs.createWriteStream(`./public/bill-photos/${filename}`);
        res.body.pipe(dest);
        fetchNext();
      })
      .catch(err => {
        console.log('OUTER', err);
      })
  }, function() {
    console.log('DONE FETCHING PHOTOS');
  })
}






// ----------------------------------------------------------------------------
// Fetch About and FAQs
// ----------------------------------------------------------------------------

function fetchAboutTable() {
  const aboutSections = [];

  getRecordsFromTable('about', function(record) {
    aboutSections.push(record.fields);
  }, function(err) {
    if (err) console.log(err);

    const payload = JSON.stringify(aboutSections, null, '  ');
    fs.writeFile('./src/data/aboutSections.json', payload, function(err) {
      if (err) console.log(err);
    })
  })
}

function fetchFaqs() {
  const faqs = [];

  getRecordsFromTable('faq', function(record) {
    faqs.push(record.fields);
  }, function(err) {
    if (err) console.log(err);

    const payload = JSON.stringify(faqs, null, '  ');
    fs.writeFile('./src/data/faqs.json', payload, function(err) {
      if (err) console.log(err);
    })
  })
}








// ----------------------------------------------------------------------------
// Fetch tables
// ----------------------------------------------------------------------------

fetchLegislatorsAndBills();
fetchAboutTable();
fetchFaqs();






// ----------------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------------

function parseBool(input) {
  if (input == null) return null

  const str = input.toLowerCase()
  const bool = str === 'true' || str === 't'

  return bool
}
