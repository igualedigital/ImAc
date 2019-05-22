function SettingsMenuView() {

	this.UpdateView = function(data){
		var submenu = scene.getObjectByName(data.name);
        
        submenu.getObjectByName('settings-button').children[0].onexecute = data.openSettingsMenuButtonFunc;
        submenu.getObjectByName('preview-button').children[0].onexecute = data.previewButtonFunc;

        submenu.getObjectByName('traditional-menu-button').visible = (menuMgr.getMenuType() == 1) ? true : false;
        submenu.getObjectByName('traditional-menu-button').children[0].onexecute = data.menuTypeButtonFunc;

        submenu.getObjectByName('enhanced-menu-button').visible = (menuMgr.getMenuType() == 2) ? true : false;
        submenu.getObjectByName('enhanced-menu-button').children[0].onexecute = data.menuTypeButtonFunc;      
    }

    this.pressButtonFeedback = function(data)
    {   
    	var submenu = scene.getObjectByName(data.name);
        interController.removeInteractiveObject(data.clickedButtonName);

        var sceneElement = submenu.getObjectByName(data.clickedButtonName);
        var initScale = sceneElement.scale;

        sceneElement.material.color.set( menuButtonActiveColor );
        sceneElement.scale.set( initScale.x*0.8, initScale.y*0.8, 1 );

        // Set color 'menuDefaultColor' (white), size to initial and add interactivity within 300ms to sceneElement;
       setTimeout(function() { 
            sceneElement.material.color.set( menuDefaultColor );
            sceneElement.scale.set( initScale.x*1.25, initScale.y*1.25, 1 ); 
            interController.addInteractiveObject( sceneElement );
        }, 300);
    };
}