new class BackgroundScript {

    constructor() {
        this.defaultIconPath = 'icons/icon-default.png';
        this.unreadIconPath = 'icons/icon-unread.png';
        this.baseUrl = 'https://3.basecamp.com/';
        this.readEventKey = 'read';
        this.unreadEventKey = 'unread';
        this.bindEvents();
    }

    bindEvents() {
        chrome.browserAction.onClicked.addListener(() => {
            this.focusTab();
        });
        chrome.runtime.onMessage.addListener(message => {
            this.handleMessage(message);
        });
    }

    async getTab() {
        return new Promise(resolve => {
            chrome.tabs.query({}, tabs => {
                let tab = tabs.find(tab => tab.url.indexOf(this.baseUrl) === 0);
                if (tab) {
                    resolve(tab);
                }
            });
        });
    }

    async focusTab() {
        let tab = await this.getTab();
        if (tab) {
            chrome.windows.update(tab.windowId, {
                focused: true
            });
            chrome.tabs.highlight({
                tabs: tab.index
            });
        }
    }

    handleMessage(message) {
        if (message === this.unreadEventKey) {
            this.applyIcon(this.unreadIconPath);
        } else if (message === this.readEventKey) {
            this.applyIcon(this.defaultIconPath);
        }
    }

    applyIcon(path){
        chrome.browserAction.setIcon({path: path});
    }

};