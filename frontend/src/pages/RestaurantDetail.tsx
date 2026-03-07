import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Star, Utensils, IndianRupee, ArrowLeft, ArrowRight } from 'lucide-react'

interface Restaurant {
    restaurant_id: number
    name: string
    city: string
    locality: string
    address: string
    cuisines: string
    rating: number
    votes: number
    avg_cost_for_two: number
}

export default function RestaurantDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

    useEffect(() => {
        fetch(`http://localhost:8008/api/restaurants/${id}`)
            .then(res => res.json())
            .then(data => setRestaurant(data))
            .catch(err => console.error(err))
    }, [id])

    if (!restaurant) {
        return (
            <div className="flex justify-center items-center py-40">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link to="/" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
            </Link>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 relative">
                <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-400"></div>
                <div className="px-8 pb-10">
                    <div className="relative -mt-16 sm:-mt-20 sm:flex sm:items-end sm:space-x-5">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white p-2 shadow-xl shrink-0">
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-2xl text-primary-200">
                                <Utensils className="w-16 h-16" />
                            </div>
                        </div>
                        <div className="mt-6 sm:mt-16 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                            <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                                <h1 className="text-3xl font-extrabold text-slate-900 truncate">{restaurant.name}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 hidden sm:block 2xl:hidden min-w-0 flex-1">
                        <h1 className="text-4xl font-extrabold text-slate-900 sm:truncate">{restaurant.name}</h1>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-start text-slate-600 text-lg">
                                    <Utensils className="w-6 h-6 mr-3 text-primary-500 shrink-0 mt-0.5" />
                                    <span>{restaurant.cuisines}</span>
                                </div>
                                <div className="flex items-start text-slate-600 text-lg">
                                    <MapPin className="w-6 h-6 mr-3 text-primary-500 shrink-0 mt-0.5" />
                                    <span>{restaurant.address}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 flex-1 flex flex-col">
                                    <span className="text-sm font-medium text-slate-500">Rating</span>
                                    <span className="text-2xl font-black text-slate-900 flex items-center mt-1">
                                        {restaurant.rating} <Star className="w-5 h-5 ml-1 text-yellow-500 fill-yellow-500" />
                                    </span>
                                    <span className="text-xs text-slate-400 mt-1">{restaurant.votes} votes</span>
                                </div>
                                <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 flex-1 flex flex-col">
                                    <span className="text-sm font-medium text-slate-500">Avg Cost (2)</span>
                                    <span className="text-2xl font-black text-slate-900 flex items-center mt-1">
                                        <IndianRupee className="w-5 h-5 text-slate-400 mr-0.5" />
                                        {restaurant.avg_cost_for_two}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary-50 rounded-3xl p-8 border border-primary-100 flex flex-col justify-center max-w-sm">
                            <h3 className="text-xl font-bold text-primary-900 mb-2">Smart Menu Recommendations</h3>
                            <p className="text-primary-700 mb-6">Let us find the optimal combination of items based on your exact budget and our smart algorithms.</p>
                            <button
                                onClick={() => navigate(`/restaurant/${id}/recommend`)}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center group"
                            >
                                View Recommendations
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
