new class ContentScript {

    constructor() {
        this.scriptPath = 'src/web.js';
        this.defaultOptions = {
            audioUrl: '',
            audioVolume: 100,
            notificationTime: 30
        };
        this.bindEvents();
        this.injectScript();
    }

    bindEvents(){
        window.addEventListener('message', event => {
            chrome.runtime.sendMessage(event.data);
        });
    }

    async getOptionsFromStorage(){
        return new Promise(resolve => {
            chrome.storage.sync.get(this.defaultOptions, options => {
                resolve(options);
            });
        });
    }

    async injectScript(){
        let options = await this.getOptionsFromStorage();
        let script = document.createElement('script');
        script.src = chrome.extension.getURL(this.scriptPath);
        script.dataset.options = JSON.stringify(options);
        document.head.appendChild(script);
    }

};