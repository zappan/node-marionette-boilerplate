
var pkgJson = require('./package.json');

module.exports = function(grunt) {
  var jsHintOptions = require('./.jshintoptions');

  // ### Project configuration.
  grunt.initConfig({

    // references and exposes data in package.json
    pkg: '<json:package.json>',

    // local variables
    vars: {
        timestamp     : '<%= grunt.template.today("yyyymmddHHMMss") %>'
      , appName       : pkgJson.name
      , appVer        : pkgJson.version
      , baseFilename  : pkgJson.appFilename
    },

    // DRY-ing directories through local variables
    dirs: {
        srcClient       : 'client'
      , srcClientJs     : 'client/src/js'
      , srcClientStyles : 'client/src/styles'
      , srcClientAssets : 'client/assets'
      , srcClientTests  : 'client/test'
      , srcServer       : 'server'
      , srcServerJs     : 'server/src'
      , srcServerTests  : 'server/test'
      , appBuild        : 'build/app'
      , publicBuild     : 'build/public'
      , target          : 'server/public'
      , uiTests         : 'test'
      , uiTestsCasper   : 'test/casperjs'
    },

    // JsHint options :: see http://www.jshint.com/options/
    jshint: {
        grunt: {
            options : jsHintOptions.code
          , files   : { src: ['Gruntfile.js', '.jshintoptions.js'] }
        }
      , client: {
            options : jsHintOptions.code
          , files   : { src: ['<%= dirs.srcClientJs %>/**/*.js'] }
        }
      , server: {
            options : jsHintOptions.code
          , files   : { src: ['<%= dirs.srcServer %>/server.js', '<%= dirs.srcServerJs %>/**/*.js'] }
        }
      , testClient: {
            options : jsHintOptions.tests
          , files   : { src: ['<%= dirs.srcClientTests %>/**/*.js'] }
        }
      , testServer: {
            options : jsHintOptions.tests
          , files   : { src: ['<%= dirs.srcServerTests %>/**/*.js'] }
        }
      , appUiTests: {
            options : jsHintOptions.code
          , files   : { src: ['<%= dirs.uiTestsCasper %>/**/*.js'] }
        }
    },

    // cleaning target directory
    clean: {
        build: ['build/*']
      , public: ['server/public']
    },

    // Configuration for javascript build process. Options apply from r.js
    // https://github.com/jrburke/r.js/blob/master/build/example.build.js
    requirejs: {
      compile: {
        options: {
            mainConfigFile  : '<%= dirs.srcClientJs %>/config.js'                     /* Include the main configuration file */
          , out             : '<%= dirs.appBuild %>/js/<%= vars.baseFilename %>.js'   /* Output file */
          , name            : 'config'                                                /* Root application module */
          , wrap            : false                                                   /* Do not wrap everything in an IIFE */
          , optimize        : 'none'                                                  /* JS-optimization on build: 'none' or 'uglify' supported via Node */
          , insertRequire   : ['main']
          , logLevel        : 1
        }
      }
    },

    less: {
      build: {
        options: {
          paths: ['<%= dirs.srcClientStyles %>']
        },
        files: {
          '<%= dirs.appBuild %>/css/<%= vars.baseFilename %>.css' : '<%= dirs.srcClientStyles %>/style.less'
        }
      }
    },

    // The concatenate task merges require.js/almond and other dependencies (templates)
    // into the application code.
    concat: {
      dist: {
        src: [
            '<%= dirs.srcClientAssets %>/js/almond.js'      /* choosing almond as we have everything preoptimized and built into the single file */
          , '<%= dirs.appBuild %>/js/<%= vars.baseFilename %>.js'        /* templates will be built into app file via RequireJS require-s */
        ],
        dest: '<%= dirs.appBuild %>/js/<%= vars.baseFilename %>.js',
        separator: ';'
      }
    },

    // minifying app js-file on release
    uglify: {
      options: {
        banner: '/*! <%= vars.appName %> - v<%= vars.appVer %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      release: {
          src: '<%= dirs.appBuild %>/js/<%= vars.baseFilename %>.js'
        , dest: '<%= dirs.appBuild %>/js/<%= vars.baseFilename %>-<%= vars.appVer %>.min.js'
      }
    },

    cssmin: {
      release: {
        files : {
          '<%= dirs.appBuild %>/css/<%= vars.baseFilename %>-<%= vars.appVer %>.min.css' : ['<%= dirs.appBuild %>/css/<%= vars.baseFilename %>.css']
        }
      }
    },

    replace: {
      testClient: {
        options: {
          variables: {
              specFiles : grunt.file.expand('client/test/js/**/*.spec.js').join("'\n      , '")
          }
        },
        files: {
          '<%= dirs.srcClientTests %>/': ['<%= dirs.srcClientTests %>/_src/runner.js']
        }
      },
      dev: {
        options: {
          variables: {
              appScriptTag        : '<script data-main="/src/js/config" src="http://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.4/require.min.js"></script>'
            , appStyleTag         : '<link rel="stylesheet/less" type="text/css" href="/src/styles/style.less" media="all">'
            , lessScriptTag       : '<script src="http://cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js" type="text/javascript"></script>'
          },
          force: true
        },
        files: {
          '<%= dirs.target %>/' : ['<%= dirs.srcClient %>/*.html']
        }
      },
      debug: {
        options: {
          variables: {
              appScriptTag        : '<script src="/assets/js/<%= vars.baseFilename %>.js?<%= vars.timestamp %>"></script>'
            , appStyleTag         : '<link rel="stylesheet" type="text/css" href="/<%= vars.baseFilename %>.css?<%= vars.timestamp %>"/>'
            , lessScriptTag       : ''
          },
          force: true
        },
        files: {
          '<%= dirs.publicBuild %>/': ['<%= dirs.srcClient %>/*.html']
        }
      },
      release: {
        options: {
          variables: {
              appScriptTag        : '<script src="/assets/js/<%= vars.baseFilename %>-<%= vars.appVer %>.min.js"></script>'
            , appStyleTag         : '<link rel="stylesheet" type="text/css" href="/<%= vars.baseFilename %>-<%= vars.appVer %>.min.css"/>'
            , lessScriptTag       : ''
          },
          force: true
        },
        files: {
          '<%= dirs.publicBuild %>/': ['<%= dirs.srcClient %>/*.html']
        }
      }
    },

    copy: {
      debugBuild: {
        files : [
            { expand: true, cwd: '<%= dirs.appBuild %>/css/', src: ['**'], dest: '<%= dirs.publicBuild %>' }
          , { expand: true, cwd: '<%= dirs.appBuild %>/js/',  src: ['**'], dest: '<%= dirs.publicBuild %>/assets/js/' }
        ]
      },
      releaseBuild: {
        files : [
            { expand: true, cwd: '<%= dirs.appBuild %>/css/', src: ['**/*.min.css'], dest: '<%= dirs.publicBuild %>' }
          , { expand: true, cwd: '<%= dirs.appBuild %>/js/',  src: ['**/*.min.js'], dest: '<%= dirs.publicBuild %>/assets/js/' }
        ]
      },
      assets: {
        files : [
          , { expand: true, cwd: '<%= dirs.srcClientAssets %>/css/',    src: ['**'], dest: '<%= dirs.publicBuild %>/assets/css/' }
          , { expand: true, cwd: '<%= dirs.srcClientAssets %>/fonts/',  src: ['**'], dest: '<%= dirs.publicBuild %>/assets/fonts/' }
          , { expand: true, cwd: '<%= dirs.srcClientAssets %>/img/',    src: ['**'], dest: '<%= dirs.publicBuild %>/assets/img/' }
          , { expand: true, cwd: '<%= dirs.srcClientAssets %>/static/', src: ['**'], dest: '<%= dirs.publicBuild %>/assets/static/' }
        ]
      },
      public: {
        files : [
            { expand: true, cwd: '<%= dirs.publicBuild %>/', src: ['**'], dest: '<%= dirs.target %>/' }
        ]
      }
    },

    shell: {
      devSymlink: { command: './scripts/devsymlink.sh' }
    },

    // running mocha tests covering server code (Node.js)
    simplemocha: {
      options: {
          timeout       : 3000
        , ignoreLeaks   : false
        , globals       : ['NODE_CONFIG']
        , ui            : 'bdd'
        , reporter      : 'dot'
      },
      server: {
        src: ['server/test/init.js', 'server/test/**/*.spec.js']
      }
    },

    mocha: {
      runner: ['<%= dirs.srcClientTests %>/runner.html']
    }
  });


  // ### Load additional grunt plugins tasks
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-mocha');


  // ### Combo-tasks definitions

  grunt.registerTask('testServer', ['jshint:server', 'jshint:testServer', 'clean:public', 'replace:dev', 'shell:devSymlink', 'simplemocha:server']);
  grunt.registerTask('testClient', ['jshint:client', 'jshint:testClient', 'replace:testClient', 'mocha']);
  grunt.registerTask('test', ['jshint:grunt', 'testServer', 'testClient']);


  // jshints source, cleans build dir, hooks dev paths into HTML app shell,
  grunt.registerTask('_buildDev', ['jshint', 'clean', 'replace:dev']);

  // jshints source, cleans build dir, builds client app file with templates, LESS to CSS
  grunt.registerTask('_buildApp', ['jshint', 'clean', 'requirejs', 'less:build']);

  // builds app, adds r.js, hooks debug paths into HTML app shell, prepares static assets
  grunt.registerTask('_debugBuild', ['_buildApp', 'concat', 'replace:debug', 'copy:debugBuild', 'copy:assets']);

  // builds app, adds r.js, minifies app and CSS, hooks release paths into HTML app shell, prepares static assets
  grunt.registerTask('_releaseBuild', ['_buildApp', 'concat', 'uglify', 'cssmin', 'replace:release', 'copy:releaseBuild', 'copy:assets']);


  // dev build: runs build, symlinks client app sources to be accessible from node /public
  grunt.registerTask('dev', ['_buildDev', 'shell:devSymlink']);

  // debug app: runs build, cleans node's /public and copies built app into it
  grunt.registerTask('debug', ['_debugBuild', 'clean:public', 'copy:public']);

  // release app: runs build, cleans node's /public and copies built app into it
  grunt.registerTask('release', ['_releaseBuild', 'clean:public', 'copy:public']);


  // Default task: a dev build
  grunt.registerTask('default', 'dev');
};
