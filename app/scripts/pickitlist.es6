import * as FileHandler from 'scripts/filehandler';
import * as ItemData from 'scripts/itemdata';

let itemList = {};
let typeList = {};
let statList = {};
let pickitList = '';
let listObject = {};

export function generatePickitList() {
  pickitList = '';
  itemList = ItemData.getItemList();
  typeList = ItemData.getTypeList();
  statList = ItemData.getStatList();
  listObject = FileHandler.collectEntryData();
  //add all essential entries to the pickit list
  FileHandler.getFilePromised('data/essentials.txt')
  .catch((error) => {
    console.error(error);
  })
  .then((file) => {
    pickitList += file;
    pickitList += '\n';

    for (let entry in listObject) {
      let item = listObject[entry];
      let name = item.item_name;
      let comment = item.item_comment;
      if ((name===''||name==='no selection')&&comment.match(/^;$/)) {
      }
      else if (!comment.match(/^ *;/)||comment.match(/^;\|\|\|\|/)) {
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
  let name = item.item_name;
  let comment = item.item_comment;
  let statCount = item.item_statcount;
  let cube = item.item_cube;
  let stats = item.item_stats;
  let atleastString = generateAtLeastString(statCount, stats);
  let type = getItemType(name);
  name = name.replace("’", "'");

  let string = `${type} = name=${name} ${atleastString} `;
  if (cube === 'true') {
    string += `& can_cubed=1 & cubed=0 ${comment}`;
  }
  string += '\n';
  pickitList += string;
}

function generateAtLeastString(statCount, stats) {
  let string = '';
  if (!stats || statCount === '0') {
    return string;
  }
  for (let i = 0; i < stats.length; i++) {
    let pickit = getPickitStat(stats[i]);
    if (pickit === 'not_imp') {
      stats.splice(i, 1);
      i--;
    }
  }

  string += `& at_least[${statCount}, `;
  for (let i = 0; i < stats.length; i++) {
    let pickit = getPickitStat(stats[i]);
    string += pickit;
    if (i < stats.length - 1) {
      string += ', ';
    }
    else {
      string += ']';
      return string;
    }
  }
}

function getItemType(name) {
  let type;
  for (let item in itemList) {
    if (name === itemList[item].name) {
      type = itemList[item].type;
      let pickitType = typeList[type];
      return pickitType;
    }
  }
}

function getPickitStat(stat) {
  for (let arr in statList) {
    let pickit = statList[arr][2];
    let full = statList[arr][0];
    if (full === stat) {
      return pickit;
    }
  }
}

function savePickitList() {
  let saveObject = pickitList;
  let blob = new Blob([saveObject], {type: "text/plain; charset=utf-8"});

  saveAs(blob, 'pickit_sc_70.ini');
}
