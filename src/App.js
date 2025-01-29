
import './App.css';
import Home from './componente/home';
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from './componente/login';
import ProtectedRoute from './componente/rutaProtegida';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
           <Route path='/' element={<Login />}></Route>

           <Route path='/home' element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
