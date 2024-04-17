import React from "react";
import logo from "./logo.svg";
import { useState, useEffect } from "react";
//1.使用import {ReactComponent as XX} from XXX 引入svg
import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
// import './App.css';
import styled from "@emotion/styled"; //step1.載入emotion套件
import { ThemeProvider } from "@emotion/react"; //stepI.從＠emotion/react引入ThemeProvider
import dayjs from "dayjs";
import {ReactComponent as LoadingIcon} from "./images/loading.svg"

//one.定義深色主題配色
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};
//step2.定義帶有styled的div元件

/*three.在styled component中透過props取得對的顏色*/
/*stepIIII.雖然沒有使用props把theme導入但Container依然可以取用到theme這個props */
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;



const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    /*step2:使用rotate動畫效果在svg圖示上*/
    animation:rotate infinite 1.5s linear;
    /*step3:isLoading的時候才套用旋轉效果*/
    animation-duration: ${({isLoading}) => isLoading ? "1.5s" : "0s"};
  }
  /*step1:定義旋轉的動畫效果，並取名為 rotate*/
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const AUTHORIZATION_KEY = "CWA-2C920AEA-FEE7-4B61-83F6-A8CA57191D05";
//step3.把上面定義好的styled-component 當成元件使用
const STATION_NAME = "臺北";
function App() {
  console.log("invoke function component"); //元件一開始加入console.log
  const [currentTheme, setCurrentTheme] = useState("light");

  const [weatherElement, setWeatherElement] = useState({
    locationName: "",
    description: "",
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    comfortability:'',
    weatherCode: 0,
    isLoading:true,
  });

  useEffect(() => {
    //useEffect中console.log
    console.log("execute function in useEffect");
    fetchCurrentWeather()
    fetchWeatherForecast()
  },[]);
  const LOCATION_NAME_FORECAST='臺北市'
  const fetchWeatherForecast = () => {
    return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`

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

      setWeatherElement((prevState)=>(
        {
          ...prevState,
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
         
        })
      )
    })
  };

  const fetchCurrentWeather = () => {
    setWeatherElement((prevState) => ({ ...prevState, isLoading: true }));
    // 這邊直接家用fetch api回傳的Promise再傳出去
    // return fetch()
    return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&StationName=${STATION_NAME}`
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("data", data);
        const stationData = data.records.Station[0];
        // console.log(stationData);
        // const weatherElements = stationData.WeatherElement.reduce(
        //   (neededElements, item) => {
        //     if (["WindSpeed", "AirTemperature"].includes(item.elementName)) {
        //       neededElements[item.elementName] = item.elementValue;
        //     }
        //     return neededElements;
        //   }
        // );
        // console.log(weatherElements);

        setWeatherElement((prevState)=>({
          ...prevState,
          observationTime: stationData.ObsTime.DateTime,
          locationName: stationData.StationName,
          temperature: stationData.WeatherElement.AirTemperature, //weatherElements.AirTemperature,
          windSpeed: stationData.WeatherElement.WindSpeed, //weatherElements.WindSpeed,
          // description: "多雲時晴",
          // rainPossibility: 60,
          isLoading:false,//拉取資料完Loading=false
        }));
      });
  };
	//使用解構賦值
	//observationTime=currentWetather.observationTime......
  const {
    observationTime,
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    isLoading,
    comfortability,
  } = weatherElement;
  return (
    //stepII.把所有會用到主題配色的部分都包在ThemeProvider裡並透過theme這個props來設定主題
    <ThemeProvider theme={theme[currentTheme]}>
      {/*stepIII.把原本寫在Container內的props移除*/}
      <Container>
        {/* JSX中加入console.log */}
        {console.log("render, isLoading: ",isLoading)}
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>{description}{comfortability}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)}
              <Celsius>°C</Celsius>
            </Temperature>
            <DayCloudyIcon />
            {/*2.使用該元件*/}
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon />
            {windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon />
            {rainPossibility}%
          </Rain>
          <Refresh onClick={()=>{
            fetchCurrentWeather();
            fetchWeatherForecast();
            }} 
            isLoading={isLoading}>
            最後觀測時間:
            {new Intl.DateTimeFormat("zh-TW", {
              hour: "numeric",
              minute: "numeric",
            }).format(dayjs(observationTime))}{" "}
            {isLoading?<LoadingIcon/>:<RefreshIcon/>}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
