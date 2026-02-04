import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Syncfusion Global Styles
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-grids/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import '@syncfusion/ej2-react-kanban/styles/material.css';
import '@syncfusion/ej2-react-gantt/styles/material.css';
import '@syncfusion/ej2-react-calendars/styles/material.css';
import '@syncfusion/ej2-react-buttons/styles/material.css';
import '@syncfusion/ej2-react-layouts/styles/material.css';



// Registering Syncfusion license key
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('NjgxMjYxQDMyMzAyZTM0MmUzMFRHSmhKOGI1VytzWExYVjhvTkh3N3ZSQmZqZ3ZqTmhqV3p3bXp3em89');


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
