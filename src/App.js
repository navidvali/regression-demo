import Graph from './components/graph/graph';
import classes from "./App.module.css"
import { useCallback, useState } from 'react';
import Report from "./components/report";

// removed "numjs": "^0.16.1",

const App = () => {
  const [reportData, setReportData] = useState({});
  const [showreport, setShowreport] = useState(false);

  const report = (rep) => {
    setReportData(rep)
    setShowreport(true)
  }

  return (
    <>
      <div className={`${classes.wrap}`}>
        <Graph callup={report}/>
      </div>
      <div className={`${classes.reportWrap}`}>
        {showreport ? <h1>report :</h1> : <></>}
        {showreport ? <Report data={reportData} /> : <></>}
      </div>
    </>
  );
};

export default App;
