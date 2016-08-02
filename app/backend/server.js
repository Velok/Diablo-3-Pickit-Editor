(function () {
  'use strict';

  /* Initialisation */

  const express = require('express');
  const cheerio = require('cheerio');
  const request = require('request');
  const fs      = require('fs');
  const http    = require('http');

  const app       = express();

  /* GLOBAL VARIABLES */

  const FILE_PATH    = `${__dirname}/data/`;
  const FANS_BASEURL = 'http://www.diablofans.com/builds/';
  const PORT         = 1337;
  let itemList;
  let $; //used for cheerio

  /* FUNCTION DECLARATIONS */

  function parseFansBuild(body) {
    $ = cheerio.load(body);

    let resObj = {};

    resObj.build_name     = $('.build-title').text();
    resObj.build_url      = FANS_BASEURL + $('.d3build-bbcode-button').attr('data-build-id');
    resObj.build_class    = $('.classBadge').attr('title');

    resObj.item_head      = getItemSlot('head');
    resObj.item_shoulders = getItemSlot('shoulders');
    resObj.item_amulet    = getItemSlot('amulet');
    resObj.item_torso     = getItemSlot('torso');
    resObj.item_wrists    = getItemSlot('wrists');
    resObj.item_hands     = getItemSlot('hands');
    resObj.item_waist     = getItemSlot('waist');
    resObj.item_legs      = getItemSlot('legs');
    resObj.item_feet      = getItemSlot('feet');
    resObj.item_rings     = getItemSlot('rings');
    resObj.item_weapon    = getItemSlot('weapon');
    resObj.item_offhand   = getItemSlot('offhand');

    resObj.kanai_weapon   = $('#kanai-weapon .db-title span').text();
    resObj.kanai_armor    = $('#kanai-armor .db-title span').text();
    resObj.kanai_jewelry  = $('#kanai-jewelry .db-title span').text();

    return resObj;
  }

  function getItemSlot(slot) {
    let slotObj = {};
    let itemArr = [];
    let statArr = [];

    $(`#item-${slot} li[data-item-id]`).each(function() {
      let name       = $('a', this).text();
      let importance = $(this).attr('data-item-importance');
      let infos       = getItemInfos(name);
      let type = infos[0];
      let imgUrl = infos[1];


      console.log(`NAME=${name} | TYPE=${type} | SLOT=${slot}`);

      switch(importance) {
        case '1':
        importance = 'Required';
        break;

        case '2':
        importance = 'Recommended';
        break;

        case '3':
        importance = 'Adequate';
        break;

        default:
        importance = 'not defined';
      }

      let item = {
        'name': name,
        'type': type,
        'importance': importance,
        'img_url': imgUrl
      };

      itemArr.push(item);
    });

    $(`#item-${slot} .item-stat a`).each(function () {
      let stat = $(this).attr('title');
      //returns an array
      stat = stat.match(/(?:<.+?>)(.+?)(?::<)/);
      // index 0 of array is the whole string, 1 is the match
      statArr.push(stat[1]);
    });

    slotObj.items = itemArr;
    slotObj.stats = statArr;

    return slotObj;
  }

  function getItemInfos(name) {
    for (let item of itemList) {
      if (item.name === name) {
        return [item.type, item.img_url];
      }
    }
  }

  /* MAIN */

  // Initialisation of the server
  app.use(express.static(__dirname+'/'));
  app.set('port', process.env.PORT || PORT);

  // load itemList into memory
  fs.readFile(`${FILE_PATH}itemlist.json`, 'utf8', function (err, data) {
    if (err) throw err;
    itemList = JSON.parse(data);
  });

  // root request for index.html
  app.get("/", function(req, res) {
    res.sendfile('index.html');
  });

  // request for diablofans builds
  app.get('/api/fansbuild/:buildNR', function (req, res) {
    let url = FANS_BASEURL + req.params.buildNR;

    request({
      method: 'GET',
      url: url
    }, function(err, response, body) {
      if (!err && response.statusCode === 200) {
        let resObj = parseFansBuild(body);
        res.jsonp(resObj);
      }
      else {
        res.status(response.statusCode).send('request failed');
      }
    });
  });

  // request for the itemList
  app.get('/api/battlenetitems/', function (req, res) {
    res.jsonp(itemList);
  });

  let server = http.createServer(app);

  server.listen(app.get('port'), function(){
    console.log(`Web server listening on port ${app.get('port')}`);
  });
})();
