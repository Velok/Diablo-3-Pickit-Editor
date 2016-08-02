(function () {
  'use strict';

  /* Initialisation */

  const request = require('sync-request');
  const chalk   = require('chalk');
  const fs      = require('fs');
  const cheerio = require('cheerio');

  /* GLOBAL VARIABLES */

  const BATTLENET_BASEURL = 'http://us.battle.net/d3/en/item/';
  const BATTLENET_APIURL  = 'https://us.battle.net/api/d3/data/item/';
  const BATTLENET_ITEMURL = 'http://us.battle.net';
  const FILE_PATH    = `${__dirname}/data/`;
  //used for cheerio
  let $;
  //object to fill items from battle.net
  let itemArr      = [];
  let requestCount = 0;
  let errorCount   = 0;
  let itemCount    = 0;

  /* FUNCTION DECLARATIONS */

  function getBattleNetItems() {
    const catArr = [
      'helm',
      'spirit-stone',
      'voodoo-mask',
      'wizard-hat',
      'pauldrons',
      'chest-armor',
      'cloak',
      'bracers',
      'gloves',
      'belt',
      'mighty-belt',
      'pants',
      'boots',
      'amulet',
      'ring',
      'shield',
      'crusader-shield',
      'mojo',
      'orb',
      'quiver',
      'enchantress-focus',
      'scoundrel-token',
      'templar-relic',
      'axe-1h',
      'dagger',
      'mace-1h',
      'spear',
      'sword-1h',
      'ceremonial-knife',
      'fist-weapon',
      'flail-1h',
      'mighty-weapon-1h',
      'axe-2h',
      'mace-2h',
      'polearm',
      'staff',
      'sword-2h',
      'daibo',
      'flail-2h',
      'mighty-weapon-2h',
      'bow',
      'crossbow',
      'hand-crossbow',
      'wand',
      // 'blacksmith-plan', //exclude
      // 'jeweler-design', //exclude
      // 'page-of-training', //exclude
      // 'misc', //exclude
      // 'potion', //exclude
      // 'crafting-material', //exclude
      // 'dye', //exclude
      // 'gem' //exclude
    ];

    for (let cat of catArr) {
      collectBattleNetItems(cat);
    }
    requestsDone();
  }

  function collectBattleNetItems(type) {
    let url = BATTLENET_BASEURL + type + '/';

    requestCount++;
    let res  = request('GET', url);
    let body = res.body;
    if (res.statusCode === 200) {
      let resArr = parseBattleNetItems(body, type);
      itemArr    = itemArr.concat(resArr);
    }
    else {
      errorCount++;
      console.error(chalk.red('ERROR | Status: '+response.statusCode));
    }
  }

  function parseBattleNetItems(body, type) {
    $ = cheerio.load(body);
    let resArr = [];
    let count = 0;
    // selector for items with full description
    const descSel = $('.legendary, .set .item-details');
    // selector for items with description only in the tooltip
    const shortSel = $('.data-cell');

    descSel.each(function() {
      count++;
    });
    shortSel.each(function() {
      count++;
    });
    if (count === 0) {
      errorCount++;
      console.error(chalk.red('ERROR | Status: no Items found'));
      return;
    }

    console.log('START | Type: '+type+' | Request Nr.: '+requestCount);

    descSel.each(function() {
      let item = {};
      // selector for the item details
      const detailSel = $('.item-details-text a', this);

      item.item_url = BATTLENET_ITEMURL + detailSel.attr('href');
      item          = getSharedAttributes(this, item, type);
      item.quality  = toQuality(detailSel.attr('class'));
      item.name     = detailSel.text();

      console.log(chalk.green('--item: ' + item.url_name));
      resArr.push(item);
      itemCount++;
    });

    shortSel.each(function() {
      let item      = {};
      item.item_url = BATTLENET_ITEMURL + $('a', this).attr('href');
      item          = getSharedAttributes(this, item, type);

      requestCount++;
      console.log('START | Type: battle.net api | Request Nr.: '+requestCount);
      let res  = request('GET', item.api_url);
      let body = res.body;
      if (res.statusCode === 200) {
        let resobj   = JSON.parse(body);
        item.quality = toQuality(resobj.displayColor);
        item.name    = resobj.name;
        console.log(chalk.green('--item: ' + item.url_name));
        resArr.push(item);
        itemCount++;
      }
      else {
        errorCount++;
        console.error(chalk.red('ERROR | Status: '+res.statusCode));
      }
    });

    console.log('END | Type: '+type+' | Item Count: '+count);
    return resArr;
  }

  //get content who shares the same sub selectors
  function getSharedAttributes(context, item, type) {
    item.url_name = item.item_url.replace(/^.+\/(.+)$/, '$1');
    item.api_url  = BATTLENET_APIURL + item.url_name;
    item.img_url  = $('.icon-item-inner', context).attr('style');
    item.img_url  = item.img_url.replace(/^.+\((.+)(?:\);)$/, '$1');
    item.type     = type;

    return item;
  }

  function toQuality(displayColor) {
    switch (displayColor) {
      case 'white':
      return 'common';

      case 'blue':
      return 'magic';

      case 'yellow':
      return 'rare';

      case 'orange':
      return 'legendary';

      case 'green':
      return 'set';

      case 'd3-color-default':
      return 'common';

      case 'd3-color-blue':
      return 'magic';

      case 'd3-color-yellow':
      return 'rare';

      case 'd3-color-orange':
      return 'legendary';

      case 'd3-color-green':
      return 'set';

      default:
      return void 0;
    }
  }

  function requestsDone() {
    console.warn(chalk.yellow(`INFO | Requests: ${requestCount} Items: ${itemCount}`));
    if (errorCount > 0) {
      console.error(chalk.red('ERROR | '+errorCount+' errors occurred'));
      console.warn(chalk.yellow('WARNING | file-saving aborted'));
      return;
    }
    saveFile(itemArr);
  }

  function saveFile(json) {
    fs.writeFile(`${FILE_PATH}itemlist.json`, JSON.stringify(json, null, 2), function(error) {
      if(error) {
        console.error(chalk.red(error));
        return;
      }

      console.log('INFO | save successful');
    });
  }

  /* MAIN */
  getBattleNetItems();
})();
