import * as FileHandler from 'scripts/filehandler';
import * as Entries from 'scripts/entries';
import * as PickitList from 'scripts/pickitlist';

//handler
let $mainMenu = $('#main-menu');
$mainMenu.on('click', '#add-build-btn', Entries.addBuild);
$mainMenu.on('click', '#reset-list-btn', Entries.resetList);
$mainMenu.on('click', '#save-list-btn', FileHandler.saveList);
$('#load-list-handle').click(function() {
  $('#load-list-btn').trigger("click"); // simulate click on the hidden file input element
});
$('#load-list-btn').change(function() {
  FileHandler.loadList();
});
$('#generate-btn').on('click', PickitList.generatePickitList);
