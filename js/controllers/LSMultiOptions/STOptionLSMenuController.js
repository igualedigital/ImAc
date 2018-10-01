function STOptionLSMenuController() {

	var data;
	var view;
	var viewStructure;

	var subtitlesLanguagesArray = [
									{name: 'subtitlesEngButton', value: 'English', default: true}, 
									{name: 'subtitlesEspButton', value: 'Spanish', default: false}, 
									{name: 'subtitlesCatButton', value: 'Catalan', default: false}, 
									{name: 'subtitlesGerButton', value: 'German', default: false}];
	var subtitlesPositionArray = [
									{name: 'subtitlesTopButton', value: 'Top', default: false},
									{name: 'subtitlesBottomButton', value: 'Bottom', default: true}];
	var subtitlesSizeArray = [
									{name: 'subtitlesSmallSizeButton', value: 'Small', default: false},
									{name: 'subtitlesMediumSizeButton', value: 'Medium', default: false},
									{name: 'subtitlesLargeSizeButton', value: 'Large', default: true}];
	var subtitlesAreasArray = [
									{name: 'subtitlesSmallAreaButton', value: 'Small', default: false},
									{name: 'subtitlesMediumAreaButton', value: 'Medium', default: false},
									{name: 'subtitlesLargeAreaButton', value: 'Large', default: true}];
	var subtitlesIndicatorArray = [
									{name: 'subtitlesIndicatorNoneButton', value: 'None', default: true},
									{name: 'subtitlesIndicatorArrowButton', value: 'Arrow', default: false},
									{name: 'subtitlesIndicatorRadarButton', value: 'Radar', default: false},
									{name: 'subtitlesIndicatorAutoButton', value: 'Auto', default: false}];
	var subtitlesBackgroundArray = [
									{name: 'subtitlesSemitrans', value: 'Semi-Trans', default: true},
									{name: 'subtitlesOutline', value: 'Outline', default: false}];
	var subtitlesEasyArray = [
									{name: 'subtitlesEasyOn', value: 'On', default: false},
									{name: 'subtitlesEasyOff', value: 'Off', default: true}];

    var firstColumnDropdownElements = [ 
                                    {name: 'subtitlesLanguages', value: 'Languages', options: subtitlesLanguagesArray, visible: true},
                                    {name: 'subtitlesEasyRead', value: 'Easy to read', options: subtitlesEasyArray,visible: true}, 
                                    {name: 'subtitlesShowPositions', value: 'Position', options: subtitlesPositionArray, visible: true},
                                    {name: 'subtitlesBackground', value: 'Background', options: subtitlesBackgroundArray, visible: true}, 
                                    {name: 'subtitlesSizes', value: 'Size', options: subtitlesSizeArray, visible: false}, 
                                    {name: 'subtitlesIndicator', value: 'Indicator', options: subtitlesIndicatorArray, visible: false}, 
                                    {name: 'subtitlesAreas', value: 'Area', options: subtitlesAreasArray, visible: false}
                                ];
	
	this.Init = function(){

		data = GetData();
		UpdateData();
		viewStructure = scene.getObjectByName(data.name);
		viewStructure.visible = true;

		view = new OptionLSMenuView();
		view.UpdateView(data); 

		AddInteractivityToMenuElements();

	}

	this.Exit = function()
    {
    	if(viewStructure)
    	{
	    	viewStructure.visible = false;
	    	viewStructure.children.forEach(function(intrElement){
	    		interController.removeInteractiveObject(intrElement.name);
	    	});

	    	viewStructure.getObjectByName('firstcolumndropdown').children = [];
	    	viewStructure.getObjectByName('secondcolumndropdown').children = [];
	    	viewStructure.getObjectByName('firstcolumnhoritzontallines').children = [];
	    	viewStructure.getObjectByName('secondcolumnhoritzontallines').children = [];
    	}
    }

    this.getLSMenuName = function()
    {
    	return data.name;
    }

    function GetData()
	{
	    if (data == null)
	    {
	        data = new OptionLSMenuModel();
	    }
	    return data;
	}


	function UpdateData()
    {
		data.isLSOptEnabled = true;

		data.lsOptEnabledLabelName = 'showSubtitlesMenuButton';
		data.lsOptEnabledLabelValue = './img/menu_ai_icons/ST.png';

		data.lsOptDisbledLabelName = 'disabledSubtitlesMenuButton';
		data.lsOptDisbledLabelValue = './img/menu_ai_icons/ST_strike.png';

		// value: dictionary.translate('language')
		

		data.isUpDownArrowsVisible = firstColumnDropdownElements.length > 4 ? true : false;

		data.firstColumnHoritzontalLineDivisions = getHoritzontalLineDivisions(125, 4*(125*9/16)/6, 0xffffff, 4, 1);

		if(!data.firstColumnDropdown) data.firstColumnDropdown = AddDropdownElements(firstColumnDropdownElements);	

		data.backMenuButtonfunc = function(){ menumanager.NavigateBackMenu()};
		data.onLSOptButtonfunc = function(){};
		data.offLSOptButtonfunc = function(){};

        data.upDropdownButtonfunc = function(){ DropdownUpDownFunc(false) };
        data.downDropdownButtonfunc = function(){ DropdownUpDownFunc(true) };
    }


    function AddInteractivityToMenuElements()
    {
    	viewStructure.children.forEach(function(intrElement){
    		if(intrElement.visible)
    		{
    			interController.addInteractiveObject(intrElement);
    		}
    	})
    }

    function AddDropdownElements(elements)
    {
    	var dropdownInteractiveElements =  [];
    	var h = 4*(125*9/16)/6;

    	elements.forEach(function(element, index){
    		var factor = (index*2)+1;

    		var dropdownIE = new InteractiveElementModel();
	        dropdownIE.width = 125/3;
	        dropdownIE.height =  elements.length>4 ? h/4 : h/elements.length;
	        dropdownIE.name = element.name;
	        dropdownIE.type =  'text';
	        dropdownIE.value = element.value; //AudioManager.getVolume();
	        dropdownIE.color = element.default ? 0xffff00 : 0xffffff;
	        dropdownIE.textSize =  5;
	        
            dropdownIE.interactiveArea =  new THREE.Mesh( new THREE.PlaneGeometry(dropdownIE.width, dropdownIE.height), new THREE.MeshBasicMaterial({visible:  false}));
        	
        	if(element.options)
            {
                dropdownIE.visible = element.visible;
                dropdownIE.onexecute =  function()
                {
                    data.secondColumnActiveOpt = undefined;
                    data.firstColumnActiveOpt = element.name;
                    data.secondColumnDropdown = AddDropdownElements(element.options);
                    data.secondColumnHoritzontalLineDivisions = getHoritzontalLineDivisions(125, 4*(125*9/16)/6, 0xffffff, element.options.length, 2); 
                    UpdateData();
                    setTimeout(function(){view.UpdateView(data)}, 100);
                    
                };
            } 
        	else dropdownIE.onexecute =  function()
            {
                UpdateDefaultLSMenuOption(elements,index);
                data.secondColumnActiveOpt = element.name;
                console.log("Click on "+element.value+ " final option");
                setTimeout(function(){view.UpdateView(data)}, 100);
            };
        	
	        dropdownIE.position = new THREE.Vector3(0, ( h/2-factor*h/(elements.length>4 ? 4*2 : elements.length*2) ), 0.01);

	        dropdownInteractiveElements.push(dropdownIE.create())
    	});


    	return dropdownInteractiveElements
    }

    function UpdateDefaultLSMenuOption(options, newActiveOptionIndex)
    {
        options.forEach(function(element, index){
            if(newActiveOptionIndex == index) element.default = true;
            else element.default = false;
        });
    }


    function getHoritzontalLineDivisions(w, h, color, numberofdivisions, row)
    {
        var linesHoritzontalGroup =  [];
        var material = new THREE.LineBasicMaterial({color: color, linewidth: 1});
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( -w/6, 0, 0 ),new THREE.Vector3( w/6, 0, 0 ));
        
        var line = new THREE.Line( geometry, material );

        switch( numberofdivisions )
        {

            case 2:
                if( row > 1 ) line.position.x +=  w/3;
                linesHoritzontalGroup.push( line );
                return linesHoritzontalGroup;

            case 3:
                var line1 = line.clone();
                var line2 = line.clone();
                line1.position.y += h/6;
                line2.position.y -= h/6;
                if( row > 1 )
                    {
                      line1.position.x +=  w/3;  
                      line2.position.x +=  w/3;  
                    } 
                linesHoritzontalGroup.push(line1);
                linesHoritzontalGroup.push(line2);
                return linesHoritzontalGroup;

            case 4:
                var line2 = line.clone();
                var line3 = line.clone();
                line2.position.y += h/4
                line3.position.y -= h/4
                if( row > 1 )
                {
                  line.position.x += w/3;
                  line2.position.x += w/3; 
                  line3.position.x += w/3;  
                }
                else if ( row == 0 )
                {
                    var line4 = line.clone();
                    line4.position.x -= w/3;
                    line4.position.y += h/4;
                    linesHoritzontalGroup.push(line4);
                } 
                linesHoritzontalGroup.push(line);
                linesHoritzontalGroup.push(line2);
                linesHoritzontalGroup.push(line3);
                return linesHoritzontalGroup;

            default:
                return linesHoritzontalGroup;
        }
    }

    function DropdownUpDownFunc(isDown)
    {            
        var h = 125*9/16;
    
        data.firstColumnDropdown.forEach( function( elem )
        {
            elem.position.y = isDown ? elem.position.y - h/6 : elem.position.y + h/6;

            if ( elem.position.y < -3*h/4 ) elem.position.y = h/4;
            else if ( elem.position.y > 3*h/4 ) elem.position.y = -h/4;

            if ( elem.visible && elem.position.y > h/4 ) elem.visible = false;
            else if ( elem.visible && elem.position.y < -h/4 ) elem.visible = false;
            else if ( elem.visible == false && elem.position.y <= h/4 && elem.position.y >= -h/4 ) elem.visible = true;

        });
        setTimeout(function(){view.UpdateView(data)}, 100);
    };
}