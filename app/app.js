const AnyProxy = require("anyproxy");
const getRule = require("./rule");
const colors = require('colors');
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function setGlobalProxy(host, port) {
  console.log(colors.bold(`${colors.green('Set')} global proxy...`));
  AnyProxy.utils.systemProxyMgr.enableGlobalProxy(host, port);
  AnyProxy.utils.systemProxyMgr.enableGlobalProxy(host, port, 'https');
}

function unsetGlobalProxy() {
  console.log(colors.bold(`${colors.yellow('Unset')} global proxy...`));
  AnyProxy.utils.systemProxyMgr.disableGlobalProxy();
  AnyProxy.utils.systemProxyMgr.disableGlobalProxy('https');
}

module.exports = {
  startProxy: function (program) {
    const options = {
      port: 8001,
      rule: getRule(program),
      webInterface: {
        enable: true,
        webPort: 8002
      },
      throttle: 10000,
      forceProxyHttps: true,
      wsIntercept: false,
      silent: true
    };
    const proxyServer = new AnyProxy.ProxyServer(options);

    proxyServer.on("ready", () => {
      var ip = require("ip");
      console.log("Proxy server is ready!");
      console.log(
        colors.bold("Please set your proxy to ") +
        colors.green.bold.underline(ip.address()) +
        colors.bold(" with port ") +
        colors.green.bold.underline(program.port) + "\n\n\n"
      );
      /* */
    });
    proxyServer.on("error", e => {
      console.log(colors.red('Cannot start proxy server: ') + e);
    });
    proxyServer.start();

    if (program['setglobalproxy']) {
      setGlobalProxy('localhost', options.port);
    }

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 's') {
        var re = new RegExp(/Enabled:(.*)/);
        var r = AnyProxy.utils.systemProxyMgr.getProxyState().stdout.match(re);

        if (r && r[1].trim() === 'No') {
          setGlobalProxy('localhost', options.port);
        } else if (r && r[1].trim() === 'Yes') {
          unsetGlobalProxy();
        }
      } else if (key.ctrl && key.name === 'c') {
        console.log(colors.bold('Stopping proxy server ...'));
        try {
          proxyServer && proxyServer.close();
          if (program['setglobalproxy']) {
            unsetGlobalProxy();
          }
        } catch (e) {
          console.error(e);
        }
        process.exit();
      }
    })
  },
};
