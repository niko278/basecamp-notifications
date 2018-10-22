window.script = new class WebScript {

    constructor() {
        const options = JSON.parse(document.currentScript.dataset.options);
        this.audioUrl = options.audioUrl;
        this.audioVolume = options.audioVolume;
        this.notificationTime = options.notificationTime;
        this.readEventKey = 'read';
        this.unreadEventKey = 'unread';
        this.notifications = [];
        this.bindEvents();
        this.initAudio();
        this.overrideNotificationMethod();
    }

    bindEvents() {
        window.addEventListener('focus', () => {
            this.closeAllNotifications();
        });
    }

    overrideNotificationMethod() {
        BC.webNotifications.received = data => {
            if (Notification.permission === 'granted') {
                let notification = this.openNotification(data);
                notification.addEventListener('click', () => {
                    Turbolinks.visit(data.url);
                    return window.focus();
                });
            }
        };
    }

    initAudio() {
        this.audio = new Audio(this.audioUrl);
        this.audio.volume = this.audioVolume / 100;
    }

    playAudio() {
        this.audio.currentTime = 0;
        this.audio.play();
    }

    openNotification(data) {
        let notification = new Notification(data.title, {
            body: data.body,
            tag: data.tag,
            icon: data.image
        });
        this.notifications.push(notification);
        this.sendMessage(this.unreadEventKey);
        this.playAudio();
        setTimeout(() => this.closeNotification(notification), this.notificationTime * 1000);
        return notification;
    }

    closeNotification(notification) {
        let index = this.notifications.indexOf(notification);
        if (index >= 0) {
            this.notifications.splice(index, 1);
        }
        notification.close();
    }

    closeAllNotifications() {
        this.notifications.forEach(notification => {
            notification.close();
        });
        this.notifications.splice(0, this.notifications.length);
        this.sendMessage(this.readEventKey);
    }

    sendMessage(key) {
        window.postMessage(key, '*');
    }

};