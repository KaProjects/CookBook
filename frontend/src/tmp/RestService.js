import React from 'react';
import '../App.css';
import { Button } from '@material-ui/core';

class RestService extends React.Component {

  state = {
    ingredients: []
  }

  render() {
    return (
      <div>
        <Button color="primary">Hello World</Button>
        <center><h1>Contact List</h1></center>
        {this.state.ingredients.map((ingredient) => (
          <div class="card">
            <ul class="card-body">
              <li class="card-id">{ingredient.id}</li>
              <li class="card-name">{ingredient.name}</li>
              <li class="card-value">{ingredient.category}</li>
            </ul>
          </div>
        ))}
      </div>
    );
  }



  componentDidMount() {
    fetch('http://127.0.0.1:7777/data/recipe/all')
      .then(res => res.json())
      .then((data) => {
        this.setState({ ingredients: data })
      })
      .catch(console.log)
  }
}

export default RestService;
