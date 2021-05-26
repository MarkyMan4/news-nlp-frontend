import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import 'animate.css/animate.css';
import Login from './pages/login';
import Home from './pages/home';
import SavedArticles from './pages/savedArticles';
import Register from './pages/register';
import Articles from './pages/articles';
import ArticleDetail from './pages/articleDetail';
import NotFound from './components/notFound';
import Nav from './components/nav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/articles/:pageNum" component={Articles} />
        <Route path="/savedarticles" component={SavedArticles} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/article/:id" component={ArticleDetail} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
