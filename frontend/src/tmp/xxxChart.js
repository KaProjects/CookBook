import React from 'react';
import { Button } from '@patternfly/react-core';
import { Chart, ChartBar, ChartAxis, ChartVoronoiContainer } from '@patternfly/react-charts';


class TestComp extends React.Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = { showing: false };
    this.state = { data: [] };
  }

  render() {
    const showing = this.state.showing;
    let area;

    if (!showing) {
      area = <Button variant="danger" onClick={this.handleClick}>Show Me!</Button>
    } else {
      area = (
        <div style={{ height: '400px', width: '1000px' }}>
          <Chart
            ariaDesc="Average number of pets"
            // ariaTitle="Bar chart exampleee"
            containerComponent={<ChartVoronoiContainer labels={({ datum }) => `value: ${datum.y}`} constrainToVisibleArea />}
            domain={{ y: [0, 300] }}
            domainPadding={{ x: [30, 25] }}
            // legendData={[{ name: 'Cats' }, { name: 'Dogs' }, { name: 'Birds' }, { name: 'Mice' }]}
            // legendOrientation="vertical"
            // legendPosition="right"
            height={400}
            padding={{
              bottom: 50,
              left: 50,
              right: 200, // Adjusted to accommodate legend
              top: 50
            }}
            width={1000}
          >
            <ChartAxis />
            <ChartAxis dependentAxis showGrid />

            <ChartBar style={{ data: { fill: "#c43a31" } }}
              barWidth={40}
              data={this.state.data} />

          </Chart>
        </div>
      )
    }

    return (
      <div>
        {area}
      </div>
    );
  }

  handleClick() {
    fetch('http://127.0.0.1:7777/data/graph')
      .then(res => res.json())
      .then((data) => {
        this.setState({ data: data })
      })
      .catch(console.log)

    this.setState({ showing: true });
  }



}
export default TestComp;