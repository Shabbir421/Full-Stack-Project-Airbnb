/** @format */

const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing");

const mongourl = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(mongourl);
}

const initdb = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "673c4b15b7d8f0283447ab74",
  }));
  await listing.insertMany(initdata.data);
  console.log("data was init");
};

initdb();
