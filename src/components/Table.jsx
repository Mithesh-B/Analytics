import React, { useState, useEffect } from "react";
import "./table.scss";
import TableControl from "./TableControl";
import Settings from "./Settings";
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectStartDate, selectEndDate } from '../dateRangeSlice';

const Table = () => {
  
    const filterImage = './filter.webp'
    //state of 1st fetch request
    const [data1, setData1] = useState([]);
    //state of second fetch request
    const [data2, setData2] = useState([]);
    //hide buttons toggle
    const [isVisible, setIsVisible] = useState(false);
    //state management for table column visibility
    const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    app: true,
    requests: true,
    responses: true,
    impressions: true,
    clicks: true,
    revenue: true,
    fillRate: true,
    CTR: true
  });
  //get dates from redux store
  const startDate = useSelector(selectStartDate);
  const endDate = useSelector(selectEndDate);
  
//fetch from api
  useEffect(() => {
    const fetchData1 = async () => {

      if(startDate===null && endDate===null){
        console.log('enter the desired dates')
      }
      else{
        try {
          const response = await fetch(
            `http://go-dev.greedygame.com/v3/dummy/report?startDate=${startDate}&endDate=${endDate}`
          );
          const result = await response.json();
          setData1(result);
        } catch (error) {
          console.error('please select a diffrent date range:', error);
        }
      }
      
    };
    fetchData1();
  
    const fetchData2 = async () => {
      try {
        const response = await fetch(
          "http://go-dev.greedygame.com/v3/dummy/apps"
        );
        const result = await response.json();
        setData2(result);
      } catch (error) {
        console.error('Error fetching app name:' , error);
      }
    };
    fetchData2();
  }, [startDate, endDate]);

  //matching app_id of main and secondary link and combining the array
  const getMergedData = () => {
    return data1?.data?.map((item) => {
      const matchingApp = data2?.data?.find(
        (app) => app.app_id === item.app_id
      );
      return {
        ...item,

        app: matchingApp ? matchingApp.app_name : undefined,
      };
    });
  };
  const mergedData = getMergedData();

  //button event handlers
  const handleRequestsButtonClick = () => {
    setVisibleColumns({ ...visibleColumns, 
        requests: !visibleColumns.requests,
        
     });
  };
  
  const handleResponsesButtonClick = () => {
    setVisibleColumns({ ...visibleColumns, 
        responses: !visibleColumns.responses,
     });
  };
  const handleImpressionsButtonClick = () => {
    setVisibleColumns({ ...visibleColumns, 
        impressions: !visibleColumns.impressions,
     });
  };
  const handleClicksButtonClick = () => {
    setVisibleColumns({ ...visibleColumns, 
        clicks: !visibleColumns.clicks,
     });
  };
  const handleRevenueButtonClick = () => {
    setVisibleColumns({ ...visibleColumns, 
        revenue: !visibleColumns.revenue,
     });
  };
  const handleFillRateButtonClick = () => {
    setVisibleColumns({ ...visibleColumns, 
        fillRate: !visibleColumns.fillRate,
     });
  };
  const handleCTRButtonClick = () => {
    setVisibleColumns({ ...visibleColumns, 
        CTR: !visibleColumns.CTR,
     });
  };
//hide buttons toggle
  const handleSettingToggle= () => {
    setIsVisible(!isVisible);
  };
   //formatting numbers according to en-IN
   const formatNumber = (number) => number ? new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 10 }).format(number) : '';
  //total values for table title
  const appCount= mergedData?.length

  //use reduce to get total value
  const getTotalValue = (data, property) => data?.reduce((accumulator, currentItem) => {
    return accumulator + currentItem[property];
  }, 0);

    const totalRequestValue = getTotalValue(mergedData, 'requests');
    const totalResponseValue = getTotalValue(mergedData, 'responses');
    const totalImpressionValue = getTotalValue(mergedData, 'impressions');
    const totalClicksValue = getTotalValue(mergedData, 'clicks');
    const totalRevenueValue = getTotalValue(mergedData, 'revenue');

  return (
    <>
    <Settings  hideButtons={handleSettingToggle} isVisible={isVisible}/>
      {isVisible && <TableControl 
      requests={handleRequestsButtonClick}
      response={handleResponsesButtonClick} 
      impressions={handleImpressionsButtonClick} 
      clicks={handleClicksButtonClick} 
      revenue={handleRevenueButtonClick} 
      fillRate={handleFillRateButtonClick} 
      CTR={handleCTRButtonClick}
      />}

      <table className="table">
        <thead>
          <tr>
            {visibleColumns.date && <th> <img src={filterImage} alt="" /><div>Date</div></th>}
            {visibleColumns.app && <th><img src={filterImage} alt="" /> <div>App</div><div className="average">{appCount}</div></th>}
            {visibleColumns.requests && <th><img src={filterImage} alt="" /> <div>Requests</div><div className="average">{formatNumber(totalRequestValue)}</div></th>}
            {visibleColumns.responses && <th><img src={filterImage} alt="" /> <div>Responses</div><div className="average">{formatNumber(totalResponseValue)}</div></th>}
            {visibleColumns.impressions && <th><img src={filterImage} alt="" /> <div>Impressions</div><div className="average">{formatNumber(totalImpressionValue)}</div></th>}
            {visibleColumns.clicks && <th><img src={filterImage} alt="" /> <div>Clicks</div><div className="average">{formatNumber(totalClicksValue)}</div></th>}
            {visibleColumns.revenue && <th><img src={filterImage} alt="" /> <div>Revenue</div><div className="average">{formatNumber(totalRevenueValue?.toFixed(2))}</div></th>}
            {visibleColumns.fillRate && <th><img src={filterImage} alt="" /> <div>Fill rate</div></th>}
            {visibleColumns.CTR && <th><img src={filterImage} alt="" /> <div>CTR</div></th>}
          </tr>
        </thead>
        <tbody>
          {mergedData?.map((item, index) => {
           //change the date format to en-IN
            const endDate = moment(item.date).format('ll');
            const date = new Date(endDate);
            const formattedDate = date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
            });
     
            //calculating Fill Rate
            const fillRate = ((item.requests / item.responses*100)).toFixed(2);
            //calculating CTR
            const CTR = ((item.clicks / item.impressions *100)).toFixed(2);
            //formatting numbers according to en-IN
            const requests = formatNumber(item.requests);
            const response = formatNumber(item.responses);
            const impressions = formatNumber(item.impressions);
            const clicks = formatNumber(item.clicks);
            /*returns mapped modified data from API to table*/
            return (
              <tr key={index}>
                {visibleColumns.date && <td>{formattedDate}</td>}
                {visibleColumns.app && <td className="app"><img src="./app.png" alt="app icon" />{item.app}</td>}
                {visibleColumns.requests && <td>{requests}</td>}
                {visibleColumns.responses && <td>{response}</td>}
                {visibleColumns.impressions && <td>{impressions}</td>}
                {visibleColumns.clicks && <td>{clicks}</td>}
                {visibleColumns.revenue && <td>${item.revenue?.toFixed(2)}</td>}
                {visibleColumns.fillRate &&  <td>{fillRate}%</td>}  
                {visibleColumns.CTR &&<td>{CTR}%</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Table;



