import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  //Using BrowserRouter will get support of react router dom
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
