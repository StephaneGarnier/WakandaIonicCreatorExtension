var Base64 = require("base64");
var shell = require("shellWorker")
var actions = {};

/*
 * Entry Point For All Actions
 */
exports.handleMessage = function handleMessage(message){
    var startDate   = new Date();
    var action      = message.action;

    if( action )
    {
        var result = actions[action](message);
        var endDate = new Date();

        //LOG_LEVEL_INFO && log(action + " executed in " + (endDate - startDate).toString() + "ms" );

        return result;
    }
    else
    {
        return false;
    }
};

actions.openCreator = function (event) {
	studio.extension.openPageInTab("https://creator.ionic.io", "Ionic Creator", false, 'left');
};

actions.importCreatorZip = function (event) {
  if (os.isMac) {
    var file = studio.fileSelectDialog("zip");
    if (file) {
      var selectedProjects = studio.getSelectedProjects();
      if (selectedProjects.length > 0) {
        var destPath = selectedProjects[0];
        destPath = destPath.substring(0, destPath.lastIndexOf("/"));
        destPath += "/mobile/www";
        try
        {
            msg = shell.exec('unzip -n -d ' + destPath + ' ' + file.path);
            studio.log(msg);
            studio.alert('Ionic creator project imported');
        }
        catch(e)
        {
                // catch any error here
            msg = "error:" + e.message;
            studio.log(msg);
            studio.alert('Error in Ionic creator import');
        }
      }
      else {
        studio.alert('Please select a project');
      }
    }
  } else {
    studio.alert('This function is not yet implemented for Windows');
  }

  // copyFolder(folder.path)
};

actions.importCreatorFolder = function (event) {
  var folder = studio.folderSelectDialog();
  if (folder) {
    var selectedProjects = studio.getSelectedProjects();

    if (selectedProjects.length > 0) {
      var destPath = selectedProjects[0];
      destPath = destPath.substring(0, destPath.lastIndexOf("/"));
      destPath += "/mobile/www";
      copyFolder(folder.path, destPath);
      studio.log('Ionic creator project imported');
      studio.alert('Ionic creator project imported');
    }
    else {
      studio.alert('Please select a project');
    }
  }
  // copyFolder(folder.path)
};

actions.ionicCreator = function () {
  studio.extension.openPageInTab("https://creator.ionic.io", "Ionic Creator", false, 'left');
};

actions.studioStartHandler = function() {
	studio.setActionEnabled('ionicCreator', false);
  studio.setActionEnabled('importCreatorFolder', false);
  studio.setActionEnabled('openCreator', false);
};

actions.solutionOpenedHandler = function() {
	studio.setActionEnabled('ionicCreator', true);
  studio.setActionEnabled('importCreatorFolder', true);
  studio.setActionEnabled('openCreator', true);
};

actions.solutionClosedHandler = function() {
	studio.setActionEnabled('ionicCreator', false);
  studio.setActionEnabled('importCreatorFolder', false);
  studio.setActionEnabled('openCreator', false);
};

// copyFolder is a recursive function
// because DirectoryEntrySync that can copy folder is not implemented in the studio
// the function is working in absolute path
function copyFolder(source, destination, toExclude) {
    var folder = new Folder(source);
    if(! folder.exists) {
        return;
    }

    var destFolder = Folder(destination);
    if(!destFolder.exists) {
        //destFolder.remove();
        destFolder.create();
    }


    toExclude = toExclude || {
      files: ["routes.js"],
      folders: []
    };

    if(destination.slice(-1) !== '/') {
        destination += '/';
    }

    folder.files.forEach(function(file) {

        if(toExclude.files && toExclude.files.indexOf(file.path) === -1) {

          var fileAtDestination = new File(destination + file.name);
            if (!fileAtDestination.exists) {
              file.copyTo(destination + file.name);
            }
        }else {
          studio.log(destination + file.name);
        }
    });

    folder.folders.forEach(function(folder) {
        if(toExclude.folders && toExclude.folders.indexOf(folder.path) === -1) {
           copyFolder(folder.path, destination + folder.name, toExclude);
        }
    });
}
