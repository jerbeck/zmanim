import React, { Component } from 'react';
import '../index.css';
import PanelList from '../components/PanelList';
import reportWebVitals from '../reportWebVitals';

class App extends Component {
  constructor() {
    super();
    this.state = {
      date: this.getDate(),
      location: [],
      timestamp: '',
      times: {},
    }
  }

  getDate = () => {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  getTimeZoneID = () => {
    fetch('https://maps.googleapis.com/maps/api/timezone/json?location='+ this.location[0] +','+ this.location[1] + 'timestamp=1331161200&key=AIzaSyD8JYssqJTgjLXvbz78ura7fvuG7491BFg')
    .then(response => response.json)
    .then(response => this.setState({ tzid: response }))
    .catch((err) => console.log("Error looking up timezone", err));
  }

  processTimes = (zmanim) => {
    let ret = {};
    const zmanMap = {
      'chatzotNight': 'Chatzos (Night)',
      'alotHaShachar': 'Alos HaShachar',
      'dawn': 'Dawn',
      'sunrise': 'Sunrise',
      'sofZmanShma': 'Latest Shema',
      'sofZmanTfilla': 'Latest Tefilla',
      'chatzot': 'Midday',
      'minchaGedola': 'Mincha Gedolah',
      'minchaKetana': 'Mincha Ketana',
      'plagHaMincha': 'Plag HaMincha',
      'sunset': 'Sunset',
      'dusk': 'Dusk',
      'tzeit42min': 'Tzeits HaKochavim',
      'tzeit72min': 'Tzeits HaKochavim (72 min)'
    }

    for (let key in zmanim) {
      if (zmanMap[key]) {
        ret[zmanMap[key]] = zmanim[key].substring(11,16);
      }
      console.log(ret[zmanMap[key]]);
    }

    ret = Object.entries(ret).map((item, i) => {
      return [item[0], item[1]]
    });

    return ret
  }

  componentDidMount() {
    const { date } = this.state;
    fetch('https://www.hebcal.com/zmanim?cfg=json&geonameid=3448439&date=' + date)
      .then(response => response.json())
      .then(response => this.setState({ times: response.times }))
      .catch((err) => console.log('Something went wrong', err))

      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ location: [position.coords.latitude, position.coords.longitude] });
        console.log(position);
      });
  }

  render () {
    const { date, location } = this.state;
    let { times } = this.state;
    times = this.processTimes(times);
    console.log(this.state);
    return !times ?
      <h1 className='tc'>Loading...</h1> :
      (
        <div className='tc'>
          <h1 className='f1'>Zmanim</h1>
          <h2 className='tc'>{date}</h2>
          <h2 className='tc'>{location}</h2>
          <PanelList times={times}/>
        </div>
      );
    }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default App;