import React from 'react';

class ImgLoader extends React.Component {

  state = {
    image: null
  }
  
  render() {
    return <img src={`data:image/jpeg;base64,${this.state.image}`} alt="description"/>
  }

  componentDidMount() {
    fetch('http://127.0.0.1:7777/img/get?id=' + this.props.id)
    .then(res => res.text())
    .then((data) => {
      this.setState({ image: data})
    })
    .catch(console.log)
  } 




}
export default ImgLoader;