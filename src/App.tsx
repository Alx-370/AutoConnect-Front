import { RouterProvider } from 'react-router';
import './App.css'
import router from "./routers/Router.tsx";




const App =() => {
  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}

export default App
