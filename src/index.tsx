// eslint-disable-next-line
import React from 'react'
import ReactDOM from 'react-dom'
import NotWordle from './NotWordle'
import { createTheme, ThemeProvider } from '@mui/material/styles'
// import reportWebVitals from './reportWebVitals'

const theme = createTheme()
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <NotWordle />
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
