var utils = require("../wakanda-extension-mobile-core/utils");
var Base64 = require("base64");
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
  var file = studio.fileSelectDialog("zip");
  if (file) {
    var selectedProjects = studio.getSelectedProjects();
    if (selectedProjects.length > 0) {
      var destPath = selectedProjects[0];
      destPath = destPath.substring(0, destPath.lastIndexOf("/"));
      destPath += "/mobile/www";

      utils.executeAsyncCmd({
          cmd: os.isMac ? 'unzip -u -d ' + destPath + ' ' + file.path : 'extrac32.exe ' + file.path + ' /L ' + destPath + ' /Y',
          options: {
              consoleSilentMode: true
          },
          onmessage: function (msg) {
            studio.log('Ionic creator project imported');
            studio.alert('Ionic creator project imported');
          },
          onerror: function (msg) {
              studio.alert('Error in Ionic creator import');
          }
      });
      //copyFolder(folder.path, destPath);
      studio.log('Ionic creator project imported');
      studio.alert('Ionic creator project imported');
    }
    else {
      studio.alert('Please select a project');
    }


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
    if(destFolder.exists) {
        destFolder.remove();
    }
    destFolder.create();

    toExclude = toExclude || {
      files: [],
      folders: []
    };

    if(destination.slice(-1) !== '/') {
        destination += '/';
    }

    folder.files.forEach(function(file) {
        if(toExclude.files && toExclude.files.indexOf(file.path) === -1) {
            file.copyTo(destination + file.name);
        }
    });

    folder.folders.forEach(function(folder) {
        if(toExclude.folders && toExclude.folders.indexOf(folder.path) === -1) {
           copyFolder(folder.path, destination + folder.name, toExclude);
        }
    });
}
