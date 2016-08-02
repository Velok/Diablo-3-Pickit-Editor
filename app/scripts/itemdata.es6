import * as FileHandler from 'scripts/filehandler';
import * as Entries from 'scripts/entries';

let itemList = [];
let itemNames = [];
let statList = {};
let shortStatList = {};
let typeList = [];
let statOptionsString = '';

// init
loadItemData();

function loadItemData() {
  Promise.all([
    FileHandler.getJsonPromised('data/itemlist.json'),
    FileHandler.getJsonPromised('data/statlist.json'),
    FileHandler.getJsonPromised('data/typelist.json')
  ])
  .then((jsons) => {
    itemList = jsons[0];
    statList = jsons[1];
    typeList = jsons[2];
    generateItemNames();
    generateStatOptionsString();
    generateShortStatList();
    Entries.addEntry({});
  })
  .catch((error) => {
    console.error(error);
  });
}

export function alterItemStats(fansbuildStats) {
  let fullStats = [];
  let statList = getStatList();

  for (let i = 0; i < fansbuildStats.length; i++) {
    for (let arr in statList) {
      let fans = statList[arr][1];
      let full = statList[arr][0];
      if (fansbuildStats[i] === fans) {
        fullStats.push(full);
      }
    }
  }
  return fullStats;
}
//pull only the itemNames from the itemlist to a new object itemNames
function generateItemNames() {
  for (let item of itemList) {
    itemNames.push(item.name);
  }
}
//generates a long string containing all the options with the stats of the statList
function generateStatOptionsString() {
  for (let arr in statList) {
    let full = statList[arr][0];
    statOptionsString += `<option>${full}</option>`;
  }
}

function generateShortStatList() {
  for (let arr in statList) {
    let long = statList[arr][0];
    let short = statList[arr][3];
    shortStatList[long] = short;
  }
}

export function getShortStatList() {
  return shortStatList;
}

export function getStatOptionsString() {
  return statOptionsString;
}

export function getStatList() {
  return statList;
}

export function getTypeList() {
  return typeList;
}

export function getItemNames() {
  return itemNames;
}

export function getItemList() {
  return itemList;
}
