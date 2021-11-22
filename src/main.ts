const DEBUG = false;

const main = () => {
    if (typeof ui === 'undefined') {
        console.log("Plugin not available on headless mode.");
        return;
    }

    EntityViewer.register();

    if (DEBUG) {
        ui.closeAllWindows();
        // NetworkMonitor.getOrOpen();
        ImageList.getOrOpen();
    }
};

registerPlugin({
    name: 'DevTools - Additional Guest Data Viewer',
    version: '1.0',
    authors: ['OpenRCT2','reticulatingsplines'],
    type: 'local',
    licence: 'MIT',
    targetApiVersion: 34,
    main: main
});
