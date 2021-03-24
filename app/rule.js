require('dotenv').config()
const colors = require('colors');
const fs = require("fs");
const path = require("path");
const { getExtension } = require("./utils");

const defaultHeaders = { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' };

module.exports = function getRule(program) {
  rules = {};
  let sourcePath = '';
  try {
    sourcePath = program.path || process.env.DEFAULT_SOURCE_PATH || './mocks/source.json';
    const sourceExtension = getExtension(sourcePath);
    if (sourceExtension === 'json') {
      rules = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    } else if (sourceExtension === 'js') {
      const modulePath = path.resolve(process.cwd(), sourcePath);
      rules = require(modulePath);
    } else {
      throw new Error("Only json or js extension allowed");
    }
  } catch (e) {
    console.log(`${colors.red('Error')} : Please input correct file path for rule \n ${colors.red(e.message)} \n\n`)
  }
  return {
    *onError(requestDetail, error) {
      // console.log("Error eccured:", error);
      return null;
    },
    *onConnectError(requestDetail, error) {
      // console.log("Cannot reach server", error);
      return null;
    },
    *beforeSendRequest(requestDetail) {
      const rule = rules.find(item => {
        return typeof item.url === 'object' ? item.url.test(requestDetail.url) : requestDetail.url.includes(item.url)
      })
      if (rule) {
        let requestData = {};
        const requestString = requestDetail.requestData.toString();
        if (requestString) {
          requestData = JSON.parse(requestString);
        }

        let extraData = {};
        if (rule.dataToKeep) {
          rule.dataToKeep.forEach(data => {
            extraData[data] = requestData[data];
          })
        }

        console.log(`<URL> ${colors.blue.bold(requestDetail.url)} \n`);

        console.log(`<REQ> \n ${colors.yellow(requestData)} \n`)

        let response = {};

        if (rule.responseFile) {
          const responseFilePath = path.resolve(path.dirname(sourcePath), rule.responseFile);
          const responseFileExt = getExtension(responseFilePath);

          if (responseFileExt === 'json') {
            response = fs.readFileSync(responseFilePath, "utf8");
          } else if (responseFileExt === 'js') {
            delete require.cache[responseFilePath];
            response = require(responseFilePath)(requestDetail);
          }
        } else {
          response = rule.response;
        }

        const responseData = Object.assign(typeof response !== 'object' ? JSON.parse(response) : (response.responseBody || response), extraData);

        console.log(`<RES> \n ${colors.green(responseData)} \n`)

        return {
          response: {
            statusCode: response.statusCode || rule.statusCode || 200,
            header: { ...defaultHeaders, ...rule.headers, ...response.headers },
            body: JSON.stringify(responseData)
          }
        };
      }
      return null;
    },
  };
};