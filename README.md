# PhotoDrop
![super agent](http://i.imgur.com/kM0EQFm.png?1)

PhotoDrop is a location-based photo sharing iPhone app. It allows iOS users to find and share photos based on their current geolocation. PhotoDrop offers two main functions: PhotoShare and PhotoExplore. With PhotoShare, users can take photos with the app and store them at their current location for other users to see. With PhotoExplore, users can open the app and see the photos that other users have stored at their current location.

![Alt Text](/PhotoDropLiveDemo.gif?raw=true)

## Installation

Requirements:
- OS X is needed for iOS development
- Xcode 7.0 or higher [download here](https://developer.apple.com/xcode/download/)
- npm [install here](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
- rnpm [install here](https://github.com/rnpm/rnpm)

__Step 1: Run 'npm install' from the root directory__ 

__Step 2: Run 'npm install' from the client directory__

```
$ npm install
```

__Step 3: Run 'rnpm link' from the client directory__

```
$ rnpm link
```

__Step 4: Add RCTCustom.m in the Xcode project__
In your Xcode project, add the 'RCTCustom.m' file in the 'Base' folder in the 'PhotoDrop' project (PhotoDrop > Libraries > React.xcodeproj > React > Base). You can do this by control clicking on the 'Base' folder and selecting 'Add File to "React.xcodeproj"...'. You'll find the 'RCTCustom.m' file inside the repo (client > App > Components > Assets).

![super agent](http://i.imgur.com/AKDxeVV.png)

## Connect to Server

To connect to the server, run 'mongod' from the root directory. Then, run 'npm start' to start the server on port 8000.

The api is currently hardcoded to the server in the file client/App/Utils/api.js. You may need to change these server references from a deployed server IP to localhost or vice-versa.

## Run Simulator

In order to run the simulator, navigate to the 'AppDelegate.m' file under the 'ProfoundMongoose' folder. You'll see two options for loading JavaScript code:

1. If you want to run the XCode iPhone simulator from a development server (e.g., localhost), uncomment Option 1 and comment-out Option 2. Then, click the play button in the top-left corner (or Command + R).
2. If you want to run the simular on a physical iPhone device from a pre-bundled file on disk running on a remote server (e.g., Digital Ocean droplet), comment-out Option 1 and uncomment Option 2. Then, click the play button in the top-left corner (or Command + R).
