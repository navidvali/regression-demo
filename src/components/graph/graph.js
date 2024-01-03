import React, { useRef, useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { inverse, Matrix } from 'ml-matrix';
import { getRelativePosition } from 'chart.js/helpers';
import { qr, ctranspose } from 'mathjs';
import { SVD } from 'svd-js'

import classes from "./graph.module.css"

const Graph = (props) => {
  const chartRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const [method, setMethod] = useState(-1);
  // -1 direct
  // 0 qr
  // 1 svd
  const mainchart = useRef(null);

  useEffect(() => {
    mainchart.current = new Chart(chartRef.current, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Points',
            data: [],
            pointBackgroundColor: 'rgba(75,192,192,1)',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ]
      },
      options: {
        onClick: (event) => {
          const canvasPosition = getRelativePosition(event, mainchart.current);
          const xValue = mainchart.current.scales.x.getValueForPixel(canvasPosition.x);
          const yValue = mainchart.current.scales.y.getValueForPixel(canvasPosition.y);

          // console.log(`Clicked on x: ${xValue}, y: ${yValue}`);
          setCoordinates(prev => [...prev, { x: xValue, y: yValue }]);
          mainchart.current.data.datasets[0].data.push({ x: xValue, y: yValue });
          mainchart.current.update();
        },
        animation: {
          duration: 0, 
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0,
            max: 20,
            ticks: {
              stepSize: 1
           }
          },
          y: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 10,
          }
        }
      }
    });

    return () => {
      mainchart.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (coordinates.length > 1) {
      const X = coordinates.map(point => point.x);
      const y = coordinates.map(point => point.y);

      const XMatrix = new Matrix(X.map((x, i) => [1, x]));
      const yMatrix = new Matrix([y]);
      const yans = yMatrix.to1DArray()
      let number = yMatrix.to1DArray().length;
      
      const XT = XMatrix.transpose();
      const XTX = XT.mmul(XMatrix);
      const XTXInv = inverse(XTX);
      const XTY = XT.mmul(yMatrix.transpose());
      let b1 = XTXInv.mmul(XTY);

      const QRq = qr(XMatrix.to2DArray()).Q;
      const QRr = qr(XMatrix.to2DArray()).R;
      const QRqMatrix = new Matrix(QRq)
      const QRrMatrix = new Matrix(QRr)
      const b2 = inverse(QRrMatrix).mmul(QRqMatrix.transpose()).mmul(yMatrix.transpose());

      const { u, v, q } = SVD(XMatrix.to2DArray());
      const SVDsMatrix = Matrix.zeros(2, 2);
      SVDsMatrix.set(0, 0, q[0]);
      SVDsMatrix.set(1, 1, q[1]);
      const SVDvMatrix = new Matrix(v)
      const SVDuMatrix = new Matrix(u)
      const b3 = SVDvMatrix.transpose().mmul(inverse(SVDsMatrix)).mmul(SVDuMatrix.transpose()).mmul(yMatrix.transpose());

      let avgError1 = 0;
      const ans1 = XMatrix.mmul(b1).to1DArray()
      for (let i = 0; i<number; i++){
        avgError1 += Math.abs(ans1[i] - yans[i])
      }
      let avgError2 = 0;
      const ans2 = XMatrix.mmul(b2).to1DArray()
      for (let i = 0; i<number; i++){
        avgError2 += Math.abs(ans2[i] - yans[i])
      }      
      let avgError3 = 0;
      const ans3 = XMatrix.mmul(b3).to1DArray()
      for (let i = 0; i<number; i++){
        avgError3 += Math.abs(ans3[i] - yans[i])
      }

      const b = method != -1 ? method == 1 ? b3 : b2 : b1
      var data = {
        xmatrix: XMatrix.to1DArray(),
        ymatrix: yMatrix.to1DArray(),
        bmatrix: b1.to1DArray(),
        qmatrix: QRq,
        rmatrix: QRr,
        umatrix: u,
        smatrix: SVDsMatrix.to2DArray(),
        vmatrix: v,
        number: XMatrix.to1DArray().length,
        lineData: b.to1DArray(),
        AvgErrors: [avgError1, avgError2, avgError3],
      }

      props.callup(data)
      const regressionLine = XMatrix.mmul(b).to1DArray();

      if (mainchart.current.data < 1){
        mainchart.current.data.datasets.push({
          type: 'line',
          label: method != -1 ? method == 1 ? 'svd' : 'qr' : 'direct',
          data: regressionLine.map((y, i) => ({ x: X[i], y })),
          borderColor: method != -1 ? method == 1 ? 'rgba(0, 255, 255, 1)' : 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)',
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
        });
      }
      mainchart.current.data.datasets[1] = {
          type: 'line',
          label: method != -1 ? method == 1 ? 'svd' : 'qr' : 'direct',
          data: regressionLine.map((y, i) => ({ x: X[i], y })),
          borderColor: method != -1 ? method == 1 ? 'rgba(0, 0, 255, 1)' : 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)',
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
      }

      mainchart.current.update();
    }
  }, [coordinates, chartRef.current, mainchart, method]);

  const reset = () => {
    mainchart.current.data.datasets = [
      {
        label: 'Points',
        data: [],
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ];
    setCoordinates([]);
    mainchart.current.update()
  }
  
  const changeMethod = (event) => {
    setMethod(event.target.id)
  }

  return (
    <div className={`${classes.wrapG}`}>
      <canvas ref={chartRef} width="1000" height="600" className={`${classes.graph}`} />
      <div className={`${classes.titleWrap}`}>
        <h2 className={`${classes.title}`}> demo for linear <br /> regression </h2>
        <button onClick={reset} className={`${classes.btn} ${classes.btnPush}`}>clear</button>
        <div className={`${classes.methodwrap}`}>
          <button onClick={changeMethod} className={`${classes.methodbtn} ${classes.btnPush} ${classes.shadowr}`} id="0">QR</button>
          <button onClick={changeMethod} className={`${classes.methodbtn} ${classes.btnPush} ${classes.shadowm}`} id="1">svd</button>
          <button onClick={changeMethod} className={`${classes.methodbtn} ${classes.btnPush} ${classes.shadowl}`} id="-1">direct</button>
        </div>
      </div>
    </div>
  );
};

export default Graph;