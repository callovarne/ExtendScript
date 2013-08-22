/**
 * @author Patrick Walsh
 * Pairs open 3x4in images into a single 4x6in image and saves the result.
 */
(function() {
    
    if (!app.documents || app.documents.length < 2) {
        alert("Please open at least two documents", "Boom!", "ERROR");
        return;
    }

    var i = 0,
        numberOfDocs = app.documents.length; // Original document count
    
    while (i < numberOfDocs) {
        
        var doc0 = app.documents[i],
            doc1 = app.documents[i + 1],
            newDoc = app.documents.add(6, 4, 501),
            selectRegion;
        
        // Copy image data from doc0 into new doc at 0,0; transform to 3x4
        app.activeDocument = doc0;
        app.activeDocument.selection.selectAll();
        app.activeDocument.selection.copy();
        app.activeDocument = newDoc;
        selectRegion = [
            [0,0],
            [3,0],
            [3,4],
            [0,4],
            [0,0]
        ];
        app.activeDocument.selection.select(selectRegion, SelectionType.REPLACE);        
        app.activeDocument.paste();
        
        // Copy image data from doc0 into new doc at 3,0; transform to 3x4
        app.activeDocument = doc1;
        app.activeDocument.selection.selectAll();
        app.activeDocument.selection.copy();
        app.activeDocument = newDoc;
        app.activeDocument.selection.select(selectRegion, SelectionType.REPLACE);
        app.activeDocument.paste();
        app.refresh();
        app.activeDocument.activeLayer.translate(3, 0);
        
        // Build save path
        var saveDirectoryPath = Folder.desktop + "/4x6/",
            saveFolder = new Folder(saveDirectoryPath);
            savePath = saveDirectoryPath + doc0.name + "_" + doc1.name + ".jpeg";
        
        // TODO: This only checks the final folder; see: http://extendscript.blogspot.com/2009/09/verify-or-create-folder-method.html
        if (!saveFolder.exists)
            saveFolder.create();        
        
        //Save document
        var jpgFile = new File(savePath);
        var jpgSaveOptions = new JPEGSaveOptions();
        jpgSaveOptions.embedColorProfile = true;
        jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
        jpgSaveOptions.matte = MatteType.NONE;
        jpgSaveOptions.quality = 1;
        try {
            app.activeDocument.saveAs(jpgFile, jpgSaveOptions, true, Extension.LOWERCASE);
        } catch (ex) {
            alert(savePath + "\n" + ex);
        } finally {
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        }
        
        i += 2; // Increment to next pair of documents
        
    }
    
})();