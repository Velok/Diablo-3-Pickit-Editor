(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("templates/item", function(exports, require, module) {
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (cube, cubebtn, glyph, iscomment, items, statoptions, undefined) {
var jade_indent = [];
buf.push("\n<div class=\"item-row\">\n  <button class=\"add-item-btn btn btn-success btn-circle\"><i class=\"glyphicon glyphicon-plus-sign\"></i></button>\n  <button class=\"delete-item-btn btn btn-danger btn-circle\"><i class=\"glyphicon glyphicon-remove-sign\"></i></button>\n  <select data-placeholder=\"choose item..\" class=\"item-name\">\n    <option> </option>\n    <option>no selection</option>");
// iterate items
;(function(){
  var $$obj = items;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var item = $$obj[$index];

buf.push("\n    <option>" + (jade.escape(null == (jade_interp = item) ? "" : jade_interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var item = $$obj[$index];

buf.push("\n    <option>" + (jade.escape(null == (jade_interp = item) ? "" : jade_interp)) + "</option>");
    }

  }
}).call(this);

buf.push("\n  </select>\n  <select data-placeholder=\"choose some stats..\" multiple=\"multiple\" class=\"item-stats\">" + (((jade_interp = statoptions) == null ? '' : jade_interp)) + "</select><strong>at least:</strong>\n  <select class=\"item-stat-options\">\n    <option>0</option>\n    <option>1</option>\n    <option>2</option>\n    <option>3</option>\n    <option>4</option>\n  </select><strong>Cube:</strong>\n  <button" + (jade.attr("data-cube", "" + (cube) + "", true, false)) + (jade.cls(["" + (cubebtn) + "",'item-cube-chk','btn','btn-circle'], [true,null,null,null])) + "><i" + (jade.cls(["glyphicon " + (glyph) + ""], [true])) + "></i></button><strong>Comment:</strong>\n  <input type=\"text\"" + (jade.cls(['item-comment',"" + (iscomment) + ""], [null,true])) + "/>\n</div>");}.call(this,"cube" in locals_for_with?locals_for_with.cube:typeof cube!=="undefined"?cube:undefined,"cubebtn" in locals_for_with?locals_for_with.cubebtn:typeof cubebtn!=="undefined"?cubebtn:undefined,"glyph" in locals_for_with?locals_for_with.glyph:typeof glyph!=="undefined"?glyph:undefined,"iscomment" in locals_for_with?locals_for_with.iscomment:typeof iscomment!=="undefined"?iscomment:undefined,"items" in locals_for_with?locals_for_with.items:typeof items!=="undefined"?items:undefined,"statoptions" in locals_for_with?locals_for_with.statoptions:typeof statoptions!=="undefined"?statoptions:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
});


//# sourceMappingURL=templates.js.map