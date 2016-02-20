module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    var rollup = require('rollup');
    var UglifyJS = require("uglify-js");

    function getMinName(name) {
        var p = path.parse(name);
        p.name += ".min";
        p.base = p.name + p.ext;
        return path.format(p);
    }

    function getMapName(name) {
        return name + ".map";
    }

    function getFiles(filelist) {
        var files = [];
        filelist.forEach(function (fset) {
            fset.src.forEach(function (item) {
                var src = path.resolve((fset.cwd || "") + item),
                    dest = path.dirname(fset.dest) + '/' + path.basename(fset.dest);
                files.push({
                    src: src,
                    dest: dest
                });
            });
        });
        return files;
    }


    grunt.task.registerMultiTask('compile', 'Build ES6 Modules into one file', function () {
        var self = this,
            done = this.async(),
            options = this.options({}),
            pkg = options.pkg || grunt.file.readJSON('package.json'),
            name = options.name || pkg.name,
            version = (options.version || pkg.version).replace(/\.(\d+)/g, function (_, n) {
                return ("000" + n).slice(-3);
            }),
            debug = (options.debug === true),
            minify = (options.minify === true),
            sourcemap = (options.sourcemap === true),

            files = getFiles(this.files);

        files.forEach(function (file) {
            var src = file.src,
                dest = file.dest,
                mindest = getMinName(dest),
                bundleparam = {
                    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
                    format: 'umd',
                    moduleName: name,
                    intro: "var DEBUG=" + (debug ? "true" : "false") + ",FORCE_PROMISE=false;",
                    sourceMap: sourcemap,
                    sourceMapFile: path.resolve(dest)
                };
            rollup.rollup({
                // The bundle's starting point. This file will be
                // included, along with the minimum necessary code
                // from its dependencies
                entry: src//'web-html/_assets/es6/olli/olli.js'
            }).then(function (bundle) {
                grunt.log.writeln("compiling: " + path.basename(src) + " ... ");
                // Generate bundle + sourcemap
                var result = bundle.generate(bundleparam);
                /*template data*/
                var data = {
                    pkg: pkg,
                    prop: function (name) {
                        return name ? name + version : "__" + version + "__";
                    }
                };
                var append = sourcemap ? "\n//# sourceMappingURL=" + path.basename(dest) + ".map" : "";

                var code = result.code;
                code = grunt.template.process(code, {data: data});
                grunt.file.write(dest, code + append);

                if (sourcemap) {
                    /*modify to relative path*/
                    /*
                     var basedir = path.dirname(dest);
                     result.map.sources.forEach(function(src,index,ar){
                     ar[index] = path.relative(basedir,path.dirname(src))+"/"+path.basename(src);
                     });
                     */
                    grunt.file.write(dest + ".map", result.map.toString());
                }


                if (minify) {
                    var minified = UglifyJS.minify(code.toString().replace(bundleparam.intro, ""), {
                        fromString: true,
                        compress: {global_defs: {DEBUG: debug, FORCE_PROMISE: false}},
                        inSourceMap: sourcemap ? result.map : false,
                        outSourceMap: sourcemap ? path.basename(mindest) + ".map" : false
                    });
                    grunt.file.write(mindest, minified.code);
                    if (sourcemap)
                        grunt.file.write(mindest + ".map", minified.map);
                }
                grunt.log.ok();
            }, function (error) {
                console.log(error)
            });

        });
        done();
    });
};