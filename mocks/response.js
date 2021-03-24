module.exports = function (requestDetail) {
  const url = new URL(requestDetail.url);
  const queries = new URLSearchParams(url.search);
  return {
    responseBody: {
      "data": [
        {
          "keyword": "test " + queries.get("id"),
          "category": "c/test",
          "id": "12"
        }
      ],
      "meta": {
        "offset": 0,
        "limit": 10,
        "total": 1,
        "http_status": 200
      }
    },
    statusCode: 200,
    headers: {
      'test': 'ini header test'
    }
  }
}