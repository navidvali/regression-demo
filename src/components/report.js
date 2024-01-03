import classes from "./report.module.css";


const Report = (props) => {
    let minimumIndex = props.data.AvgErrors.indexOf(Math.min(...props.data.AvgErrors));
    let maximumIndex = props.data.AvgErrors.indexOf(Math.max(...props.data.AvgErrors));

    return (
        <div className={classes.ReportWrap}>  
            <div>
                <span className={classes.linedata}>𝛽<sub>2</sub> : {props.data.lineData[0]}</span><br></br>
                <span className={classes.linedata}>𝛽<sub>1</sub> : {props.data.lineData[1]}</span>
            </div>
            <b>average Errors: </b>
            <div>
                <span style={{color: 0 == minimumIndex ? "green" : 0 == maximumIndex ? "red" : ""}} className={classes.AvgError}><b>direct</b>: {props.data.AvgErrors[0]}</span>
                <span style={{color: 1 == minimumIndex ? "green" : 1 == maximumIndex ? "red" : ""}} className={classes.AvgError}><b>QR</b> : {props.data.AvgErrors[1]}</span>
                <span style={{color: 2 == minimumIndex ? "green" : 2 == maximumIndex ? "red" : ""}} className={classes.AvgError}><b>svd</b> : {props.data.AvgErrors[2]}</span>
                <br></br><span>Please note that in practice, the performance and error of these methods can vary depending on the specific characteristics of the dataset.</span>
            </div>
            <hr className={classes.line}></hr>
            <h1>(X<sup>⊤</sup> X)<sup>-1</sup> X<sup>⊤</sup> y = β</h1>
            <div className={classes.wrap}>
                <div>
                    <h2> X: </h2>
                    <div className={`${classes.n2matrix}`}>
                        {props.data.xmatrix.map((item, index)=>{
                            return <div className={`${classes.n2matrixItem}`}>{item}</div>
                        })}
                    </div>
                </div>
                <div>
                    <h2> y: </h2>
                    <div className={`${classes.nmatrix}`}>
                        {props.data.ymatrix.map((item, index)=>{
                            return  <div className={`${classes.nmatrixItem}`}>{item}</div>
                        })}
                    </div>
                </div>
                <div>
                    <h2> β: </h2>
                    <div className={`${classes.nmatrix}`}>
                        {props.data.bmatrix.map((item, index)=>{
                            return  <div className={`${classes.nmatrixItem}`}>{item}</div>
                        })}
                    </div>
                </div>
            </div>
            <hr className={classes.line}></hr>
            <h1>R<sup>-1</sup> Q<sup>⊤</sup> y = β</h1>
            <div className={classes.wrap}>
                <div>
                    <h2> Q: </h2>
                    <div className={`${classes.qmatrix}`}>
                        {props.data.qmatrix.map((item, index)=>{
                            let items = [];
                            for(let i=0; i<props.data.number/2; i++){
                                items.push(<div className={`${classes.qmatrixItem}`}>{item[i]}</div>)
                            }
                            return <div className={classes.rwrap}>{items}</div>
                        })}
                    </div>
                </div>
                <div>
                    <h2> R: </h2>
                    <div className={`${classes.rmatrix}`}>
                        {props.data.rmatrix.map((item, index)=>{
                            return <div className={classes.rwrap}>
                                <div className={`${classes.rmatrixItem1}`}>{item[0]}</div>
                                <div className={`${classes.rmatrixItem2}`}>{item[1]}</div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <hr className={classes.line}></hr>
            <h1>𝑉 𝛴<sup>-1</sup> 𝑈<sup>⊤</sup> y = β</h1>
            <div className={classes.wrap}>
                <div>
                    <h2> 𝑈: </h2>
                    <div className={`${classes.rmatrix} ${classes.umatrix}`}>
                        {props.data.umatrix.map((item, index)=>{
                            return <div className={classes.rwrap}>
                                <div className={`${classes.rmatrixItem1}`}>{item[0]}</div>
                                <div className={`${classes.rmatrixItem2}`}>{item[1]}</div>
                            </div>
                        })}
                    </div>
                </div>
                <div>
                    <h2> 𝛴: </h2>
                    <div className={`${classes.rmatrix}`}>
                        {props.data.smatrix.map((item, index)=>{
                            return <div className={classes.rwrap}>
                                <div className={`${classes.rmatrixItem1}`}>{item[0]}</div>
                                <div className={`${classes.rmatrixItem2}`}>{item[1]}</div>
                            </div>
                        })}
                    </div>
                </div>
                <div>
                    <h2> 𝑉: </h2>
                    <div className={`${classes.rmatrix}`}>
                        {props.data.vmatrix.map((item, index)=>{
                            return <div className={classes.rwrap}>
                                <div className={`${classes.rmatrixItem1}`}>{item[0]}</div>
                                <div className={`${classes.rmatrixItem2}`}>{item[1]}</div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
        </div>
    );
  };


export default Report;
  