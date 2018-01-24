import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import moment from 'moment';
import 'moment/locale/fi';
import update from 'immutability-helper';
import dummyData from './dummyData';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { DatePicker } from 'material-ui-pickers'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import { CSSTransition, TransitionGroup, Transition } from 'react-transition-group';
import './styles.css';
import styles from './styles.js';

import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';

const KeyboardSwipeableViews = bindKeyboard(SwipeableViews);

// language
const getLang = () => {
  if (navigator.languages !== undefined) return navigator.languages[0];
  return navigator.language;
}
moment.locale(getLang())


// theme
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#eee',
      main: '#82b1ff',
      dark: '#333',
      contrastText: '#ccc',
    },
    secondary: {
      light: '#777',
      main: '#888',
      dark: '#555',
      contrastText: '#666',
    },
    error: {
      main: '#000',
    },
  },
});

const Fade = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={500}
    classNames="fade"
  >
    {children}
  </CSSTransition>
);

class App extends Component {

  constructor() {
    super();
    this.state = {
      section: 'two',
      index: 0,
      date: '2018-01-05',
      data: [],
      newDate: null,
      value: '',
      sections: [],
      changeDay: '2018-01-05',
      maxDate: {},
      minDate: {},
      toggle: null,
      show: false,
    };
  }

  componentDidMount = () => {
    let startD = dummyData[0].date;
    startD = moment(startD).add(0, 'days');
    startD = startD.format('YYYY-MM-DD');
    const startd = new Date(startD);

    let stopD = dummyData[dummyData.length - 1].date;
    stopD = moment(stopD).add(50, 'days');
    stopD = stopD.format('YYYY-MM-DD');
    const stopd = new Date(stopD);

    const getDates = (startDate, stopDate) => {
      let dateArray = [];
      let currentDate = moment(startDate);
      const stopDatee = moment(stopDate);
      while (currentDate <= stopDatee) {
        dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
        currentDate = moment(currentDate).add(1, 'days');
      }
      return dateArray;
    }
    const dummyDays = getDates(startD, stopD);

    const days = dummyData.reduce((obj, item) => {
      if (item.date) {
        obj[item.date] = obj[item.date] || [];
        obj[item.date].push({
          section: item.section,
          name: item.name,
          value: item.value,
          date: item.date,
        });
        return obj;
      }
      return {};
    }, {});

    const daysGroups = Object.keys(days).map(key => {
      return { key: key, values: days[key] };
    });

    const dummyDayss = dummyDays.reduce((obj, item) => {
      if (item) {
        obj[item] = obj[item] || [];
        return obj;
      }
      return {};
    }, {});

    const dummyDaysGroups = Object.keys(dummyDayss).map(key => {
      return { key: key };
    });

    // join
    let array = daysGroups.concat(dummyDaysGroups);

    // remove duplicates
    const uniqueArray = (a, key) => {
      const seen = {};
      return a.filter(item => {
        const k = key(item.key);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
      })
    }
    const b = uniqueArray(array, JSON.stringify)

    // sort
    b.sort((a, b) => {
      return (a.key < b.key) ? -1 : ((a.key > b.key) ? 1 : 0);
    });

    // make sections
    const sections = dummyData.reduce((obj, item) => {
      if (item.section) {
        obj[item.section] = obj[item.section] || [];
        return obj;
      }
      return {};
    }, {});
    const sectionss = Object.keys(sections).map(key => {
      return key;
    });

    // save
    this.setState({
      data: b,
      sections: sectionss,
      maxDate: stopd,
      minDate: startd,
    });

    // make starting day index + toggle selected
    b.map((key, i) => {
      if (key.key === this.state.date) {
        const data = update(b, {
          [i]: {
            $merge: { selected: true }
          }
        });
        this.setState({
          index: i,
          data: data,
          toggle: i,
        });
      }
      return null
    });
  }

  removeAddToggle = toggle => {
    const newData = update(this.state.data, {
      [this.state.toggle]: {
        $merge: { selected: false }
      }
    });
    this.setState({ data: newData, show: !this.state.show }, () => {
      this.state.data.map((x, i) => {
        if (x.key === this.state.changeDay) {
          const newData = update(this.state.data, {
            [i]: {
              $merge: { selected: true }
            }
          });
          this.setState({ data: newData, show: !this.state.show })
        }
        return null
      })
      return null
    })
    this.setState({ toggle })
  }

  changeDay = x => {
    const length = this.state.data.length;
    if (length > this.state.index && this.state.index > 0) {
      let changeState = Object.assign({}, this.state.index)
      changeState = this.state.index + x

      this.state.data.map((f, i) => {
        if (changeState === i) {
          this.setState({
            index: changeState,
            changeDay: f.key,
          });
        }
        return null
      })

    }
  }

  onChangeIndex = index => {
    let changeState = Object.assign({}, this.state.index)
    changeState = index

    this.state.data.map((f, i) => {
      if (changeState === i) {
        this.setState({
          index: changeState,
          changeDay: f.key,
        });
        this.removeAddToggle(i)
      }
      return null
    })

  }

  emptyData = () => {
    return (
      <div style={styles.emptySection} key={999} onClick={() => alert('add some logic')}>
        <p style={{ ...styles.p, ...{ fontSize: 22, fontWeight: 'bold' } }}>+</p>
      </div>
    )
  }

  handleChange = event => this.setState({ section: event.target.value });

  menuItems = x => {
    return x.map((s, i) => (
      <MenuItem
        key={i}
        value={s}
        primarytext={s}
      >{s}</MenuItem>
    ));
  }

  dayChange = index => {
    // change day
    this.state.data.filter((x, i) => {
      if (i === index) { return true }
      return false
    }).map((x, i) => { return this.setState({ changeDay: x.key }) })

    // remove/add toggle
    this.removeAddToggle(index)

    // open date picker
    this.state.data.filter((x, i) => {
      if (x.selected && i === index) { return true }
      return false
    }).map(() => { return this.picker.togglePicker() })

    this.setState({ index })
  }

  calendarChange = y => {
    const date = moment(y).format('YYYY-MM-DD');

    this.state.data.map((f, i) => {
      if (date === f.key) {
        this.setState({
          index: i,
          changeDay: date,
        });
        this.removeAddToggle(i)
      }
      return null
    })
  }

  render() {

    const render = this.state.data.map((x, i) => {
      let values = [];
      if (x.values) { values = x.values }

      if (x.values) {
        return (
          <div key={i} style={styles.container}>
            <TransitionGroup>
              {values.filter(f => {
                if (f.section === this.state.section) {
                  return true
                }
                return false
              })
                .map((z, j, k) => {
                  return (
                    <Fade key={j}>
                      <div style={styles.section} key={j} onClick={() => alert(z.name)}>
                        <p style={styles.p}>section: {z.section}</p>
                        <p style={styles.p}>name: {z.name}</p>
                        <p style={styles.p}>value: {z.value}</p>
                      </div>
                    </Fade>
                  )
                })}
              {this.emptyData()}
            </TransitionGroup>
          </div>
        )
      }
      return (
        <div key={i} style={styles.container}>
          {this.emptyData()}
        </div>
      )
    });


    const renderDates = this.state.data.map((x, i) => {
      const dateNames = moment(x.key).calendar(null, {
        lastDay: '[yesterday]', //!
        sameDay: '[today]', //!
        nextDay: '[tomorrow]', //!
        lastWeek: 'dd MMM Do',
        nextWeek: 'dd MMM Do',
        sameElse: 'dd MMM Do'
      })

      let date = dateNames;
      const year = moment(x.key).format('YYYY');
      const yearTwo = moment().format('YYYY');
      if (year !== yearTwo) {
        date = moment(x.key).format('ll');
      }

      // toggled style
      let selectedStyle;
      let calendar =
        <div
          style={{ ...styles.slide, ...selectedStyle }}>
          {date}
        </div>
      if (x.selected) {
        selectedStyle = {
          fontWeight: 'bold',
          opacity: 1,
          borderTop: 'solid 5px #82b1ff',
          cursor: 'context-menu',
          entering: { opacity: 0 },
          entered: { opacity: 1 },
        }
        calendar =
          <Tooltip
            id="Calendar"
            title="open calendar">
            <div
              style={{ ...styles.slide, ...selectedStyle }}>
              {date}
            </div>
          </Tooltip>
      }
      return (
        <div
          key={i}
          onClick={() => this.dayChange(i)}>
          <Transition in={this.state.show} timeout={500}>
            {calendar}
          </Transition>
        </div>
      )
    })

    return (
      <MuiThemeProvider theme={theme}>
        <div style={styles.selector}>
          <Select
            name='joo'
            fullWidth
            value={this.state.section}
            onChange={this.handleChange}
          >
            {this.menuItems(this.state.sections)}
          </Select>
        </div>

        <SwipeableViews
          ignoreNativeScroll
          enableMouseEvents
          resistance
          animateHeight
          index={this.state.index}
          onChangeIndex={this.onChangeIndex}
        >
          {render}
        </SwipeableViews>

        <KeyboardSwipeableViews
          threshold={1}
          ignoreNativeScroll
          enableMouseEvents
          resistance
          style={styles.root}
          slideStyle={styles.slideContainer}
          index={this.state.index}
          onChangeIndex={this.onChangeIndex}
        >
          {renderDates}
        </KeyboardSwipeableViews>

        <DatePicker
          leftArrowIcon={<KeyboardArrowLeft />}
          rightArrowIcon={<KeyboardArrowRight />}
          autoOk
          ref={node => { this.picker = node; }}
          value={new Date(this.state.changeDay)}
          onChange={date => this.calendarChange(date)}
          maxDate={this.state.maxDate}
          minDate={this.state.minDate}
          style={{ display: 'none' }}
        />
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
