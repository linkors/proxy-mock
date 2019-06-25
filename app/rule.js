const colors = require('colors');
const fs = require("fs");
const path = require("path");
const defaultHeaders = { 'content-type': 'application/json' };

module.exports = function getRule(program) {
  const rules = JSON.parse(fs.readFileSync(program.path, "utf8"));

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
