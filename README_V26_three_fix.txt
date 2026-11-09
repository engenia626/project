V26 Three.js dependency fix

This build only adds an HTML import map for the bare module specifier `three` used by Three.js GLTFLoader. The existing background, 2D character frames, foreground assets, music, and gameplay files are unchanged.

Windows: run start_windows.bat in this folder.
Local URL: http://127.0.0.1:8026/
The 3D ending page still requires access to the jsDelivr CDN for Three.js.
