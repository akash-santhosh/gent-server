module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    copy: {
      build: {
        files: [{
            expand: true,
            cwd: "./public",
            src: ["**"],
            dest: "./dist/public"
          },
          {
            expand: true,
            cwd: "./src/public",
            src: ["**"],
            dest: "./dist/public"
          },
          {
            expand: true,
            cwd: "./src/views",
            src: ["**"],
            dest: "./dist/views"
          }
        ]
      }
    },
    ts: {
      build: {
        files: [{
          src: ["src/\*\*/\*.ts", "!src/.baseDir.ts"],
          dest: "./dist"
        }],
        options: {
          experimentalDecorators: true,
          module: "commonjs",
          target: "es6",
          sourceMap: false,
          rootDir: "src",
          lib: ["es2016", "esnext.asynciterable", "dom"]
        }
      }
    },
    tslint: {
      options: {
        configuration: grunt.file.readJSON("tslint.json")
      },
      all: {
        src: ["src/\*\*/\*.ts", "!node_modules/**/*.ts", "!obj/**/*.ts", "!typings/**/*.ts"]
        // avoid linting test, typings files and node_modules files
      }
    },
    typedoc: {
      build: {
        options: {
          module: 'commonjs',
          target: 'es6',
          out: 'dist/docs/',
          name: 'GRAPHQL API Server'
        },
        src: 'src/**/*'
      }
    },
    mochaTest: {
      test: {
        options: {
          timeout: 20000
        },
        src: ['dist/e2e/config.js', 'dist/e2e/*.spec.js', 'dist/e2e/**/*.spec.js'],
      },
    },
    nodemon: {
      start: {
        script: './bin/www'
      },
      options: {
        ignore: ['node_modules/**', 'dist/**', 'Gruntfile.js'],
        env: {
          NODE_ENV: process.env.NODE_ENV
        }
      }
    },
    concurrent: {
      watchers: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["copy", "newer:tslint:all", "ts:build", "mochaTest"],
        options: {
          spawn: false // makes the watch task faster
        }
      },
      views: {
        files: ["src/views/\*\*/\*.*"],
        tasks: ["copy"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-tslint");
  grunt.loadNpmTasks("grunt-newer");
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks('grunt-typedoc');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask("lint", ["newer:tslint:all"]);
  grunt.registerTask("test", ["copy", "ts:build", "mochaTest"]);
  grunt.registerTask("build", ["newer:tslint:all", "copy", "ts:build"]);
  grunt.registerTask("serve", ["build", "concurrent:watchers"]);

};