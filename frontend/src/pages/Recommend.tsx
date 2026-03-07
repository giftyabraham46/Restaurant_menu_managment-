import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Loader2, IndianRupee, Star, ShieldCheck, Utensils } from 'lucide-react'

interface ComboItem {
    items: string[]
    total_price: number
    average_rating: number
    score: number
    categories: string[]
    budget_usage: number
}

interface Restaurant {
    restaurant_id: number
    name: string
    cuisines: string
}

export default function Recommend() {
    const { id } = useParams()
    const [budget, setBudget] = useState('')
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
    const [recommendations, setRecommendations] = useState<ComboItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch(`http://localhost:8008/api/restaurants/${id}`)
            .then(res => res.json())
            .then(data => setRestaurant(data))
            .catch(err => console.error(err))
    }, [id])

    const handleRecommend = async () => {
        if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
            setError("Please enter a valid budget.")
            return
        }

        setError('')
        setLoading(true)
        setRecommendations([])

        try {
            const res = await fetch(`http://localhost:8008/api/restaurants/${id}/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ budget: Number(budget) })
            })

            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setRecommendations(data.recommendations)
        } catch (err) {
            setError("Could not retrieve recommendations. Please verify the backend is running.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link to={`/restaurant/${id}`} className="inline-flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to {restaurant?.name || 'Restaurant'}
            </Link>

            <div className="text-center py-6">
                <h1 className="text-3xl font-extrabold text-slate-900">
                    Optimizer for <span className="text-primary-600">{restaurant?.name}</span>
                </h1>
                <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
                    Enter your total budget. We'll generate the top combinations ensuring maximum value, highest average ratings, and a balanced meal structure.
                </p>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 max-w-xl mx-auto backdrop-blur-xl">
                <label htmlFor="budget" className="block text-sm font-bold text-slate-700 mb-2">
                    Your Local Currency Budget
                </label>
                <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <IndianRupee className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                        type="number"
                        name="budget"
                        id="budget"
                        className="block w-full pl-12 pr-12 py-4 border-slate-200 rounded-2xl focus:ring-primary-500 focus:border-primary-500 sm:text-lg border bg-slate-50 transition-colors hover:bg-white"
                        placeholder="e.g. 1000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                        <button
                            onClick={handleRecommend}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95 group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-1" /> : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                    Optimize
                                </>
                            )}
                        </button>
                    </div>
                </div>
                {error && <p className="mt-4 text-sm text-red-500 font-bold bg-red-50 p-3 rounded-lg flex items-center"><ShieldCheck className="w-4 h-4 mr-2" />{error}</p>}
            </div>

            {/* Results Section */}
            {recommendations.length > 0 && (
                <div className="space-y-6 pt-8 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Optimal Recommendations</h2>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-50 text-green-700 border border-green-200 uppercase tracking-widest shrink-0">
                            Top 3 matches
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.map((combo, index) => (
                            <div key={index} className="relative flex flex-col bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                                <div className={`absolute top-0 right-0 w-20 h-20 flex items-start justify-end p-4 ${index === 0 ? 'bg-gradient-to-bl from-yellow-400 to-amber-500' : index === 1 ? 'bg-gradient-to-bl from-slate-300 to-slate-400' : 'bg-gradient-to-bl from-amber-700 to-amber-800'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 50%)' }}>
                                    <span className="font-extrabold text-white text-xl leading-none absolute top-4 right-4">#{index + 1}</span>
                                </div>

                                <div className="p-8 flex-grow">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 pr-12 line-clamp-1 border-b border-dashed border-slate-200 pb-2">Combo Contains</h3>
                                    <ul className="space-y-3 mb-8">
                                        {combo.items.map((item, idx) => (
                                            <li key={idx} className="flex items-center text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                                                <span className="w-2 h-2 rounded-full bg-primary-400 mr-3 shrink-0"></span>
                                                <span className="truncate">{item}</span>
                                                <span className="ml-auto text-xs text-slate-400 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-100 uppercase tracking-wider">{combo.categories[idx]}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto space-y-5 pt-6 border-t border-slate-100">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Total Price</p>
                                                <p className="text-3xl font-black flex items-center text-slate-900">
                                                    <IndianRupee className="w-6 h-6 mr-0.5 text-primary-500" />
                                                    {combo.total_price.toFixed(0)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Avg Rating</p>
                                                <p className="text-xl font-bold flex items-center justify-end text-amber-500">
                                                    {combo.average_rating.toFixed(1)}
                                                    <Star className="w-5 h-5 ml-1 fill-current" />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 flex items-center justify-between border-t border-slate-100">
                                    <div className="flex items-center">
                                        <span className="text-sm font-bold text-slate-500 mr-2">Algorithm Score:</span>
                                        <span className="bg-white px-3 py-1 rounded-full text-sm font-black text-primary-600 border border-primary-100 shadow-sm">{combo.score.toFixed(2)}</span>
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
                                        {combo.budget_usage.toFixed(0)}% Budget Used
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && recommendations.length === 0 && !error && budget && (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-4 border border-slate-100">
                        <Utensils className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No combos fit the rules</h3>
                    <p className="mt-2 text-slate-500 max-w-sm mx-auto">Your budget might be too low, or you need to relax the combo rules. Try a higher budget!</p>
                </div>
            )}
        </div>
    )
}
