import React from "react";
import logo from "./logo.svg";
import { useState, useEffect,useCallback,useMemo } from "react";
//1.使用import {ReactComponent as XX} from XXX 引入svg
import WeatherCard from "./views/WeatherCard";
// import './App.css';
import styled from "@emotion/styled"; //step1.載入emotion套件
import { ThemeProvider } from "@emotion/react"; //stepI.從＠emotion/react引入ThemeProvider
import {getMoment} from "./utils/helpers";
import useWeatherAPI from "./hooks/useWeatherAPI";
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



const AUTHORIZATION_KEY = "CWA-2C920AEA-FEE7-4B61-83F6-A8CA57191D05";
//step3.把上面定義好的styled-component 當成元件使用
const STATION_NAME = "臺北";
const LOCATION_NAME_FORECAST='臺北市'



const App = () => {
  console.log('--- invoke function component ---');
  const [currentTheme, setCurrentTheme] = useState('light');
  const [weatherElement, fetchData] = useWeatherAPI({
    stationName:STATION_NAME,
    cityName:LOCATION_NAME_FORECAST,
    authorizationkey:AUTHORIZATION_KEY,
});
  const toggleTheme = useCallback(() => {
    setCurrentTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }, []);

  const moment = useMemo(()=>getMoment(LOCATION_NAME_FORECAST),[]);

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);


  

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
       
      <WeatherCard weatherElement={weatherElement} moment={moment} fetchData={fetchData}/>
      </Container>
    </ThemeProvider>
  );
};

export default App;