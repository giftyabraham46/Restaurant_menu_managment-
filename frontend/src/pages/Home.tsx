import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Utensils, IndianRupee } from 'lucide-react'

interface Restaurant {
    restaurant_id: number
    name: string
    city: string
    locality: string
    cuisines: string
    rating: number
    votes: number
    avg_cost_for_two: number
    price_range: number
}

export default function Home() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [filters, setFilters] = useState({ city: '', cuisine: '', minRating: '' })
    const [availableCities, setAvailableCities] = useState<string[]>([])
    const [availableCuisines, setAvailableCuisines] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch('http://localhost:8008/api/restaurants/filters')
            .then(res => res.json())
            .then(data => {
                setAvailableCities(data.cities)
                setAvailableCuisines(data.cuisines)
            })
            .catch(err => console.error("Could not load filters", err))

        handleSearch()
    }, [])

    const handleSearch = async () => {
        setLoading(true)
        try {
            let url = 'http://localhost:8008/api/restaurants?limit=24'
            if (filters.city) url += `&city=${encodeURIComponent(filters.city)}`
            if (filters.cuisine) url += `&cuisine=${encodeURIComponent(filters.cuisine)}`
            if (filters.minRating) url += `&min_rating=${filters.minRating}`

            const res = await fetch(url)
            const data = await res.json()
            setRestaurants(data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Hero Search Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Utensils className="w-64 h-64 text-primary-900" />
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Find the Best Places to Eat, <span className="text-primary-600">Globally</span>.
                </h1>
                <p className="text-lg text-slate-500 mb-8 max-w-2xl">
                    Discover top-rated restaurants, explore their cuisines, and automatically generate budget-optimized menus just for you.
                </p>

                <div className="flex flex-col md:flex-row gap-4 relative z-10 w-full md:w-5/6">
                    <div className="flex-1">
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-700 font-medium"
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        >
                            <option value="">Any City...</option>
                            {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-700 font-medium"
                            value={filters.cuisine}
                            onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
                        >
                            <option value="">Any Cuisine...</option>
                            {availableCuisines.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="w-full md:w-32">
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-700 font-medium"
                            value={filters.minRating}
                            onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                        >
                            <option value="">Rating</option>
                            <option value="4.5">4.5+</option>
                            <option value="4.0">4.0+</option>
                            <option value="3.5">3.5+</option>
                        </select>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center whitespace-nowrap"
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Search
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map(rest => (
                        <Link
                            to={`/restaurant/${rest.restaurant_id}`}
                            key={rest.restaurant_id}
                            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary-200 transition-all duration-300 flex flex-col"
                        >
                            <div className="p-6 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 pr-4">{rest.name}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-black text-white shrink-0 ${rest.rating >= 4.0 ? 'bg-green-500' : rest.rating >= 3.0 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                        {rest.rating.toFixed(1)} <Star className="w-3.5 h-3.5 ml-1 fill-current" />
                                    </span>
                                </div>

                                <div className="space-y-3 mt-auto">
                                    <p className="flex items-center text-slate-600 text-sm font-medium">
                                        <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                                        <span className="truncate">{rest.locality}, {rest.city}</span>
                                    </p>
                                    <p className="flex items-center text-slate-600 text-sm font-medium">
                                        <Utensils className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                                        <span className="truncate">{rest.cuisines}</span>
                                    </p>
                                    <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-700">
                                        <span className="flex items-center text-slate-500">
                                            Average Cost
                                        </span>
                                        <span className="text-lg">
                                            <IndianRupee className="w-4 h-4 inline text-slate-400" />{rest.avg_cost_for_two}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {restaurants.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            No restaurants found for these filters.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
