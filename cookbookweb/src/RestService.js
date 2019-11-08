import React from 'react';
import './App.css';

class RestService extends React.Component {

  state = {
    contacts: []
  }

    render() {
      return (
        <div>
        <center><h1>Contact List</h1></center>
        {this.state.contacts.map((contact) => (
          <div class="card">
            <ul class="card-body">
              <li class="card-id">{contact.id}</li>
              <li class="card-key">{contact.key}</li>
              <li class="card-value">{contact.value}</li>
            </ul>
          </div>
        ))}
      </div>
      );
    }

 

    componentDidMount() {
      fetch('http://127.0.0.1:7777/data/all')
      .then(res => res.json())
      .then((data) => {
        this.setState({ contacts: data })
      })
      .catch(console.log)
    }
  }

  export default RestService;
