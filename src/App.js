import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Login from './pages/login';
import Home from './pages/home';
import About from './pages/about';
import Register from './pages/register';
import Nav from './components/nav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  // if the user isn't logged in, show the login page, otherwise go to home page
  let pageToDisplay = (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </Router>
  );

  if(isUserAuthenticated()) {
    pageToDisplay = (
      <Router>
        <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Router>
    );
  }

  return (
    pageToDisplay
  );
}

/*
 * Check if user is logged in. Do some additional check instead of just checking if
 * they have any value for 'token'.
 */
const isUserAuthenticated = () => {
  if(localStorage.getItem('token') != null) {
    return true;
  }

  return false;
}

export default App;
