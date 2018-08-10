
// GLOBAL VARS

var _PlayerVersion = 'v0.02.0';

var AplicationManager = new AplicationManager();
var MenuFunctionsManager = new MenuFunctionsManager();
var moData = new THREE.MediaObject();
var menuData = new THREE.MenuObject();

var MenuManager = new THREE.MenuManager();

var ppMMgr = new THREE.PlayPauseMenuManager();
var volMMgr = new THREE.VolumeMenuManager();
//var setcarMMgr = new THREE.SettingsCardboardMenuManager();
//var mloptMMgr = new THREE.MultiOptionsMenuManager();


var secMMgr = new THREE.SecondaryMenuManager();

var AudioManager = new AudioManager();
var subController = new SubSignManager();
var interController = new THREE.InteractionsController();
var polyfill = new WebVRPolyfill();
var statObj = new StatObject();


var loggerActivated = false;


var demoId = 1;

var mainContentURL = './resources/rapzember-young-hurn_edit.mp4';
//var _selected_content = 'Radio';

var list_contents;




/**
 * Initializes the web player.
 */	

function init_webplayer() 
{
	console.log('Version: ' + _PlayerVersion);

  AudioManager.initAmbisonicResources();
  moData.setFont('./css/fonts/TiresiasScreenfont_Regular.json');
  //moData.setFont('./css/fonts/helvetiker_bold.typeface.json');

  $.getJSON('./content.json', function(json)
  {
    list_contents = json.contents;
		
    for (var i = 0; i < list_contents.length; i++) 
    {
      var id = i;
      var dataText = list_contents[i].name;

      createListGroup(id, list_contents[i].thumbnail, dataText);
    }
  });
}


function blockContainer()
{
	document.getElementById("header").style.display = "none";
	document.getElementById("content_area").style.display = "none";
	document.getElementById("container").style.display = "block";
}

function selectXML(id)
{
  //mainContentURL = id == 2 ? './resources/cam_2_2k.mp4' : './resources/rapzember-young-hurn_edit.mp4';

  mainContentURL = list_contents[id].url;
 
  demoId = id;

  AplicationManager.init_AplicationManager();
  enterfullscreen();
}
       
function startAllVideos()
{
  
  setTimeout(function() {
    runDemo(); 
  },500);

  //moData.playAll();
}


(function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
              .register('./service-worker.js')
              .then(function() { console.log('Service Worker Registered'); });
    }
})();