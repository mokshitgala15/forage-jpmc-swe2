import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
  setAttribute(attributeName: string, attributeValue: string): void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  componentDidMount() {
    const elem: PerspectiveViewerElement | null = document.querySelector('perspective-viewer');

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table && elem) {
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', '{"top_ask_price": "avg", "top_bid_price": "avg"}');
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.table && this.props.data !== prevProps.data) {
      this.table.update(this.props.data.map((el: any) => {
        return {
          stock: el.stock,
          top_ask_price: (el.top_ask && el.top_ask.price) || 0,
          top_bid_price: (el.top_bid && el.top_bid.price) || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }

  render() {
    return (
      <perspective-viewer />
    );
  }
}

export default Graph;
