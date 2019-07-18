# How to use

1. Install node js [here](https://nodejs.org/)
2. Install dependencies
`
$ npm install
`
3. Generate CA certificate if you want to intercept `https`
`
node_modules\.bin\anyproxy-ca
`
4. Set up certification on device. Document can be seen [here](https://docs.google.com/document/d/1BWfND5zIQ_Tw2H8vrhCcIFQFbqbb-CysrW2qdLAuYYk/edit#heading=h.mzvunbyuwje7)
5. Run the app
`
node proxy-cache --path <source json>
`
6. Setup proxy on device