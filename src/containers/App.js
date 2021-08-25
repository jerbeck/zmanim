import React, { Component } from 'react';
import '../index.css';
import PanelList from '../components/PanelList';
import SearchBox from '../components/SearchBox';
import reportWebVitals from '../reportWebVitals';

class App extends Component {
  constructor() {
    super();
    this.state = {
      date: this.getDate(),
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

  getTimeZoneID = (location) => {
    fetch('https://maps.googleapis.com/maps/api/timezone/json?location='+ location[0] +','+ location[1] + '&timestamp=1331161200&key=' + api_key)
    .then(response => response.json)

    .then(response => response)
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
    }

    ret = Object.entries(ret).map((item, i) => {
      return [item[0], item[1]]
    });

    return ret
  }

  lookupZip = (event) => {
    if (event.target.value.length === 5) {
      this.setState({ location: event.target.value });
      this.getData(event.target.value);
    }
  }

  getData = (geoInput) => {
    console.log('running');
    const { location } = this.state;
    let url = 'https://www.hebcal.com/zmanim?cfg=json&';
    if (!location) {
      url = url + 'zip=' + geoInput;
      console.log(url);
    } else {
      let timezone = this.getTimeZoneID(location);
      url = url + '&latitude=' + location[0] + '&longitude=' + location[1] + '&tzid=' + timezone;
    }
    fetch(url)
      .then(response => response.json())
      .then(response => this.setState({ times: response.times }))
      .catch((err) => console.log('Something went wrong', err))
  } 

  componentDidMount() {
    console.log('mount');
    console.log(this.state);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ location: [position.coords.latitude, position.coords.longitude] });
        this.getData([position.coords.latitude, position.coords.longitude]);
      });
    }
  }

  componentDidUpdate() {
    console.log('update');
    console.log(this.state);
  }

  render () {
    console.log('render');
    const { date, location } = this.state;
    let { times } = this.state;
    times = this.processTimes(times);
    console.log(this.state);
    return !location ?
      (
      <div>
        <h1 className='tc'>Please Enter your Zip Code</h1>
        <SearchBox lookup={this.lookupZip} />
      </div>
      ) : (
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