import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Landing from './components/Landing'
import ChatBot from './components/ChatBot';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/chat' element={<ChatBot />} />
      </Routes>
    </Router>
  )
}

export default App
