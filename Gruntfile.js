"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("./project.json", {
            encoding: 'utf-8'
        }),

        "sync-browser": {
            options: {
                port: 12354
            },
            sync: {

            }
        }
    });


    grunt.loadTasks('./task/sync-browser');

    grunt.registerTask('default', ['sync-browser']);

};