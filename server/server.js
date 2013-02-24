var appOptions = {
        appName   : 'APPLICATION_NAME'
      , appPort   : process.env['APPLICATION_NAME_APP_PORT'] || 3000    // mandatory env var (tmp failover to 3000 until env vars set up)
      , Router    : require('./src/router')
      , appTitle  : 'APPLICATION_HTML_TITLE'
    };

require('./src/app').init(appOptions);
