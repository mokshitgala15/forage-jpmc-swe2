import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

// Define 'perspective-viewer' as a valid HTML element here
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'perspective-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

class App extends Component<{}, IState> {
  interval: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,
    };
  }

  // ... Original comments ...

  renderGraph() {
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
    return null; // Render nothing if showGraph is false
  }

  // ... Original comments ...

  getDataFromServer() {
    this.setState({ showGraph: true });

    this.interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({ data: [...this.state.data, ...serverResponds] });
      });
    }, 100);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // ... Original comments ...

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => { this.getDataFromServer() }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
