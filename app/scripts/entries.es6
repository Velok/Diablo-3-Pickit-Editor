import * as FileHandler from 'scripts/filehandler';
import * as ItemData from 'scripts/itemdata';

const itemTemplate = require('templates/item');

//handler
let $itemTable = $('#item-table');
$itemTable.on('click', '.delete-item-btn', deleteEntry);
$itemTable.on('click', '.item-cube-chk', toggleCubeBtn);
$itemTable.on('change', '.item-stats', setStatTitle);
$itemTable.on('chosen:ready', '.item-stats', setStatTitle);
$itemTable.on('click', '.add-item-btn', newEntry);
$itemTable.on('focusout', '.item-comment', checkComment);
$itemTable.on('keyup', '.item-comment', checkCommentEnter);

// takes the json provided from the diablofans api
export function generateBuildEntries(buildObj) {
  let buildEntries = [];
  let itemSlots = [
    'item_head',
    'item_shoulders',
    'item_amulet',
    'item_torso',
    'item_wrists',
    'item_hands',
    'item_waist',
    'item_legs',
    'item_feet',
    'item_rings',
    'item_weapon',
    'item_offhand'
  ];
  let cubeSlots = ['kanai_weapon', 'kanai_armor', 'kanai_jewelry'];

  //title
  let entry = {};
  let startString = `;|||| ${buildObj.build_class}-Build: ${buildObj.build_name}  Link: ${buildObj.build_url} ||||`;
  entry.item_comment = startString;
  buildEntries.push(entry);

  //items
  for (let slot of itemSlots) {
    let items = buildObj[slot].items;
    let stats = buildObj[slot].stats;
    stats = ItemData.alterItemStats(stats);
    for (let item of items) {
      let entry = {};
      entry.item_name = item.name;
      entry.item_cube = false;
      entry.item_stats = stats;
      buildEntries.push(entry);
    }

  }
  //cube items
  for (let slot of cubeSlots) {
    let entry = {};
    let item = buildObj[slot];
    entry.item_name = item;
    entry.item_cube = "true";

    buildEntries.push(entry);
  }

  //build end
  entry = {};
  let endString = `;|||| End of Build ||||`;
  entry.item_comment = endString;
  buildEntries.push(entry);

  for (let entry of buildEntries) {
    addEntry(entry);
  }
  scrollDown();
}

export function addEntry(entryObj) {
  let name = entryObj.item_name || '';
  let comment = entryObj.item_comment || ';';
  let statCount = entryObj.item_statcount || 0;
  //revert empty entry objects
  if (name === '' && comment === '') {
    return;
  }
  let cube = entryObj.item_cube || "false";
  let stats = entryObj.item_stats || [];
  let glyph = 'glyphicon-remove-circle';
  let cubeBtn = 'btn-default';
  if (cube === "true") {
    glyph = 'glyphicon-ok-sign';
    cubeBtn = 'btn-success';
  }

  let isComment = '';
  if (comment.match(/^;\|\|\|\|.*/)) {
    isComment = 'comment-entry';
  }

  let templateVars = {
    items: ItemData.getItemNames(),
    statoptions: ItemData.getStatOptionsString(),
    cube: cube,
    glyph: glyph,
    cubebtn: cubeBtn,
    iscomment: isComment
  };

  $('#item-table').append(itemTemplate(templateVars));
  let $_this = $('#item-table .item-row:last-child');

  $_this.find('.item-name')
  .val(name)
  .chosen({search_contains: true});

  $_this.find('.item-stats')
  .val(stats)
  .chosen();

  $_this.find('.item-stat-options')
  .val(statCount)
  .chosen();

  $_this.find('.item-comment')
  .val(comment);
}

function newEntry() {
  let name = '';
  let comment = ';';

  let templateVars = {
    items: ItemData.getItemNames(),
    statoptions: ItemData.getStatOptionsString(),
    cube: "false",
    glyph: 'glyphicon-remove-circle',
    cubebtn: 'btn-default',
    iscomment: ''
  };

  let $_this = $(this).parent();

  $(itemTemplate(templateVars)).insertAfter($_this);

  $_this = $_this.next();
  $_this.find('.item-name')
  .val(name)
  .chosen({search_contains: true});

  $_this.find('.item-stats')
  .chosen();

  $_this.find('.item-stat-options')
  .val(0)
  .chosen();

  $_this.find('.item-comment')
  .val(comment);
}

function setStatTitle() {
  let $_this = $(this).next().find('.search-choice');
  $_this.each(function () {
    let $_this = $('span', this);
    const shortStatList = ItemData.getShortStatList();
    let text = shortStatList[$_this.text()];
    if (!$_this.attr('title')) {
      $_this.attr('title', $_this.text());
    }
    $_this.text(text);
  });
}

function toggleCubeBtn() {
  let $_this = $(this);
  $_this
  .toggleClass('btn-success')
  .toggleClass('btn-default')
  .find('i')
  .toggleClass('glyphicon-remove-circle')
  .toggleClass('glyphicon-ok-sign');

  if($_this.attr('data-cube') === 'true') {
    $_this.attr('data-cube', 'false');
  }
  else {
    $_this.attr('data-cube', 'true');
  }
}

function checkCommentEnter(ev) {
  if (ev.keyCode === 13) {
    $(this).trigger('blur');
  }
}

//if return true only comment should be saved
export function checkComment() {
  let $_this = $(this);
  let value = $_this.val();

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

export function deleteEntry() {
  $(this).parent().remove();
}

export function addBuild() {
  const BUILDAPI_URL = `http://${window.location.host}/api/fansbuild/`;
  let $buildNrFld = $('#build-nr-fld');
  let buildNr = $buildNrFld.val();
  let url = BUILDAPI_URL + buildNr;

  FileHandler.getJsonPromised(url)
  .then((json) => {
    generateBuildEntries(json);
  })
  .catch((error) => {
    alert('loading build failed! Please enter a valid build number.\nSee help for more information.');
    console.error(error);
  });

  $buildNrFld.val('');
}

export function resetList() {
  location.reload();
}

function scrollDown() {
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  return false;
}
