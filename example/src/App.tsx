import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { DiscussionPage } from './components/DiscusssionPage';

function App() {
  return (
    <Router>
      <Route path="/discussion/:table_name/:row" component={DiscussionPage} />
    </Router>
  );
}

export default App;
