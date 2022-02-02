import React, {Component, useState} from 'react';
import './App.css';
import MainMenu from "./MainMenu";
import {CircularProgress, List} from "@material-ui/core";
import axios from "axios";
import Typography from "@material-ui/core/Typography";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      host: "10.0.0.7",
      loaded: false,
      selected: -1,
      handleSelection: this.doHandleSelection,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  doHandleSelection = (index) => (event) => {
    this.setState({selected: index});
  }

  componentDidMount = async () => {
    const response = await axios.get(
      "http://" + this.state.host + ":7777/list/all"
    );
    // console.log(response);
    this.setState({recipes: response.data.recipes});
    this.setState({categories: response.data.categories});
    this.setState({ingredients: response.data.ingredients});
    this.setState({loaded: true})
  }

  render() {
    return (
      <div>
        {!this.state.loaded &&
          <div style={{ position: "absolute", top: "50%", left: "50%"}}>
            <CircularProgress />
          </div>
        }
        {this.state.loaded &&
          <div>
            <MainMenu {...this.state} />
            <Typography >
              aaaa {this.state.selected}
            </Typography>
          </div>
        }


      </div>
    );
  }
}


export default App;
