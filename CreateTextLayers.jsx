{
    function createUI(thisObj) {
        //deleteAllLayers();

        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Create Text Layers", undefined, { resizeable: true });
        myPanel.textInput = myPanel.add("edittext", [10, 10, 300, 200], "", { multiline: true });
        myPanel.textInput.text = "Koray Birand \nYoutube Videos \nAre Here...\nlink.koraybirand.com/cwwza";
        myPanel.createButton = myPanel.add("button", [10, 210, 300, 240], "Create Text Layers");

        myPanel.createButton.onClick = function() {
            executeMyFunction(myPanel);
        };

        if (myPanel instanceof Window) {
            myPanel.center();
            myPanel.show();
        } else {
            myPanel.layout.layout(true);
            myPanel.layout.resize();
        }
    }

function executeMyFunction(myPanel) {
    var textInput = myPanel.textInput.text;
    if (!textInput) {
        alert("Please enter your text.");
        return;
    }

    var texts = textInput.split('\n');
    var compName = texts[0]; // First line of text

    // Create a new composition
    var newComp = app.project.items.addComp(compName, 3840, 2160, 1, 10, 25);

    // Set the new composition as the active item
    newComp.openInViewer();

    // Now create text layers in the new composition
    createTextLayers(myPanel, newComp);

    //myPanel.close();
}

    function reverseTextLayers(comp) {
    var textLayers = [];

    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer.name.indexOf("T_") === 0) {
            textLayers.push(layer);
        }
    }

    for (var j = textLayers.length - 1; j >= 0; j--) {
        textLayers[j].moveToBeginning();
    }
}

    function createNewComp(compName) {
        var newComp = app.project.items.addComp(compName, 3840, 2160, 1, 10, 25);
        return newComp;
    }

function createTextLayers(myPanel, comp) {
    if (!comp || !(comp instanceof CompItem)) {
        alert("No valid composition provided");
        return;
    }

    app.beginUndoGroup("Create Text Layers");
    
    var lineHeight = 200;
    var texts = myPanel.textInput.text.split('\n');
    texts.reverse();
    
    var textLayers = [];
    var shapeLayers = [];

    for (var i = 0; i < texts.length; i++) {
        var shapeLayer = createRectangleShapeLayer(comp, "B_" + i);
        shapeLayers.push(shapeLayer);
        shapeLayer.moveToBeginning();
    }

    for (var i = 0; i < texts.length; i++) {
        var textLayer = createTextLayer(comp, texts[i], i, texts.length);
        textLayers.push(textLayer);
        textLayer.moveToBeginning();
    }
        

        var controller = comp.layers.addNull();
        controller.name = "Controller";

        var PadX = controller.Effects.addProperty("ADBE Slider Control");
        PadX.name = "PadX";
        PadX.property("Slider").setValue(200);

        var PadY = controller.Effects.addProperty("ADBE Slider Control");
        PadY.name = "PadY";
        PadY.property("Slider").setValue(20);

        var OffsetX = controller.Effects.addProperty("ADBE Slider Control");
        OffsetX.name = "Offset X";
        OffsetX.property("Slider").setValue(0);

        var OffsetY = controller.Effects.addProperty("ADBE Slider Control");
        OffsetY.name = "Offset Y";
        OffsetY.property("Slider").setValue(0);

        var FontSize = controller.Effects.addProperty("ADBE Slider Control");
        FontSize.name = "Font Size";
        FontSize.property("Slider").setValue(171);

        var LineHeight = controller.Effects.addProperty("ADBE Slider Control");
        LineHeight.name = "Line Height";
        LineHeight.property("Slider").setValue(145);

        var Round = controller.Effects.addProperty("ADBE Slider Control");
        Round.name = "Round";
        Round.property("Slider").setValue(0);

        var BoxOpacity = controller.Effects.addProperty("ADBE Slider Control");
        BoxOpacity.name = "Box Opacity";
        BoxOpacity.property("Slider").setValue(100);

        var TextColor = controller.Effects.addProperty("ADBE Color Control");
        TextColor.name = "Text Color";
        TextColor.property("Color").setValue([1,1,1]);

        var BoxColor = controller.Effects.addProperty("ADBE Color Control");
        BoxColor.name = "Box Color";
        BoxColor.property("Color").setValue([1,0,0]);

        var BoxPosition = controller.Effects.addProperty("ADBE Slider Control");
        BoxPosition.name = "Box Y Position";
        BoxPosition.property("Slider").setValue(0);

        var ShadowDirection = controller.Effects.addProperty("ADBE Slider Control");
        ShadowDirection.name = "Shadow Direction";
        ShadowDirection.property("Slider").setValue(0);

        var ShadowDistance = controller.Effects.addProperty("ADBE Slider Control");
        ShadowDistance.name = "Shadow Distance";
        ShadowDistance.property("Slider").setValue(5);

        var ShadowSoftness = controller.Effects.addProperty("ADBE Slider Control");
        ShadowSoftness.name = "Shadow Softness";
        ShadowSoftness.property("Slider").setValue(0);

        var ShadowColor = controller.Effects.addProperty("ADBE Color Control");
        ShadowColor.name = "Shadow Color";
        ShadowColor.property("Color").setValue([0,0,0,1]);

        var ShadowOpacity = controller.Effects.addProperty("ADBE Slider Control");
        ShadowOpacity.name = "Shadow Opacity";
        ShadowOpacity.property("Slider").setValue(0);

        for (var i = 0; i < textLayers.length; i++) {
            linkTextLayerProperties(textLayers[i], controller,textLayers.length);
        }

        app.endUndoGroup();
    }

    function createTextLayer(comp, text, cIndex, totalLines) {
        var textLayer = comp.layers.addText(text);
        textLayer.name = "T_" + cIndex;
        var myTextDocument = new TextDocument("New Text");
        var textProp = textLayer.property("Source Text");
        var myTextDocument = textProp.value;
        myTextDocument.text = text;

        textProp.expression = 'var controlLayer = thisComp.layer("Controller");\n' +
                          'var fontSize = controlLayer.effect("Font Size")("Slider").value;\n' +
                          'var textProp = text.sourceText.style;\n' +
                          'textProp.setFontSize(fontSize);'
      

        var animator = textLayer.Text.Animators.addProperty("ADBE Text Animator");
        var scaleProperty = animator.Properties.addProperty("ADBE Text Scale 3D");
        scaleProperty.setValue([0,0]);

        var rangeSelector = animator.Selectors.addProperty("ADBE Text Selector");
        var start = rangeSelector.property("ADBE Text Percent Start");
        var end = rangeSelector.property("ADBE Text Percent Start");
        var startE = rangeSelector.property("ADBE Text Percent Start");
        var endE = rangeSelector.property("ADBE Text Percent Start");
        var smoothness = rangeSelector.property("ADBE Text Selector Smoothness");
        rangeSelector.advanced.smoothness.setValue(0);

        var frameRate = comp.frameRate;
        
        var framesIn = ( 5 *  (totalLines - cIndex - 1));
        var timeInSecondsIn = framesIn / frameRate;

        var framesOut = 12 + ( 5 * (totalLines - cIndex));
        var timeInSecondsOut = framesOut / frameRate;


        start.setValueAtTime(timeInSecondsIn, 0);
        end.setValueAtTime(timeInSecondsOut, 100);

        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select a composition");
            return;
        }
        var compDuration = comp.duration;
     
        startE.setValueAtTime(compDuration - timeInSecondsIn, 0);
        endE.setValueAtTime(compDuration - timeInSecondsOut, 100);

        var colorAnimator = textLayer.Text.Animators.addProperty("ADBE Text Animator");
        var fillColorProperty = colorAnimator.Properties.addProperty("ADBE Text Fill Color");
        fillColorProperty.expression = 
        'thisComp.layer("Controller").effect("Text Color")("Color")';

        var dropShadow = textLayer.Effects.addProperty("ADBE Drop Shadow");
            
        // Optional: Set Drop Shadow properties
        dropShadow.property("Direction").expression = 'thisComp.layer("Controller").effect("Shadow Direction")("Slider")';
        dropShadow.property("Distance").expression = 'thisComp.layer("Controller").effect("Shadow Distance")("Slider")';
        dropShadow.property("Softness").expression = 'thisComp.layer("Controller").effect("Shadow Softness")("Slider")';
        dropShadow.property("Shadow Color").expression = 'thisComp.layer("Controller").effect("Shadow Color")("Color")'; 
        dropShadow.property("Opacity").expression = 'thisComp.layer("Controller").effect("Shadow Opacity")("Slider")';


        return textLayer;
    }

    function getTextLayerWidth(textLayer, time) {
    var rect = textLayer.sourceRectAtTime(comp.duration/2);
    return rect.width;
    }

    function getTextLayerHeight(textLayer, time) {
    var rect = textLayer.sourceRectAtTime(comp.duration/2);
    return rect.height;
    }

    function deleteAllLayers() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select a composition");
            return;
        }
        app.beginUndoGroup("Delete All Layers");

        for (var i = comp.numLayers; i > 0; i--) {
            comp.layer(i).remove();
        }
        app.endUndoGroup();
    }

    function createControllerLayer(comp) {
        var controller = comp.layers.addNull();
        controller.name = "Controller";
        return controller;
    }

    function linkTextLayerProperties(textLayer, controller,layers) {
        textLayer.property("ADBE Transform Group").property("ADBE Position").expression = 
        'var nL = 0;\n' +
        'for (var i = 1; i <= thisComp.numLayers; i++) {\n'+
        'var layer = thisComp.layer(i);\n'+
        'if (layer.name.substring(0, 2) === "T_") {\n'+
        'nL = nL + 1;\n'+
        '}\n'+
        '}\n'+
        'offsetX = thisComp.layer("Controller").effect("Offset X")("Slider");\n'+
        'offsetY = thisComp.layer("Controller").effect("Offset Y")("Slider");\n'+
        'a = thisComp.width;\n'+
        'b = thisComp.height;\n'+
        's = thisLayer.sourceRectAtTime();\n'+
        'm = thisLayer.sourceRectAtTime(thisComp.duration/2);\n'+
        'itemsHeight = thisComp.layer("Controller").effect("Line Height")("Slider") * nL;\n'+
        'itemHeight = thisComp.layer("Controller").effect("Line Height")("Slider");\n'+
        'kk = (b - itemsHeight) /2;\n'+
        'extra  = index - 2;\n'+
        'c = s.width;\n'+
        'd = a - c;\n'+
        '[((d/2) + (c/2)) + offsetX  , offsetY + kk + (extra * itemHeight) + itemHeight ]';
    }

function createRectangleShapeLayer(comp, layerName) {
    // Create a shape layer
    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = layerName;
    shapeLayer.property("Position").expression = 
    '[0,thisComp.layer("Controller").effect("Box Y Position")("Slider")]';
    shapeLayer.property("Opacity").expression = 
    'thisComp.layer("Controller").effect("Box Opacity")("Slider")';
    
    // Add a rectangle shape group to the shape layer
    var rectGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    rectGroup.name = "Rectangle 1";

    // Add a rectangle path to the rectangle shape group
    var rectPath = rectGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
    rectPath.property("ADBE Vector Rect Size").expression = 
    'pX = thisComp.layer("Controller").effect("PadX")("Slider");\n'+
    'pY = thisComp.layer("Controller").effect("PadY")("Slider");\n'+
    'currentLayerName = thisLayer.name;\n' +
    'number = currentLayerName.split("_")[1];\n' +
    'targetLayerName = "T_" + number;\n' +
    's = thisComp.layer(targetLayerName);\n' +
    '\n' +
    'd = thisComp.duration / 2;\n' +
    'w = s.sourceRectAtTime().width;\n' +
    'mh = s.sourceRectAtTime(d).height;\n' +
    'if (w == 0) {\n' +
        '[0,0]\n' +
    '} else {\n' +
        '[w+pX,mh+pY]\n' +
    '}\n';
    rectPath.property("ADBE Vector Rect Roundness").expression = 
    'thisComp.layer("Controller").effect("")("Slider")';

    //rectPath.property("ADBE Vector Rect Position").setValue(rectPosition);

    // Add a fill to the rectangle shape group
    var rectFill = rectGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    rectFill.property("ADBE Vector Fill Color").setValue([1, 0, 0, 1]); // Set the fill color to red

    var transformGroup = rectGroup.property("ADBE Vector Transform Group");
    transformGroup.property("ADBE Vector Anchor").expression =
    'currentLayerName = thisLayer.name;\n' +
    'number = currentLayerName.split("_")[1];\n' +
    'targetLayerName = "T_" + number;\n' +
    'ss = thisComp.layer(targetLayerName);\n' +
    '\n' +
    'd = thisComp.duration/2;\n' + 
    's = ss.sourceRectAtTime();\n' +
    'w = s.width/2;\n' +
    'h = ss.sourceRectAtTime(thisComp.duration/2).height/2;\n' +
    'l = s.left;\n' +
    't = ss.sourceRectAtTime(d).top;\n' +
    '[-w -l,-h - t]\n';

    transformGroup.property("ADBE Vector Position").expression =
    'currentLayerName = thisLayer.name;\n' +
    'number = currentLayerName.split("_")[1];\n' +
    'targetLayerName = "T_" + number;\n' +
    's = thisComp.layer(targetLayerName);\n' +
    's.transform.position\n';

    return shapeLayer;
}

    function main() {
        createUI(this);
    }

    main();
}
