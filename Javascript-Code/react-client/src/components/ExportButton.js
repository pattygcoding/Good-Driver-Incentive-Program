import React, {Component} from 'react';
import './ExportButton.css'

class ExportButton extends Component {

    state = {
        data: this.props.data,
    };

      // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
  convertArrayOfObjectsToCSV(array, data) {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
      let ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
  downloadCSV(array) {
      console.log("attempting to export")

    const link = document.createElement('a');
    let csv = this.convertArrayOfObjectsToCSV(array, array);
    if (csv == null) return;

    const filename = 'report_export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }

    render() {

        return(
            <button onClick={()=>this.downloadCSV(this.state.data)}>Export</button>
        )

    }

}

export default ExportButton;