import * as ItemData from 'scripts/itemdata';
import * as Entries from 'scripts/entries';

export function getJsonPromised(path) {
  return new Promise((resolve, reject) => {
    $.getJSON(path)
    .done((json) => {
      resolve(json);
    })
    .fail((jqxhr, textStatus, error) => {
      let errormsg = {jqxhr, textStatus, error};
      reject(errormsg);
    });
  });
}

export function getFilePromised(path) {
  return new Promise((resolve, reject) => {
    $.get(path)
    .done((data) => {
      resolve(data);
    })
    .fail((jqxhr, textStatus, error) => {
      let errormsg = {jqxhr, textStatus, error};
      reject(errormsg);
    });
  });
}

export function loadList() {
  let file = $('#load-list-btn')[0].files[0];
  let reader = new FileReader();
  reader.readAsText(file, "text/plain; charset=utf-8");
  reader.onload = function() {
    // $('#item-table').children().remove();
    let listObject = {};
    listObject = JSON.parse(reader.result);
    for (let entry in listObject) {
      Entries.addEntry(listObject[entry]);
    }
  };
}

export function saveList() {
  let saveObject = JSON.stringify(collectEntryData());
  let blob = new Blob([saveObject], {type: "application/json"});

  saveAs(blob, 'pickiteditorlist.json');
}

export function collectEntryData() {
  let saveObject = {};
  const itemList = ItemData.getItemList();
  let $entries = $('#item-table .item-row');
  let i = 0;
  $entries.each(function() {
    let entry = {};
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
