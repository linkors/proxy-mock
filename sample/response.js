module.exports = function (requestDetail) {
  return {
    responseBody: {
      data: "wow such data" + requestDetail.url
    },
    statusCode: 200,
    headers: {
      'test': 'ini header test'
    }
  }
}