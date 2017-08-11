# PomoApp 1.0

> Tiny pomodoro app built with React.js

![Screenshot](https://raw.githubusercontent.com/OlegWock/pomoapp/master/screen.png)

## Features

* Statistic per task: succesful pomodoros and failed pomodoros

* Daily statistics 

* Long rest every 4 pomodoros 

## Demo?

Yes, [here](http://olegwock.github.io/pomodoroapp/) it is.

## I like it and have a nice feature to implement

Please, fork this repo, implement your feature and make pull request. 

First of all, install all dependencies:

```
npm install
```

Webpack is configured to run dev server with autoreload. Run it by 

```
npm start
```

You also can use gulp (but in this case autoreload will not work).

```
gulp watch 
# or just 
gulp
```

Build app:

```
gulp build
```

Also gulp has task to build chrome extension:

```
gulp build:extension
```

Licensed under MIT.