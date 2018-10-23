new class BackgroundScript {

    constructor() {
        this.defaultIconPath = 'icons/icon-default.png';
        this.unreadIconPath = 'icons/icon-unread.png';
        this.baseUrl = 'https://3.basecamp.com/';
        this.readEventKey = 'read';
        this.unreadEventKey = 'unread';
        this.bindEvents();
        this.checkTab();
    }

    bindEvents() {
        chrome.browserAction.onClicked.addListener(() => {
            this.focusTab();
        });
        chrome.runtime.onMessage.addListener(message => {
            this.handleMessage(message);
        });
        chrome.tabs.onCreated.addListener(() => { 
            this.checkTab();
        });
        chrome.tabs.onUpdated.addListener(() => {
            this.checkTab();
        });
        chrome.tabs.onRemoved.addListener(() => {
            this.checkTab();
        });
    }

    async getTab() {
        return new Promise(resolve => {
            chrome.tabs.query({}, tabs => {
                resolve(tabs.find(tab => tab.url.indexOf(this.baseUrl) === 0));
            });
        });
    }

    async focusTab() {
        let tab = await this.getTab();
        if (tab) {
            chrome.windows.update(tab.windowId, {
                focused: true
            });
            chrome.tabs.update(tab.id, {
                active: true
            });
        }
    }

    async checkTab() {
        let tab = await this.getTab();
        if (tab) {
            chrome.browserAction.enable();
        } else {
            chrome.browserAction.disable();
        }
    }

    handleMessage(message) {
        if (message === this.unreadEventKey) {
            chrome.browserAction.setIcon({path: this.unreadIconPath});
        } else if (message === this.readEventKey) {
            chrome.browserAction.setIcon({path: this.defaultIconPath});
        }
    }

};