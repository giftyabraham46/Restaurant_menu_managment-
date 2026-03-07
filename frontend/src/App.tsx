import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RestaurantDetail from './pages/RestaurantDetail'
import Recommend from './pages/Recommend'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center cursor-pointer" onClick={() => window.location.href = '/'}>
                <span className="text-2xl font-black tracking-tighter text-slate-900 mr-2">Zomato<span className="text-primary-600">Global</span></span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/restaurant/:id/recommend" element={<Recommend />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
