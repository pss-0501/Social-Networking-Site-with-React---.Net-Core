import React from 'react'
import ReactDOM from 'react-dom/client'
import './app/layout/styles.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-calendar/dist/Calendar.css'
import { store, StoreContext } from './app/stores/store'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/Routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      {/* <App /> */}
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </React.StrictMode>,
)
