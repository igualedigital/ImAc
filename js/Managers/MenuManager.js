function MenuManager() {

    var menuParent;
    var controllers = [];
    var actualCtrl;
    var menuActivationElement;

    var playpauseCtrl;
    var volumeCtrl;
    var settingsCtrl;
    var multiOptionsCtrl;
    
    this.Init = function()
    {
        if ( _isHMD )
        {
            //menu.scale.set( 0.5, 0.5, 1 );
            menuParent = scene;
        }
        else
        {
            //LSMenu.scale.set( 1, 1, 1 );
            menuParent = camera;
        }

        playpauseCtrl = new PlayPauseLSMenuController();
        controllers.push(playpauseCtrl);
        menuParent.add(createPlayPauseLSMenuViewStructure());
        playpauseCtrl.Init();

        volumeCtrl = new VolumeLSMenuController();
        controllers.push(volumeCtrl);
        menuParent.add(createVolumeLSMenuViewStructure());
        volumeCtrl.Init();

        settingsCtrl = new SettingsLSMenuController();
        controllers.push(settingsCtrl);
        menuParent.add(createSettingsLSMenuViewStructure());
        settingsCtrl.Init();

        multiOptionsCtrl = new MultiOptionsLSMenuController();
        controllers.push(multiOptionsCtrl);
        menuParent.add(createMultiOptionsLSMenuViewStructure());
        multiOptionsCtrl.Init();

        ResetViews();

    }

    this.NavigateForwardMenu = function()
    {
        switch(actualCtrl.getLSMenuName())
        {
            case playpauseCtrl.getLSMenuName():
                return Load(volumeCtrl);

            case volumeCtrl.getLSMenuName():
                return Load(settingsCtrl)

            case settingsCtrl.getLSMenuName():
                return Load(multiOptionsCtrl)

            case multiOptionsCtrl.getLSMenuName():
                return Load(playpauseCtrl)
        }
    }

    this.NavigateBackMenu = function()
    {
        switch(actualCtrl.getLSMenuName())
        {
            case playpauseCtrl.getLSMenuName():
                return Load(multiOptionsCtrl);

            case volumeCtrl.getLSMenuName():
                return Load(playpauseCtrl)

            case settingsCtrl.getLSMenuName():
                return Load(volumeCtrl)

            case multiOptionsCtrl.getLSMenuName():
                return Load(settingsCtrl)
        }
    }

    function Load(controller)
    {
        if(actualCtrl) actualCtrl.Exit();

        actualCtrl = controller;
        
        //CREATE A FUNCTIONS WHERE ALL THE MULTIOPTIONS ARE DISABLED

        interController.setSubtitlesActive( subController.getSubtitleEnabled() ); // TODO CHANGE THIS  FUNCTION

        if ( interController.getSubtitlesActive() ) subController.disableSubtiles(); // TODO CHANGE THIS  FUNCTION

        //subController.switchSigner( false ); // TODO CHANGE THIS  FUNCTION

        MenuDictionary.initGlobalArraysByLanguage();

        actualCtrl.Init();
    }

/**
 * Resets the visibility to false in all the low sighted menus and shows the menu activation area
 *
 * @class      ResetViews (name)
 */
    function ResetViews()
    {
        controllers.forEach(function(controller){
            controller.Exit();
        });

        if(menuActivationElement) menuActivationElement.visible = true;

        //CREATE A FUNCTIONS WHERE ALL THE MULTIOPTIONS ARE ENABLED
        if ( interController.getSubtitlesActive() ) subController.enableSubtitles(); // TODO CHANGE THIS  FUNCTION
    }

    this.createMenuActivationElement = function()
    {
        var geometry = new THREE.SphereGeometry( 99, 64, 16, Math.PI/2, Math.PI * 2,  7*Math.PI/20,  -Math.PI/12 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.FrontSide, transparent: true, opacity:0.05} );
        menuActivationElement = new THREE.Mesh( geometry, material );
        menuActivationElement.name = 'openMenu';

        Reticulum.add( menuActivationElement, {
            reticleHoverColor: 0x4669a7,
            fuseDuration: 2, // Overrides global fuse duration
            fuseVisible: true,
            onGazeOver: function(){
                // do something when user targets object
                scene.getObjectByName("openmenutext").visible = true;
                this.material.color.setHex( 0xffffff );
            },
            onGazeOut: function(){
                // do something when user moves reticle off targeted object
                scene.getObjectByName("openmenutext").visible = false;
                this.material.color.setHex( 0xffffff );
            },
            onGazeLong: function(){
                menuActivationElement.visible = false;
                scene.getObjectByName( "openmenutext" ).visible = false;
                Load(playpauseCtrl);
            }/*,
            onGazeClick: MenuFunctionsManager.getOpenMenuFunc()*/
        });

        scene.add(menuActivationElement)
    }


/*******************************************************************************************************
 *
 *                                 V I E W     S T R U C T U R E S 
 *
 ******************************************************************************************************/


/**
* Creates the background of the lowsighted menu with the close and navigation icons.
*
* @param      {string}  name    The menu name
* @return     {mesh}   { returns the background menu mesh }
*/
    function createLSMenuBaseViewStructure (name){

        var material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 1 } );
        var geometry = new THREE.PlaneGeometry( 125, 125*9/16 ); 
        var menu = new THREE.Mesh( geometry, material );
        menu.position.set( 0, 0, -69 );
        menu.name = name;

        // Create the closeMenuButton by loading a new InteractiveElement model and ijecting the closeMenuButtonData
        var closeMenuButton = new InteractiveElementModel();
        closeMenuButton.width = 10;
        closeMenuButton.height = 10;
        closeMenuButton.rotation = Math.PI/4;
        closeMenuButton.name = 'closeMenuButton';
        closeMenuButton.type=  'icon';
        closeMenuButton.value = './img/menu/plus_icon.png';
        closeMenuButton.color = 0xffffff;
        closeMenuButton.visible = true;
        closeMenuButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(closeMenuButton.width, closeMenuButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        closeMenuButton.onexecute =  function(){ return ResetViews(); };
        closeMenuButton.position = new THREE.Vector3(57, 30, 0.01);

        menu.add(closeMenuButton.create());

        // Create the forwardMenuButton by loading a new InteractiveElement model and ijecting the forwardMenuButtonData
        var forwardMenuButton = new InteractiveElementModel();
        forwardMenuButton.width = 8.4;
        forwardMenuButton.height = 8.4;
        forwardMenuButton.rotation = Math.PI;
        forwardMenuButton.name = 'forwardMenuButton';
        forwardMenuButton.type=  'icon';
        forwardMenuButton.value = './img/menu/less_than_icon.png';
        forwardMenuButton.color = 0xffffff;
        forwardMenuButton.visible = true;
        forwardMenuButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(forwardMenuButton.width, forwardMenuButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        forwardMenuButton.onexecute =  function(){ return console.log("This is the forward menu button"); };
        forwardMenuButton.position = new THREE.Vector3(57, -30, 0.01);

        menu.add(forwardMenuButton.create());

        // Create the backMenuButton by loading a new InteractiveElement model and ijecting the backMenuButtonData
        var backMenuButton = new InteractiveElementModel();
        backMenuButton.width = 8.4;
        backMenuButton.height = 8.4;
        backMenuButton.name = 'backMenuButton';
        backMenuButton.type=  'icon';
        backMenuButton.value = './img/menu/less_than_icon.png';
        backMenuButton.color = 0xffffff;
        backMenuButton.visible = true;
        backMenuButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(backMenuButton.width, backMenuButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        backMenuButton.onexecute =  function(){ return console.log("This is the back menu button"); };
        backMenuButton.position = new THREE.Vector3(-57, -30, 0.01);

        menu.add(backMenuButton.create());

        return menu;
    }

/**
 * Creates the PLAY/PAUSE low sighted menu structure.
 *
 * @return     {mesh}  { the play/pause menu mesh }
 */
    function createPlayPauseLSMenuViewStructure (){

        var playpausemenu = createLSMenuBaseViewStructure('playpausemenu');

        // Create the seekBackButton by loading a new InteractiveElement model and ijecting the seekBackButtonData
        var seekBackButton = new InteractiveElementModel();

        seekBackButton.width = 30;
        seekBackButton.height = 15;
        seekBackButton.name =  'backSeekButton';
        seekBackButton.type=  'icon';
        seekBackButton.value = './img/menu/seek_icon.png';
        seekBackButton.color = 0xffffff;
        seekBackButton.visible = true;
        seekBackButton.interactiveArea=  new THREE.Mesh( new THREE.PlaneGeometry(seekBackButton.width, seekBackButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        seekBackButton.onexecute=  function(){ return console.log("This is a seek back button"); }
        seekBackButton.position = new THREE.Vector3(-45, 0, 0.01);
        
        playpausemenu.add(seekBackButton.create());

        // Create the playbutton by loading a new InteractiveElement model and ijecting the playButtonData
        var playButton = new InteractiveElementModel();
        playButton.width = 50;
        playButton.height = 50;
        playButton.name =  'playButton';
        playButton.type=  'icon';
        playButton.value = './img/menu/play_icon.png';
        playButton.color = 0xffffff;
        playButton.visible = true;
        playButton.interactiveArea=  new THREE.Mesh( new THREE.PlaneGeometry(playButton.width, playButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        playButton.onexecute=  function(){ return console.log("This is the play button"); }
        playButton.position = new THREE.Vector3(0, 0, 0.01);
        
        playpausemenu.add(playButton.create());

        // Create the pauseButton by loading a new InteractiveElement model and ijecting the pauseButtonData
        var pauseButton = new InteractiveElementModel();
        pauseButton.width = 50;
        pauseButton.height = 50;
        pauseButton.name =  'pauseButton';
        pauseButton.type=  'icon';
        pauseButton.value = './img/menu/pause_icon.png';
        pauseButton.color = 0xffffff;
        pauseButton.visible = true;
        pauseButton.interactiveArea=  new THREE.Mesh( new THREE.PlaneGeometry(pauseButton.width, pauseButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        pauseButton.onexecute=  function(){ return console.log("This is the pause button"); }
        pauseButton.position = new THREE.Vector3(0, 0, 0.01);
        
        playpausemenu.add(pauseButton.create());

        // Create the seekForwardButton by loading a new InteractiveElement model and ijecting the seekForwardButtonData
        var seekForwardButton = new InteractiveElementModel();
        seekForwardButton.width = 30;
        seekForwardButton.height = 15;
        seekForwardButton.rotation = Math.PI;
        seekForwardButton.name =  'forwardSeekButton';
        seekForwardButton.type=  'icon';
        seekForwardButton.value = './img/menu/seek_icon.png';
        seekForwardButton.color = 0xffffff;
        seekForwardButton.visible = true;
        seekForwardButton.interactiveArea=  new THREE.Mesh( new THREE.PlaneGeometry(seekForwardButton.width, seekForwardButton.height), new THREE.MeshBasicMaterial({visible: false}));
        seekForwardButton.onexecute=  function(){ return console.log("This is a seek forward button"); }
        seekForwardButton.position = new THREE.Vector3(45, 0, 0.01);
        
        playpausemenu.add(seekForwardButton.create());

        return playpausemenu;
    }

/**
 * Creates the VOLUME low sighted menu structure.
 *
 * @return     {mesh}  { the volume menu mesh }
 */
    function createVolumeLSMenuViewStructure(){

        var volumemenu = createLSMenuBaseViewStructure('volumemenu');

        // Create the minusVolumeButton by loading a new InteractiveElement model and ijecting the minusVolumeButtonData
        var minusVolumeButton = new InteractiveElementModel();
        minusVolumeButton.width = 22.5;
        minusVolumeButton.height = 22.5;
        minusVolumeButton.name = 'minusVolumeButton';
        minusVolumeButton.type =  'icon';
        minusVolumeButton.value = './img/menu/minus_icon.png';
        minusVolumeButton.color = 0xffffff;
        minusVolumeButton.visible = true;
        minusVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(minusVolumeButton.width, minusVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        minusVolumeButton.onexecute =  function(){ return console.log("This is the minus volume button"); };
        minusVolumeButton.position = new THREE.Vector3(-45, 0, 0.01);

        volumemenu.add(minusVolumeButton.create());

        // Create the playbutton by loading a new InteractiveElement model and ijecting the playButtonData
        var plusVolumeButton = new InteractiveElementModel();
        plusVolumeButton.width = 22.5;
        plusVolumeButton.height = 22.5;
        plusVolumeButton.name = 'plusVolumeButton';
        plusVolumeButton.type=  'icon';
        plusVolumeButton.value = './img/menu/plus_icon.png';
        plusVolumeButton.color = 0xffffff;
        plusVolumeButton.visible = true;
        plusVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(plusVolumeButton.width, plusVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        plusVolumeButton.onexecute=  function(){ return console.log("This is the plus volume button"); };
        plusVolumeButton.position = new THREE.Vector3(45, 0, 0.01);

        volumemenu.add(plusVolumeButton.create());

        // Create the pauseButton by loading a new InteractiveElement model and ijecting the pauseButtonData
        var unmuteVolumeButton = new InteractiveElementModel();
        unmuteVolumeButton.width = 50;
        unmuteVolumeButton.height = 50;
        unmuteVolumeButton.name = 'unmuteVolumeButton';
        unmuteVolumeButton.type=  'icon';
        unmuteVolumeButton.value = './img/menu/volume_unmute_icon.png';
        unmuteVolumeButton.color = 0xffffff;
        unmuteVolumeButton.visible = true;
        unmuteVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(unmuteVolumeButton.width, unmuteVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        unmuteVolumeButton.onexecute =  function(){ return console.log("This is the unmute volume button"); };
        unmuteVolumeButton.position = new THREE.Vector3(0, 0, 0.01);

        volumemenu.add(unmuteVolumeButton.create());

        // Create the plusVolumeButton by loading a new InteractiveElement model and ijecting the plusVolumeButtonData
        var muteVolumeButton = new InteractiveElementModel();
        muteVolumeButton.width = 50;
        muteVolumeButton.height = 50;
        muteVolumeButton.name = 'muteVolumeButton';
        muteVolumeButton.type=  'icon';
        muteVolumeButton.value = './img/menu/volume_mute_icon.png';
        muteVolumeButton.color = 0xffffff;
        muteVolumeButton.visible = true;
        muteVolumeButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(muteVolumeButton.width, muteVolumeButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        muteVolumeButton.onexecute=  function(){ return console.log("This is the mute volume button"); };
        muteVolumeButton.position = new THREE.Vector3(0, 0, 0.01);

        volumemenu.add(muteVolumeButton.create());

        var volumeLevel = new InteractiveElementModel();
        volumeLevel.width = 35;
        volumeLevel.height = 35;
        volumeLevel.name = 'volumeLevel';
        volumeLevel.type =  'text';
        volumeLevel.value = '50'; //AudioManager.getVolume();
        volumeLevel.color = 0xffffff;
        volumeLevel.textSize=  18;
        volumeLevel.visible = false;
        volumeLevel.position = new THREE.Vector3(0, 0, 0.01);

        volumemenu.add(volumeLevel.create());
        
        return volumemenu;
    }

/**
 * Creates the SETTINGS low sighted menu structure.
 *
 * @return     {mesh}  { the settings menu mesh }
 */
    function createSettingsLSMenuViewStructure()
    {
        var settingsmenu = createLSMenuBaseViewStructure('settingsmenu');

        var settingsButton = new InteractiveElementModel();
        settingsButton.width = 45;
        settingsButton.height = 45;
        settingsButton.name = 'settingsButton';
        settingsButton.type =  'icon';
        settingsButton.value = './img/menu/settings_icon.png';
        settingsButton.color = 0xffffff;
        settingsButton.visible = true;
        settingsButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(settingsButton.width, settingsButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        settingsButton.onexecute =  function(){ return console.log("This is the settings button"); };
        settingsButton.position = new THREE.Vector3(-30, 0, 0.01);

        settingsmenu.add(settingsButton.create());

        // Create the playbutton by loading a new InteractiveElement model and ijecting the playButtonData
        var cardboardButton = new InteractiveElementModel();
        cardboardButton.width = 45;
        cardboardButton.height = 28;
        cardboardButton.name = 'cardboardButton';
        cardboardButton.type=  'icon';
        cardboardButton.value = './img/menu/cardboard_icon.png';
        cardboardButton.color = 0xffffff;
        cardboardButton.visible = true;
        cardboardButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(cardboardButton.width, cardboardButton.height), new THREE.MeshBasicMaterial({visible:  false}));
        cardboardButton.onexecute=  function(){ return console.log("This is the cardboard button"); };
        cardboardButton.position = new THREE.Vector3(30, 0, 0.01);

        settingsmenu.add(cardboardButton.create());

        return settingsmenu;
    }

/**
 * Creates the MULTI OPTIONS low sighted menu structure.
 *
 * @return     {mesh}  { the multi options menu mesh }
 */
    function createMultiOptionsLSMenuViewStructure()
    {
        var multioptionsmenu = createLSMenuBaseViewStructure('multioptionsmenu');

// SUBTITLES
        var subtitlesButton = new InteractiveElementModel();
        subtitlesButton.width = 20;
        subtitlesButton.height = 20;
        subtitlesButton.name = 'showSubtitlesMenuButton';
        subtitlesButton.type =  'text';
        subtitlesButton.value = 'SL';
        subtitlesButton.color = 0xffffff;
        subtitlesButton.visible = true;
        subtitlesButton.textSize=  12;
        subtitlesButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(subtitlesButton.width, subtitlesButton.height), new THREE.MeshBasicMaterial({visible: false}));
        subtitlesButton.onexecute =  function(){ return console.log("This is the ST button"); };
        subtitlesButton.position = new THREE.Vector3(-3*125/8, 0, 0.01);

        multioptionsmenu.add(subtitlesButton.create());

// SUBTITLES DISABLED
        var subtitlesDisabledButton = new InteractiveElementModel();
        subtitlesDisabledButton.width = 20;
        subtitlesDisabledButton.height = 20;
        subtitlesDisabledButton.name = 'disabledSubtitlesMenuButton';
        subtitlesDisabledButton.type =  'icon';
        subtitlesDisabledButton.value = './img/menu/disabled_st_icon.png';
        subtitlesDisabledButton.color = 0xffffff;
        subtitlesDisabledButton.visible = false;
        subtitlesDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(subtitlesDisabledButton.width, subtitlesDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        subtitlesDisabledButton.onexecute =  function(){ return console.log("This is the disabled ST button"); };
        subtitlesDisabledButton.position = new THREE.Vector3(-3*125/8, 0, 0.01);

        multioptionsmenu.add(subtitlesDisabledButton.create());

//SIGN LANGUAGE
        var signLanguageButton = new InteractiveElementModel();
        signLanguageButton.width = 20;
        signLanguageButton.height = 20;
        signLanguageButton.name = 'showSignLanguageMenuButton';
        signLanguageButton.type =  'text';
        signLanguageButton.value = 'SL';
        signLanguageButton.color = 0xffffff;
        signLanguageButton.visible = true;
        signLanguageButton.textSize=  12;
        signLanguageButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(signLanguageButton.width, signLanguageButton.height), new THREE.MeshBasicMaterial({visible: false}));
        signLanguageButton.onexecute =  function(){ return console.log("This is the SL button"); };
        signLanguageButton.position = new THREE.Vector3(-1*125/8, 0, 0.01);

        multioptionsmenu.add(signLanguageButton.create());

//SIGN LANGUAGE DISABLED
        var signLanguageDisabledButton = new InteractiveElementModel();
        signLanguageDisabledButton.width = 20;
        signLanguageDisabledButton.height = 20;
        signLanguageDisabledButton.name = 'disabledSignLanguageMenuButton';
        signLanguageDisabledButton.type =  'icon';
        signLanguageDisabledButton.value = './img/menu/disabled_sl_icon.png';
        signLanguageDisabledButton.color = 0xffffff;
        signLanguageDisabledButton.visible = false;
        signLanguageDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(signLanguageDisabledButton.width, signLanguageDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        signLanguageDisabledButton.onexecute =  function(){ return console.log("This is the disabled SL button"); };
        signLanguageDisabledButton.position = new THREE.Vector3(-1*125/8, 0, 0.01);

        multioptionsmenu.add(signLanguageDisabledButton.create());

//AUDIO DESCRIPTION
        var audioDescriptionButton = new InteractiveElementModel();
        audioDescriptionButton.width = 20;
        audioDescriptionButton.height = 20;
        audioDescriptionButton.name = 'showAudioDescriptionMenuButton';
        audioDescriptionButton.type =  'text';
        audioDescriptionButton.value = 'AD';
        audioDescriptionButton.color = 0xffffff;
        audioDescriptionButton.visible = true;
        audioDescriptionButton.textSize=  12;
        audioDescriptionButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioDescriptionButton.width, audioDescriptionButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioDescriptionButton.onexecute =  function(){ return console.log("This is the AD button"); };
        audioDescriptionButton.position = new THREE.Vector3(1*125/8, 0, 0.01);

        multioptionsmenu.add(audioDescriptionButton.create());

//AUDIO DESCRIPTION DISABLED
        var audioDescriptionDisabledButton = new InteractiveElementModel();
        audioDescriptionDisabledButton.width = 20;
        audioDescriptionDisabledButton.height = 20;
        audioDescriptionDisabledButton.name = 'disabledAudioDescriptionMenuButton';
        audioDescriptionDisabledButton.type =  'icon';
        audioDescriptionDisabledButton.value = './img/menu/disabled_ad_icon.png';
        audioDescriptionDisabledButton.color = 0xffffff;
        audioDescriptionDisabledButton.visible = false;
        audioDescriptionDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioDescriptionDisabledButton.width, audioDescriptionDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioDescriptionDisabledButton.onexecute =  function(){ return console.log("This is the disabled AD button"); };
        audioDescriptionDisabledButton.position = new THREE.Vector3(1*125/8, 0, 0.01);

        multioptionsmenu.add(audioDescriptionDisabledButton.create());

//AUDIO SUBTITLES
        var audioSubtitlesButton = new InteractiveElementModel();
        audioSubtitlesButton.width = 30;
        audioSubtitlesButton.height = 20;
        audioSubtitlesButton.name = 'showAudioSubtitlesMenuButton';
        audioSubtitlesButton.type =  'text';
        audioSubtitlesButton.value = 'AST';
        audioSubtitlesButton.color = 0xffffff;
        audioSubtitlesButton.visible = true;
        audioSubtitlesButton.textSize =  12;
        audioSubtitlesButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioSubtitlesButton.width, audioSubtitlesButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioSubtitlesButton.onexecute =  function(){ return console.log("This is the AST button"); };
        audioSubtitlesButton.position = new THREE.Vector3(3*125/8, 0, 0.01);

        multioptionsmenu.add(audioSubtitlesButton.create());

//AUDIO SUBTITLES DISABLED
        var audioSubtitlesDisabledButton = new InteractiveElementModel();
        audioSubtitlesDisabledButton.width = 20;
        audioSubtitlesDisabledButton.height = 20;
        audioSubtitlesDisabledButton.name = 'disabledAudioSubtitlesMenuButton';
        audioSubtitlesDisabledButton.type =  'icon';
        audioSubtitlesDisabledButton.value = './img/menu/disabled_ast_icon.png';
        audioSubtitlesDisabledButton.color = 0xffffff;
        audioSubtitlesDisabledButton.visible = false;
        audioSubtitlesDisabledButton.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(audioSubtitlesDisabledButton.width, audioSubtitlesDisabledButton.height), new THREE.MeshBasicMaterial({visible: false}));
        audioSubtitlesDisabledButton.onexecute =  function(){ return console.log("This is the disabled AST button"); };
        audioSubtitlesDisabledButton.position = new THREE.Vector3(3*125/8, 0, 0.01);

        multioptionsmenu.add(audioSubtitlesDisabledButton.create());

        return multioptionsmenu;

    }

    function createOptionLSMenuViewStructure()
    {
        var lsoptionmenu = createLSMenuBaseViewStructure('lsoptionmenu');
    }

}