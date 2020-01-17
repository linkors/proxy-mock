# Proxy-mock

This package's goal is simply to mock API response. By using proxy, you can intercept and return mock data from any request to specific URL. This project is using [Anyproxy](http://anyproxy.io/en/#rule-module-interface) rule based config to intercept request. You can mock API response based on API contract you have agreed with your team. So that, you can start developing immediately without waiting for API implementation. 

- [Setup](#setup)
- [Running Proxy-mock](#running-proxy-mock)
- [Config Source Rule](#config-source-rule)
- [Proxy HTTPS](#proxy-https)

## Setup

### Step 1: Install Node JS

This project is node based app. You can install node js [here](https://nodejs.org/)

### Step 2: Clone repo

```bash
$  git clone --depth 1 git@github.com:linkors/proxy-mock.git
& cd <repo_name>
```

### Step 3: Install project dependencies

```bash
$ npm install
```


## Running Proxy-mock

You can run `proxy-mock` with 
```bash
$ node proxy-mock [options]
```

These are the list of arguments you can pass:

| Option | Description | Default |
| --- | --- | --- |
| `-p`, `--port` [value] | Port for proxy | 8001 |
| `-w`, `--web` [value] | Web GUI port | 8002 |
| `--path` [rule file path]| Web GUI port | `sample/source.json` |
| `-s`, `--setglobalproxy`| Will automatically set global proxy on start | - |
| `-i`, `--ignorerule`| Use this if you just want to check request response. It will ignore defined rule. | - |

## Config Source Rule 

This proxy uses `json` rule to intercept the URL. You can see sample config on `sample/source.json`. 

Config properties consists of:
| Property | Description | Required | Default Value | Example |
| --- | --- | --- | --- | --- |
| `url` | Endpoint URL that _contains_ this value will be intercepted | Yes | - | `/v2/api/getUser` |
| `statusCode` | Htpp response status | - | 200 | - |
| `headers` | Http response header | - | `{"content-type": "application/json"}` | - |
| `responseFile` | Read response from file (must be a `json` file) | Yes, if `responseBody` is not used. Path is relative to `source`  file | - | `test.json`
| `responseBody` | Will automatically set global proxy on start | - | - | `{"data":"baloon"}` |
| `mustLast` | URL must be ended with value that is specified in `url` property | - | - | - |
| `dataToKeep` | Use this if you want to bring any data from request to response | - | - | `["nonce", "context"]` |

Of course you can modify the implementation of hwo this proxy handle config rule. File `app/rule.js` is what you are looking for.

<img width="300" alt="Coding" src="https://media.giphy.com/media/13UZisxBxkjPwI/giphy.gif">

## Proxy HTTPS

For proxy _ing_ any https requests, you need to add Anyproxy certificate as trusted source.

Use this command to generate CA certificate
```bash
$ node_modules/.bin/anyproxy-ca
```
Then you need to trust the generated certificate to your browser/device. You can see how to set up it  [Anyrpoxy Config Certification](http://anyproxy.io/en/#config-certification).

_Warning: please keep your root CA safe since it may influence your system security._
_Note: you only need to do this once._


