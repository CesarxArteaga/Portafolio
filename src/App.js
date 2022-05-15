import './App.css';
import Home from './components/Home';
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
              <h1>This is a abuot</h1>
            </Route>
            <Route path="/dashboard">
              <h1>Thios is Home</h1>
            </Route>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
