import './App.css';
import Home from './Components/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


function App() {

  return (
    <Router>
      
      <div className="App">

          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/about">
              {/* <About /> */}
              <h1>This is a abuot</h1>
            </Route>
            <Route path="/dashboard">
              {/* <Dashboard /> */}
              <h1>Thios is Home</h1>
            </Route>
          </Switch>
          
          {/* <div class="wrapper">
            <div class="hero">
              <h1 class="hero__heading">César Arteaga</h1>
            </div>

            <div class="hero hero--secondary" aria-hidden="true" data-hero>
              <p class="hero__heading">César Arteaga</p>
            </div>
          </div> */}
        
      </div>
    </Router>
  );
}

export default App;
