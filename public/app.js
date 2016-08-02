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
require.register("scripts/app", function(exports, require, module) {
'use strict';

var _itemdata = require('scripts/itemdata');

var ItemData = _interopRequireWildcard(_itemdata);

var _menu = require('scripts/menu');

var Menu = _interopRequireWildcard(_menu);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
});

require.register("scripts/entries", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateBuildEntries = generateBuildEntries;
exports.addEntry = addEntry;
exports.checkComment = checkComment;
exports.deleteEntry = deleteEntry;
exports.addBuild = addBuild;
exports.resetList = resetList;

var _filehandler = require('scripts/filehandler');

var FileHandler = _interopRequireWildcard(_filehandler);

var _itemdata = require('scripts/itemdata');

var ItemData = _interopRequireWildcard(_itemdata);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var itemTemplate = require('templates/item');

//handler
var $itemTable = $('#item-table');
$itemTable.on('click', '.delete-item-btn', deleteEntry);
$itemTable.on('click', '.item-cube-chk', toggleCubeBtn);
$itemTable.on('change', '.item-stats', setStatTitle);
$itemTable.on('chosen:ready', '.item-stats', setStatTitle);
$itemTable.on('click', '.add-item-btn', newEntry);
$itemTable.on('focusout', '.item-comment', checkComment);
$itemTable.on('keyup', '.item-comment', checkCommentEnter);

// takes the json provided from the diablofans api
function generateBuildEntries(buildObj) {
  var buildEntries = [];
  var itemSlots = ['item_head', 'item_shoulders', 'item_amulet', 'item_torso', 'item_wrists', 'item_hands', 'item_waist', 'item_legs', 'item_feet', 'item_rings', 'item_weapon', 'item_offhand'];
  var cubeSlots = ['kanai_weapon', 'kanai_armor', 'kanai_jewelry'];

  //title
  var entry = {};
  var startString = ';|||| ' + buildObj.build_class + '-Build: ' + buildObj.build_name + '  Link: ' + buildObj.build_url + ' ||||';
  entry.item_comment = startString;
  buildEntries.push(entry);

  //items
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = itemSlots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var slot = _step.value;

      var items = buildObj[slot].items;
      var stats = buildObj[slot].stats;
      stats = ItemData.alterItemStats(stats);
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var item = _step4.value;

          var _entry = {};
          _entry.item_name = item.name;
          _entry.item_cube = false;
          _entry.item_stats = stats;
          buildEntries.push(_entry);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
    //cube items
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = cubeSlots[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var slot = _step2.value;

      var _entry2 = {};
      var item = buildObj[slot];
      _entry2.item_name = item;
      _entry2.item_cube = "true";

      buildEntries.push(_entry2);
    }

    //build end
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  entry = {};
  var endString = ';|||| End of Build ||||';
  entry.item_comment = endString;
  buildEntries.push(entry);

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = buildEntries[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _entry3 = _step3.value;

      addEntry(_entry3);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  scrollDown();
}

function addEntry(entryObj) {
  var name = entryObj.item_name || '';
  var comment = entryObj.item_comment || ';';
  var statCount = entryObj.item_statcount || 0;
  //revert empty entry objects
  if (name === '' && comment === '') {
    return;
  }
  var cube = entryObj.item_cube || "false";
  var stats = entryObj.item_stats || [];
  var glyph = 'glyphicon-remove-circle';
  var cubeBtn = 'btn-default';
  if (cube === "true") {
    glyph = 'glyphicon-ok-sign';
    cubeBtn = 'btn-success';
  }

  var isComment = '';
  if (comment.match(/^;\|\|\|\|.*/)) {
    isComment = 'comment-entry';
  }

  var templateVars = {
    items: ItemData.getItemNames(),
    statoptions: ItemData.getStatOptionsString(),
    cube: cube,
    glyph: glyph,
    cubebtn: cubeBtn,
    iscomment: isComment
  };

  $('#item-table').append(itemTemplate(templateVars));
  var $_this = $('#item-table .item-row:last-child');

  $_this.find('.item-name').val(name).chosen({ search_contains: true });

  $_this.find('.item-stats').val(stats).chosen();

  $_this.find('.item-stat-options').val(statCount).chosen();

  $_this.find('.item-comment').val(comment);
}

function newEntry() {
  var name = '';
  var comment = ';';

  var templateVars = {
    items: ItemData.getItemNames(),
    statoptions: ItemData.getStatOptionsString(),
    cube: "false",
    glyph: 'glyphicon-remove-circle',
    cubebtn: 'btn-default',
    iscomment: ''
  };

  var $_this = $(this).parent();

  $(itemTemplate(templateVars)).insertAfter($_this);

  $_this = $_this.next();
  $_this.find('.item-name').val(name).chosen({ search_contains: true });

  $_this.find('.item-stats').chosen();

  $_this.find('.item-stat-options').val(0).chosen();

  $_this.find('.item-comment').val(comment);
}

function setStatTitle() {
  var $_this = $(this).next().find('.search-choice');
  $_this.each(function () {
    var $_this = $('span', this);
    var shortStatList = ItemData.getShortStatList();
    var text = shortStatList[$_this.text()];
    if (!$_this.attr('title')) {
      $_this.attr('title', $_this.text());
    }
    $_this.text(text);
  });
}

function toggleCubeBtn() {
  var $_this = $(this);
  $_this.toggleClass('btn-success').toggleClass('btn-default').find('i').toggleClass('glyphicon-remove-circle').toggleClass('glyphicon-ok-sign');

  if ($_this.attr('data-cube') === 'true') {
    $_this.attr('data-cube', 'false');
  } else {
    $_this.attr('data-cube', 'true');
  }
}

function checkCommentEnter(ev) {
  if (ev.keyCode === 13) {
    $(this).trigger('blur');
  }
}

//if return true only comment should be saved
function checkComment() {
  var $_this = $(this);
  var value = $_this.val();

  // if its a build comment
  if (value.match(/^;\|\|\|\|/)) {
    return true;
  }
  // if its a comment with a ; at the beginning
  // if (value.match(/^ *;/)) {
  //   $(this).removeClass('comment-entry');
  //   return true;
  // }
  // $(this).addClass('comment-entry');
  // return false;
}

function deleteEntry() {
  $(this).parent().remove();
}

function addBuild() {
  var BUILDAPI_URL = 'http://' + window.location.host + '/api/fansbuild/';
  var $buildNrFld = $('#build-nr-fld');
  var buildNr = $buildNrFld.val();
  var url = BUILDAPI_URL + buildNr;

  FileHandler.getJsonPromised(url).then(function (json) {
    generateBuildEntries(json);
  }).catch(function (error) {
    alert('loading build failed! Please enter a valid build number.\nSee help for more information.');
    console.error(error);
  });

  $buildNrFld.val('');
}

function resetList() {
  location.reload();
}

function scrollDown() {
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  return false;
}
});

;require.register("scripts/filehandler", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJsonPromised = getJsonPromised;
exports.getFilePromised = getFilePromised;
exports.loadList = loadList;
exports.saveList = saveList;
exports.collectEntryData = collectEntryData;

var _itemdata = require('scripts/itemdata');

var ItemData = _interopRequireWildcard(_itemdata);

var _entries = require('scripts/entries');

var Entries = _interopRequireWildcard(_entries);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getJsonPromised(path) {
  return new Promise(function (resolve, reject) {
    $.getJSON(path).done(function (json) {
      resolve(json);
    }).fail(function (jqxhr, textStatus, error) {
      var errormsg = { jqxhr: jqxhr, textStatus: textStatus, error: error };
      reject(errormsg);
    });
  });
}

function getFilePromised(path) {
  return new Promise(function (resolve, reject) {
    $.get(path).done(function (data) {
      resolve(data);
    }).fail(function (jqxhr, textStatus, error) {
      var errormsg = { jqxhr: jqxhr, textStatus: textStatus, error: error };
      reject(errormsg);
    });
  });
}

function loadList() {
  var file = $('#load-list-btn')[0].files[0];
  var reader = new FileReader();
  reader.readAsText(file, "text/plain; charset=utf-8");
  reader.onload = function () {
    // $('#item-table').children().remove();
    var listObject = {};
    listObject = JSON.parse(reader.result);
    for (var entry in listObject) {
      Entries.addEntry(listObject[entry]);
    }
  };
}

function saveList() {
  var saveObject = JSON.stringify(collectEntryData());
  var blob = new Blob([saveObject], { type: "application/json" });

  saveAs(blob, 'pickiteditorlist.json');
}

function collectEntryData() {
  var saveObject = {};
  var itemList = ItemData.getItemList();
  var $entries = $('#item-table .item-row');
  var i = 0;
  $entries.each(function () {
    var entry = {};
    entry.item_comment = $('.item-comment', this).val();
    entry.item_name = $('.item-name', this).val();
    entry.item_statcount = $('.item-stat-options', this).val();
    entry.item_cube = $('.item-cube-chk', this).attr('data-cube');
    entry.item_stats = $('.item-stats', this).val();
    saveObject[i] = entry;
    i++;
  });
  return saveObject;
}
});

;require.register("scripts/itemdata", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alterItemStats = alterItemStats;
exports.getShortStatList = getShortStatList;
exports.getStatOptionsString = getStatOptionsString;
exports.getStatList = getStatList;
exports.getTypeList = getTypeList;
exports.getItemNames = getItemNames;
exports.getItemList = getItemList;

var _filehandler = require('scripts/filehandler');

var FileHandler = _interopRequireWildcard(_filehandler);

var _entries = require('scripts/entries');

var Entries = _interopRequireWildcard(_entries);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var itemList = [];
var itemNames = [];
var statList = {};
var shortStatList = {};
var typeList = [];
var statOptionsString = '';

// init
loadItemData();

function loadItemData() {
  Promise.all([FileHandler.getJsonPromised('data/itemlist.json'), FileHandler.getJsonPromised('data/statlist.json'), FileHandler.getJsonPromised('data/typelist.json')]).then(function (jsons) {
    itemList = jsons[0];
    statList = jsons[1];
    typeList = jsons[2];
    generateItemNames();
    generateStatOptionsString();
    generateShortStatList();
    Entries.addEntry({});
  }).catch(function (error) {
    console.error(error);
  });
}

function alterItemStats(fansbuildStats) {
  var fullStats = [];
  var statList = getStatList();

  for (var i = 0; i < fansbuildStats.length; i++) {
    for (var arr in statList) {
      var fans = statList[arr][1];
      var full = statList[arr][0];
      if (fansbuildStats[i] === fans) {
        fullStats.push(full);
      }
    }
  }
  return fullStats;
}
//pull only the itemNames from the itemlist to a new object itemNames
function generateItemNames() {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = itemList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      itemNames.push(item.name);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}
//generates a long string containing all the options with the stats of the statList
function generateStatOptionsString() {
  for (var arr in statList) {
    var full = statList[arr][0];
    statOptionsString += '<option>' + full + '</option>';
  }
}

function generateShortStatList() {
  for (var arr in statList) {
    var long = statList[arr][0];
    var short = statList[arr][3];
    shortStatList[long] = short;
  }
}

function getShortStatList() {
  return shortStatList;
}

function getStatOptionsString() {
  return statOptionsString;
}

function getStatList() {
  return statList;
}

function getTypeList() {
  return typeList;
}

function getItemNames() {
  return itemNames;
}

function getItemList() {
  return itemList;
}
});

;require.register("scripts/mediator", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sub = sub;
exports.unsub = unsub;
exports.emit = emit;
var events = {};

function sub(eventName, fn) {
  events[eventName] = events[eventName] || [];
  events[eventName].push(fn);
}

function unsub(eventName, fn) {
  if (events[eventName]) {
    for (var i = 0; i < events[eventName].length; i++) {
      if (events[eventName][i] === fn) {
        events[eventName].splice(i, 1);
        break;
      }
    }
  }
}

function emit(eventName, data) {
  if (events[eventName]) {
    events[eventName].forEach(function (fn) {
      fn(data);
    });
  }
}
});

;require.register("scripts/menu", function(exports, require, module) {
'use strict';

var _filehandler = require('scripts/filehandler');

var FileHandler = _interopRequireWildcard(_filehandler);

var _entries = require('scripts/entries');

var Entries = _interopRequireWildcard(_entries);

var _pickitlist = require('scripts/pickitlist');

var PickitList = _interopRequireWildcard(_pickitlist);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//handler
var $mainMenu = $('#main-menu');
$mainMenu.on('click', '#add-build-btn', Entries.addBuild);
$mainMenu.on('click', '#reset-list-btn', Entries.resetList);
$mainMenu.on('click', '#save-list-btn', FileHandler.saveList);
$('#load-list-handle').click(function () {
  $('#load-list-btn').trigger("click"); // simulate click on the hidden file input element
});
$('#load-list-btn').change(function () {
  FileHandler.loadList();
});
$('#generate-btn').on('click', PickitList.generatePickitList);
});

require.register("scripts/pickitlist", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePickitList = generatePickitList;

var _filehandler = require('scripts/filehandler');

var FileHandler = _interopRequireWildcard(_filehandler);

var _itemdata = require('scripts/itemdata');

var ItemData = _interopRequireWildcard(_itemdata);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var itemList = {};
var typeList = {};
var statList = {};
var pickitList = '';
var listObject = {};

function generatePickitList() {
  pickitList = '';
  itemList = ItemData.getItemList();
  typeList = ItemData.getTypeList();
  statList = ItemData.getStatList();
  listObject = FileHandler.collectEntryData();
  //add all essential entries to the pickit list
  FileHandler.getFilePromised('data/essentials.txt').catch(function (error) {
    console.error(error);
  }).then(function (file) {
    pickitList += file;
    pickitList += '\n';

    for (var entry in listObject) {
      var item = listObject[entry];
      var name = item.item_name;
      var comment = item.item_comment;
      if ((name === '' || name === 'no selection') && comment.match(/^;$/)) {} else if (!comment.match(/^ *;/) || comment.match(/^;\|\|\|\|/)) {
        pickitList += comment + '\n';
      }
      // else if ((name===''||name==='no selection')&&comment.match(/^ *;/)) {
      //   pickitList += comment + '\n';
      // }
      else {
          generateString(item);
        }
    }
    savePickitList();
  });
}

function generateString(item) {
  var name = item.item_name;
  var comment = item.item_comment;
  var statCount = item.item_statcount;
  var cube = item.item_cube;
  var stats = item.item_stats;
  var atleastString = generateAtLeastString(statCount, stats);
  var type = getItemType(name);
  name = name.replace("’", "'");

  var string = type + ' = name=' + name + ' ' + atleastString + ' ';
  if (cube === 'true') {
    string += '& can_cubed=1 & cubed=0 ' + comment;
  }
  string += '\n';
  pickitList += string;
}

function generateAtLeastString(statCount, stats) {
  var string = '';
  if (!stats || statCount === '0') {
    return string;
  }
  for (var i = 0; i < stats.length; i++) {
    var pickit = getPickitStat(stats[i]);
    if (pickit === 'not_imp') {
      stats.splice(i, 1);
      i--;
    }
  }

  string += '& at_least[' + statCount + ', ';
  for (var i = 0; i < stats.length; i++) {
    var pickit = getPickitStat(stats[i]);
    string += pickit;
    if (i < stats.length - 1) {
      string += ', ';
    } else {
      string += ']';
      return string;
    }
  }
}

function getItemType(name) {
  var type = undefined;
  for (var item in itemList) {
    if (name === itemList[item].name) {
      type = itemList[item].type;
      var pickitType = typeList[type];
      return pickitType;
    }
  }
}

function getPickitStat(stat) {
  for (var arr in statList) {
    var pickit = statList[arr][2];
    var full = statList[arr][0];
    if (full === stat) {
      return pickit;
    }
  }
}

function savePickitList() {
  var saveObject = pickitList;
  var blob = new Blob([saveObject], { type: "text/plain; charset=utf-8" });

  saveAs(blob, 'pickit_sc_70.ini');
}
});

;
//# sourceMappingURL=app.js.map