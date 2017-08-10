class API {
    constructor(){
        if (Notification.permission === "default") {
            Notification.requestPermission((permission) => {
                if (permission != "granted") this.can_notify = false;
                else {
                    this.can_notify = true;
                    this.notify("Notification enabled");
                }
            });
        } else if (Notification.permission === "denied") this.can_notify = false;
        else if (Notification.permission === "granted") this.can_notify = true;

        this.notify = this.notify.bind(this);
    }

    register_task(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks") || "{}");
        if (task in tasks) return;
        tasks[task] = {success: 0,
            fails: 0}
        localStorage.setItem("tasks", JSON.stringify(tasks));

        //Set last
        localStorage.setItem("last_task", task);
    }

    increment_task(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks") || "{}");
        tasks[task].success++;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        return tasks[task].success;
    }

    increment_fails(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks") || "{}");
        tasks[task].fails++;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        return tasks[task].fails;
    }

    getStats(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks") || "{}");
        if (!(task in tasks)) return false;
        return tasks[task];
    }

    setStats(task, success, fails) {
        let tasks = JSON.parse(localStorage.getItem("tasks") || "{}");
        if (!(task in tasks)) return false;
        tasks[task] = {success: success,
            fails: fails}
        localStorage.setItem("tasks", JSON.stringify(tasks));
        return true;
    }


    getLast() {
        return localStorage.getItem("last_task") || "Set task name please";
    }

    getTasks() {
        return JSON.parse(localStorage.getItem("tasks") || "{}");
    }

    addPomodoro(task){
        let date = new Date();
        let dt = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
        let poms = JSON.parse(localStorage.getItem("pomodoros") || "{}");
        if (!(dt in poms)) {
            poms[dt] = {task: 1};
        } else {
            if (!(task in poms[dt])) {
                poms[dt][task] = 1;
            } else {
                poms[dt][task]++;
            }
        }

        localStorage.setItem("pomodoros", JSON.stringify(poms));
        return poms[dt][task];
    }

    getPomodoros() {
        return JSON.parse(localStorage.getItem("pomodoros") || "{}");
    }

    notify(heading, text="", time_to_live=3000) {
        if(this.can_notify) {
            let n = new Notification(heading, {
                body: text,
                icon: "icons/icon-128.png"
            });
            return [n, setTimeout(() => n.close(), time_to_live)]
        }
        return false;
    }
}

export default API;