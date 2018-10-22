new class OptionsScript {

    constructor() {
        this.previewButton = document.getElementById('preview');
        this.saveButton = document.getElementById('save');
        this.defaultOptions = {
            audioUrl: '',
            audioVolume: 100,
            notificationTime: 30
        };
        this.initOptions();
        this.initButtons();
        this.initInputs();
    }

    initButtons() {
        this.previewButton.addEventListener('click', () => {
            this.previewUserOptions();
        });
        this.saveButton.addEventListener('click', () => {
            this.saveUserOptions();
        });
    }

    initInputs() {
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function () {
                this.saveButton.textContent = this.saveButton.getAttribute('save');
                if (this.type === 'range') {
                    this.setAttribute('value', this.value)
                }
            });
        });
    }

    getUserOptions() {
        let options = {};
        for (let key in this.defaultOptions) {
            options[key] = this.getInputByKey(key).value || this.defaultOptions[key];
        }
        return options;
    }

    saveUserOptions() {
        chrome.storage.sync.set(this.getUserOptions(), () => {
            this.saveButton.textContent = this.saveButton.getAttribute('saved');
        });
    }

    previewUserOptions() {
        let options = this.getUserOptions();
        let audio = new Audio(options.audioUrl);
        audio.volume = options.audioVolume / 100;
        audio.play();
    }


    async getSavedOptions() {
        return new Promise(resolve => {
            chrome.storage.sync.get(this.defaultOptions, options => {
                resolve(options);
            });
        });
    }

    async initOptions() {
        let savedOptions = await this.getSavedOptions();
        console.log(savedOptions);
        for (let key in savedOptions) {
            if (savedOptions.hasOwnProperty(key)) {
                let value = savedOptions[key];
                let input = this.getInputByKey(key);
                if (input) {
                    input.value = value;
                    input.setAttribute('value', value);
                }
            }
        }
    }

    getInputByKey(key) {
        return document.getElementById(key);
    }

};