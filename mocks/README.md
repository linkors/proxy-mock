# JSON FORMAT

```
[
  {
    "url": <url to be intercepted | required>,
    "statusCode": <http status | default 200>,
    "headers": <headers as object | default {"content-type": "application/json"}>,
    "responseFile": <read response from file>,
    "responseBody": <response>,
    "dataToKeep": <array of object name to be keep from request and will be returned back on response - optional>,
  },
  {
    "url": "/v2/api/getUser",
    "statusCode": 200,
    "headers": {
      "content-type": "application/json"
    },
    "responseFile": "test.json",
    "dataToKeep": ["nonce"]
  }
  ...
]
```