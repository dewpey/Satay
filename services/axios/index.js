const axios = require("axios").default;

const runCheck = async (request, expect) => {
  const { status, data } = await axios(request);
  console.log(status);
  if (status == expect) {
    return { result: true, data: data };
  } else {
    return { result: false, data: data };
  }
};

module.exports = { runCheck };
