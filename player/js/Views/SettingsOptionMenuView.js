function SettingsOptionMenuView() {
	let submenu;

	this.UpdateView = function(data) {
		submenu = scene.getObjectByName(data.name);


        if(menuMgr.getMenuType() == 2){
            submenu.position.y = (menuHeight/2 + optHeight/2 + menuWidth/100 + data.parentColumnDropdown.length*(optHeight/2))
            
            //MENU ONLY DOWN (uncomment for up/down options)
            // Locate menu depending on the state of the ST (enabled/disabled)
            /*if ( subController.getSubtitleEnabled() ){
                submenu.position.y = subController.getSubPosition().y * (menuHeight/2 + optHeight/2 + menuWidth/100 + data.parentColumnDropdown.length*(optHeight/2))
            }
            else{
                submenu.position.y = menuHeight/2 + optHeight/2 + menuWidth/100 + data.parentColumnDropdown.length*(optHeight/2);
            }*/

        } else {
            submenu.position.y = 0;
            submenu.getObjectByName('preview-button').visible = data.isPreviewVisible;
            submenu.getObjectByName('preview-button').children[0].onexecute = (data.isPreviewVisible) ? data.previewButtonFunc : null;
        }

		submenu.getObjectByName('back-button').visible = data.isFinalDrop || data.hasParentDropdown;
		submenu.getObjectByName('back-button').children[0].onexecute = data.backMenuButtonFunc;

        submenu.getObjectByName('close-button-opt').visible = menuMgr.getMenuType() == 1 ? true : false;
        submenu.getObjectByName('close-button-opt').children[0].onexecute = data.closeOptMenuButtonFunc;

		submenu.getObjectByName('tradoptionmenutitle').add(updateTitle(data));
        submenu.getObjectByName('tradoptionmenutitle').position.y = optHeight/2 * data.parentColumnDropdown.length;

        submenu.getObjectByName('parentcolumndropdown').children = [];

//TODO: CHECK FOREACH
		data.parentColumnDropdown.forEach(function(element, index){
			element.position.x = menuWidth/8 + element.width - 2.2*menuWidth/8;
            element.children[0].children[0].position.x = 7*menuWidth/50;
  			submenu.getObjectByName('parentcolumndropdown').add(element)
		});

        if(data.childColumnActiveOpt && submenu.getObjectByName(data.childColumnActiveOpt)){
            data.parentColumnDropdown.forEach(function(element){
                element.children[0].material.color.set( 0xe6e6e6 );
            });
            submenu.getObjectByName(data.childColumnActiveOpt).children[0].material.color.set( 0xffff00 );
        }

//TODO: CREATE SEPARATE FUNCTION
		let menuShape = _moData.roundedRect( new THREE.Shape(), optWidth, (data.parentColumnDropdown.length+1)*optHeight, 3*menuWidth/100 );
        let material = new THREE.MeshBasicMaterial( { color: 0x111111});
        let geometry = new THREE.ShapeGeometry( menuShape );
        let mesh =  new THREE.Mesh( geometry, material);
        mesh.name = 'tradoptionmenubackground';

        submenu.remove(submenu.getObjectByName('tradoptionmenubackground')).add(mesh);
	}

	function updateTitle(data) {
		scene.getObjectByName("tradoptionmenutitle").remove(submenu.getObjectByName('settings-opt-title'));

		var optTitle = new InteractiveElementModel();
        optTitle.width = 18*menuWidth/200;
        optTitle.height = optHeight;
        optTitle.name = 'settings-opt-title';
        //optTitle.type =  'mix';
        optTitle.type =  'text';
        optTitle.text = MenuDictionary.translate( data.title );
        optTitle.path = data.icon;
        optTitle.textSize =  menuWidth/35;
        optTitle.color = 0xe6e6e6;
        optTitle.visible = true;
        optTitle.position = new THREE.Vector3( 0, 0, 0.01 );
        optTitle.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(optTitle.width,  optHeight), new THREE.MeshBasicMaterial({visible:  false}));

		return optTitle.create();
	}

	this.pressButtonFeedback = function(data) {

        interController.removeInteractiveObject(data.clickedButtonName);

        let sceneElement = submenu.getObjectByName(data.clickedButtonName);
        let initScale = sceneElement.scale;

        sceneElement.material.color.set( menuButtonActiveColor );
        sceneElement.scale.set( initScale.x*0.8, initScale.y*0.8, 1 );

        // Set color 'menuDefaultColor' (white), size to initial and add interactivity within 300ms to sceneElement;
        setTimeout(function() {
            sceneElement.material.color.set( menuDefaultColor );
            sceneElement.scale.set( initScale.x*1.25, initScale.y*1.25, 1 );
            interController.addInteractiveObject( sceneElement );
        }, 300);
    }
}
