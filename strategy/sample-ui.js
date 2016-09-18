import React from 'react';
import {AgGridReact, reactCellRendererFactory} from 'ag-grid-react';
import {Button} from 'react-bootstrap';

var StrategyControl = React.createClass({
    post(url, data) {
	$.ajax({
	    type: 'post',
	    url: url,
	    data: JSON.stringify(data),
	    contentType: "application/json"
	});
    },
    start() {
	var data = this.props.params.data;
	this.post("/strategy/start", data);
    },
    pause() {
	var data = this.props.params.data;
	this.post("/strategy/pause", data);
    },
    stop() {
	var data = this.props.params.data;
	this.post("/strategy/stop", data);
    },
    render() {
	return (
		<div>
		<Button onClick={this.start}>Start</Button>
		<Button onClick={this.pause}>Pause</Button>
		<Button onClick={this.stop}>Stop</Button>
		</div>
	);
    }
});

var SampleUi = React.createClass({
    getInitialState() {
	return {
	    counter:0,
	    columnDefs: [
		{headerName: "Id",
		 field: "id"},
		{headerName: "Product",
		 field: "product",
		 editable: true },
		{headerName: "Parameter",
		 field: "param1",
		 editable: true },
		{headerName: "Log",
		 field: "log",
		 cellRenderer: function(params) {
		     return "<a href='/strategy/log/" +
			 params.data.strategy + "/" +
			 params.data.id + "' target='_blank'>Log</a>";
		 }},
		{headerName: "operator",
		 field: "start",
		 cellRenderer: reactCellRendererFactory(StrategyControl)
		}],
	    rowData: []
	};
    },
    // in onGridReady, store the api for later use
    onGridReady(params) {
	this.api = params.api;
	this.columnApi = params.columnApi;
    },
    addRow() {
	var r = this.state.rowData;
	var c = this.state.counter;
	c = c+1;
	r.push({id: c,
		strategy: "sample"});
	this.setState({rowData: r,
		       counter: c});
	this.api.setRowData(r);
    },
    render() {
	return (
	    <div>
		<Button onClick={this.addRow}>Add Row</Button>
	<AgGridReact
	    // column definitions and row data are immutable, the grid
	    // will update when these lists change
	    columnDefs={this.state.columnDefs}
	    rowData={this.state.rowData}
	    onGridReady={this.onGridReady}
	    // or provide props the old way with no binding
	    rowSelection="multiple"
	    enableSorting="true"
	    enableFilter="true"
                   rowHeight="22"
		/></div>
	)
    }
});
    
module.exports = SampleUi;
