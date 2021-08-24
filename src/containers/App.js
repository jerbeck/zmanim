import React, { Component } from 'react';
import '../index.css';
import PanelList from '../components/PanelList';
import reportWebVitals from '../reportWebVitals';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      date: this.getDate()
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

  componentDidMount() {
    const { date } = this.state;
    fetch('https://www.hebcal.com/zmanim?cfg=json&geonameid=3448439&date=' + date)
      .then(response => response.json())
      .then(results => this.setState({ data: results}))
      .catch((err) => console.log('Something went wrong', err))
  }

  render () {
    const { data, date } = this.state;
    const { times } = data;
    return !data ?
      <h1 className='tc'>Loading...</h1> :
      (
        <div className='tc'>
          <h1 className='f1'>Zmanim</h1>
          <h2 className='tc'>{date}</h2>
          <PanelList data={times}/>
        </div>
      );
    }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default App;