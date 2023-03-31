import React from 'react';
import './tableControl.scss';

const TableControl = ({ clicks,requests,response, impressions, revenue, fillRate, CTR }) => {

  return (
    <div className='tableContent'>
      <div className='content'>
        <div className="dimensions">Dimensions and Metrics</div>
        <div className='buttons'>
          <button className="date" >Date</button>
          <button className="app">App Name</button>
          <button className="clicks" onClick={clicks}>Clicks</button>
          <button className="ad_request" onClick={requests}>AD Request</button>
          <button className="ad_response" onClick={response}>AD Response</button>
          <button className="impressions" onClick={impressions}>Impression</button>
          <button className="revenue" onClick={revenue}>Revenue</button>
          <button className="fllrate" onClick={fillRate}>Fill Rate</button>
          <button className="ctr" onClick={CTR}>CTR</button>
        </div>
      </div>
    </div>
  )
}

export default TableControl;

