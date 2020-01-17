const colors = require('colors');
const fs = require("fs");
const path = require("path");
const defaultHeaders = { 'content-type': 'application/json' };

module.exports = function getRule(program) {
  rules = {};
  let sourcePath = '';
  try {
    sourcePath = program.path || './sample/source.json';
    rules = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
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
      const rule = rules.find(item => {
        return item.mustLast ? requestDetail.url.endsWith(item.url) : requestDetail.url.includes(item.url)
      })
      if (rule) {
        const requestData = JSON.parse(requestDetail.requestData.toString());

        let extraData = {};
        if (rule.dataToKeep) {
          rule.dataToKeep.forEach(data => {
            extraData[data] = requestData[data];
          })
        }

        console.log(`<URL> ${colors.blue.bold(requestDetail.url)} \n`);

        console.log(`<REQ> \n ${colors.yellow(requestData)} \n`)

        if (rule.responseFile) {
          responseBody = fs.readFileSync(`${path.dirname(sourcePath)}/${rule.responseFile}`, "utf8");
        } else {
          responseBody = rule.response;
        }

        const responseData = Object.assign(JSON.parse(responseBody), extraData);

        console.log(`<RES> \n ${colors.green(responseData)} \n`)

        return {
          response: {
            statusCode: rule.statusCode || 200,
            header: { ...defaultHeaders, ...rule.headers },
            body: JSON.stringify(responseData)
          }
        };
      }
      return null;
    },
  };
};