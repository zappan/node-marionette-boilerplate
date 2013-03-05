var appOptions = {
        appName   : 'APPLICATION_NAME'
      , appPort   : parseInt(process.env['APP_PORT'], 10)    // mandatory env var
      , Router    : require('./src/router')
      , appTitle  : 'APPLICATION_HTML_TITLE'
    };

require('./src/app').init(appOptions);
