import React from 'react';
import Autocomplete from 'react-autocomplete';

import CircleTimer from './Timer/Timer.jsx';
import API from './API.js';
import styles from './styles/main.css'

class App extends React.Component {
    constructor() {
        super();
        this.api = new API();
        let last_task = this.api.getLast();
        let last_stats = this.api.getStats(last_task) || {'success': 0, 'fails': 0};
        this.state = {
            current_task: last_task,
            active: false,
            active_editing: false,
            time: 25*60,
            items: Object.keys(this.api.getTasks()),
            success: last_stats['success'],
            fails: last_stats['fails'],
            current_period: "work",
            max_pomodoros: 10,
            pomodoros: 3,
        }


        //this. = this..bind(this);
        this.getPomodoros = this.getPomodoros.bind(this);
        this.resetStats = this.resetStats.bind(this);
        this.onTimerStart = this.onTimerStart.bind(this);
        this.onTimerFinish = this.onTimerFinish.bind(this);
        this.onTimerStop = this.onTimerStop.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.isVis = (function(){ // Checks is tab active
            var stateKey, eventKey, keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
            };
            for (stateKey in keys) {
                if (stateKey in document) {
                    eventKey = keys[stateKey];
                    break;
                }
            }
            return function(c) {
                if (c) document.addEventListener(eventKey, c);
                return !document[stateKey];
            }
        })();


    }
    componentDidMount() {
        this.getPomodoros();
    }

    resetStats() {
        this.api.setStats(this.state.current_task, 0, 0);
        this.setState({success: 0, fails: 0});
    }
    toggleEditing() {
        if (this.state.active_editing) {
            this.setState({active_editing: false});
            this.api.register_task(this.state.current_task);
            let task = this.api.getStats(this.state.current_task);

            if (task) this.setState({success: task['success'], fails: task['fails']});

        } else {
            this.setState({active_editing: true});
            this.forceUpdate(() => {
                this.taskInput.focus();
                this.taskInput.select();
            });
        }
    }

    getPomodoros() {
        let ps = this.api.getPomodoros();
        let date = new Date();
        let dt = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
        if (!(dt in ps)) {
            this.setState({pomodoros: 0});
        } else {
            let today_poms = 0;
            for(let key in ps[dt]) {
                today_poms += ps[dt][key];
            }
            this.setState({pomodoros: today_poms});
        }
    }

    onTimerStart(timer) {
        this.setState({active: true});
        this.api.register_task(this.state.current_task);
        this.setState({items: Object.keys(this.api.getTasks())})
    }

    onTimerFinish(timer) {
        let cp = this.state.current_period;
        if (cp == "work") {
            this.setState({active: false,
                success: this.api.increment_task(this.state.current_task),
                current_period: "rest",
                time: this.state.pomodoros % 4 == 0 ? 15*60 : 5*60,
            });
            if (!this.isVis()) this.api.notify("Hey!", "Time for rest.");
            this.api.addPomodoro(this.state.current_task);
            this.getPomodoros();
            timer.resetTime();
        } else {
            this.setState({active: false,
                current_period: "work",
                time: 25*60,
            });
            if (!this.isVis()) this.api.notify("Hey!", "Time for work.");
            timer.resetTime();
        }


    }

    onTimerStop(timer) {
        if (this.state.current_period == "rest") {
            this.setState({active: false});
        } else {
            this.setState({active: false, fails: this.api.increment_fails(this.state.current_task)});
        }

    }

    onChangeHandler(e) {
        let stats = this.api.getStats(e.target.value) || {success: 0, fails: 0};
        this.setState({current_task: e.target.value,
            success: stats.success,
            fails: stats.fails,
        });
    }

    render() {
        const task_h_style = {
            display: this.state.active_editing ? "none" : "block",
        };
        const task_edit_style = {
            display: this.state.active_editing ? "block": "none",
            width: "100%"
        };

        const icon_style = {
            display: !this.state.active ? "block" : "none"
        };

        return (
            <div className={styles.app}>
                <CircleTimer time={this.state.time} color={this.state.current_period == "work" ? "#1abc9c" : "#3498db"} onStart={this.onTimerStart}
                             onFinish={this.onTimerFinish} onStop={this.onTimerStop}
                             disabled={this.state.active_editing}
                             text={this.state.current_period.toUpperCase().split("").join(" ")}
                />

                <div className={styles.right_side}>
                    <div className={styles.task_container}>
                        <h1 style={task_h_style} className={styles.task_heading}>{this.state.current_task}</h1>
                        <Autocomplete items={this.state.items}
                                      wrapperStyle={task_edit_style}
                                      inputProps={{
                                          className: styles.task_input,
                                          onKeyUp: (e) => {
                                              if (e.keyCode == 13) {
                                                  this.toggleEditing();

                                              }
                                          }
                                      }}
                                      ref={(input) => { this.taskInput = input; }}
                                      value={this.state.current_task}
                                      onChange={this.onChangeHandler}
                                      onSelect={value => this.setState({current_task: value})}
                                      shouldItemRender={(item, value) => {return item.toLowerCase().indexOf(value.toLowerCase()) !== -1}}
                                      getItemValue={(item) => item}
                                      renderItem={(item, isHighlighted) =>
                                          <div className={isHighlighted ? styles.autocomplete_item_active : styles.autocomplete_item}>
                                              {item}
                                          </div>
                                      }

                        />
                        <i style={icon_style} onClick={this.toggleEditing}  className={(this.state.active_editing ? "ion-ios-checkmark-outline" : "ion-ios-compose-outline") + " " + styles.icon_edit}></i>

                    </div>
                    <div className={styles.stats}>
                        <div className={styles.stat}><span>Successful:</span><br/><span>{this.state.success} </span></div>
                        <div className={styles.stat}><span>Failed:</span><br/><span>{this.state.fails} </span></div>
                        <div className={styles.stat}><span>Today:</span><br/><span>{this.state.pomodoros} </span></div>
                        <i onClick={this.resetStats} className={"ion-ios-reload " + styles.icon_reset}></i>
                    </div>

                </div>
            </div>
        );
    }
}


export default App;