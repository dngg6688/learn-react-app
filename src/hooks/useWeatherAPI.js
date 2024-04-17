//step1.不需import React from "react"; 
//在Custom Hooks中因為最後不會回傳JSX，因此不需要匯入React套件
import { useState, useEffect,useCallback } from "react";


const fetchCurrentWeather = ({authorizationkey,stationName}) => {
    // 這邊直接家用fetch api回傳的Promise再傳出去
    // return fetch()
    return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationkey}&StationName=${stationName}`
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("data", data);
        const stationData = data.records.Station[0];
        // console.log({
        //   observationTime: stationData.ObsTime.DateTime,
        //   locationName: stationData.StationName,
        //   temperature: stationData.WeatherElement.AirTemperature, //weatherElements.AirTemperature,
        //   windSpeed: stationData.WeatherElement.WindSpeed, //weatherElements.WindSpeed,
  
        // })
        return ({
          observationTime: stationData.ObsTime.DateTime,
          locationName: stationData.StationName,
          temperature: stationData.WeatherElement.AirTemperature, //weatherElements.AirTemperature,
          windSpeed: stationData.WeatherElement.WindSpeed, //weatherElements.WindSpeed,
  
        })
  
      });
  };
  const fetchWeatherForecast = ({authorizationkey,cityName}) => {
    return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationkey}&locationName=${cityName}`
  
    ).then((response) => response.json())
     .then((data)=>{
      const locationData = data.records.location[0];
      console.log("locationData",locationData)
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx","PoP","CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter//item.elementValue
          }
          return neededElements
          console.log("neededElements",neededElements)
        },
        {}
      )
    //   console.log({
    //     description: weatherElements.Wx.parameterName,
    //     weatherCode: weatherElements.Wx.parameterValue,
    //     rainPossibility: weatherElements.PoP.parameterName,
    //     comfortability: weatherElements.CI.parameterName,
    // })
      return ({
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
      })
  
    })
  };

const useWeatherAPI = ({stationName,cityName,authorizationkey})=>{
    //step2.useState中用來定義weatherElement的部分
    const [weatherElement, setWeatherElement] = useState({
        observationTime: new Date(),
        locationName: '',
        temperature: 0,
        windSpeed: 0,
        description: '',
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: '',
        isLoading: true,
      });
       //step3.透過useCallBack用來定義fetchData()的部分
       const fetchData = useCallback(async () => {
        setWeatherElement((prevState) => ({
          ...prevState,
          isLoading: true,
        }));
    
        const [currentWeather, weatherForecast] = await Promise.all([
            //step1.把locationName,cityName,authorizationkey傳到拉取API的方法中
          fetchCurrentWeather({authorizationkey,stationName}),
          fetchWeatherForecast({authorizationkey,cityName}),
        ]);
    
        setWeatherElement({
          ...currentWeather,
          ...weatherForecast,
          isLoading: false,
        });
      }, [stationName,cityName,authorizationkey]);//step2.在useCallback中記得要把變數放入陣列中
       //step4.透過useEffect用來呼叫fetchData的部分
       useEffect(() => {

        // setCurrentTheme(moment==='day'?'light':'dark');
        fetchData();
      }, [fetchData]);

      //step5.回傳要盎其他元件使用的資料或方法
      return [weatherElement, fetchData];

}

export default useWeatherAPI
