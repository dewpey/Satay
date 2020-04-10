require("dotenv").config();
const firebase = require("firebase");

firebase.initializeApp({
  //Put firebase config in here
});

const firestore = firebase.firestore();

const update = async (didFail, uuid) => {};

const peek = async (uuid) => {
  const newUUID = formatUUID(uuid);
  console.log(newUUID);
  const date = getDate();
  const citiesRef = firestore.collection(`status/${newUUID}/${date}`);

  let firstThree = citiesRef.orderBy("date", "desc").limit(1);

  firstThree
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        console.log("Document data:", doc.data());
      }
    })
    .catch((err) => {
      console.log("Error getting document", err);
    });
};

const formatUUID = (uuid) => {
  return uuid.replace(/\//g, "|");
};

const getDate = () => {
  return new Date().toISOString().slice(0, 10);
};

const create = async (uuid, didFail) => {
  const newUUID = formatUUID(uuid);
  console.log(newUUID);
  var todayDate = getDate();
  let data = {
    date: Date.now(),
    didFail: didFail,
  };
  await firestore
    .collection(`status/status/${newUUID}`)
    .doc(todayDate)
    .set(data);
};

(async function () {
  await peek("get-https://httpbin.org/get1");
})();

module.exports = { update };
