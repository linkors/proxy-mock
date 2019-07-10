const colors = require('colors');
const fs = require("fs");
const path = require("path");
const defaultHeaders = { 'content-type': 'application/json' };

module.exports = function getRule(program) {
  rules = {};
  try {
    rules = JSON.parse(fs.readFileSync(program.path, "utf8"));
  } catch (e) {
    console.log(`${colors.red('Error')} : Please input correct file path for rule \n ${colors.red(e.message)} \n\n`)
  }
  return {
    *onError(requestDetail, error) {
      console.log("Error eccured:", error);
      return null;
    },
    *onConnectError(requestDetail, error) {
      console.log("Cannot reach server", error);
      return null;
    },
    *beforeSendRequest(requestDetail) {
      const rule = rules.find(item => requestDetail.url.includes(item.url))
      if (rule) {
        console.log(`Request for ${colors.blue.bold(requestDetail.url)} is redirected`);
        if (rule.responseFile) {
          responseBody = fs.readFileSync(`${path.dirname(program.path)}/${rule.responseFile}`, "utf8");
        } else {
          responseBody = rule.response;
        }
        return {
          response: {
            statusCode: rule.statusCode || 200,
            header: { ...defaultHeaders, ...rule.headers },
            body: responseBody
          }
        };
      }
      return null;
    },

  };

};
