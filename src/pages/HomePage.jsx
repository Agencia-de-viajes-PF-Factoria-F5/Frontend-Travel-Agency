import { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Search, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import DestinationCard from '../components/common/DestinationCard'
import { travelService } from '../services/TravelsService'
import { PUBLIC_PATHS } from '../constants/paths'

const HomePage = () => {
  const [travels, setTravels] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({ destiny: '', startDate: '', endDate: '', passengers: 2 })
  const navigate = useNavigate()

  useEffect(() => {
    travelService.getAvailable()
      .then(data => setTravels(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.destiny) params.set('destiny', search.destiny)
    if (search.startDate) params.set('startDate', search.startDate)
    if (search.endDate) params.set('endDate', search.endDate)
    if (search.passengers) params.set('passengers', search.passengers)
    navigate(`${PUBLIC_PATHS.SEARCH}?${params.toString()}`)
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,31,63,0.4),_transparent_65%)]"
        />
        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-[1.3fr_0.7fr] lg:py-28">
          <div className="flex flex-col justify-center gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-300">
              Viajes seleccionados · 2026
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
              Siempre en el lugar exacto
            </h1>
            <div className="flex flex-wrap gap-3">
              <Button to={PUBLIC_PATHS.SEARCH} size="lg">
                Explorar destinos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button to={PUBLIC_PATHS.OFFERS} size="lg" variant="secondary">
                Ver ofertas
              </Button>
            </div>
          </div>

          <Card className="p-7 ml-auto w-full max-w-[360px]">
            <h2 className="text-lg font-semibold text-white mb-6">¿A dónde vas?</h2>
            <form onSubmit={handleSearch} className="grid gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-brand-400">Destino</span>
                <span className="flex items-center gap-2 rounded-xl border border-surface-600 bg-surface-900 px-4 h-11">
                  <MapPin className="h-4 w-4 text-brand-400 shrink-0" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="¿A dónde?"
                    value={search.destiny}
                    onChange={e => setSearch(s => ({ ...s, destiny: e.target.value }))}
                    className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </span>
              </label>

              <div className="grid gap-3 grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-widest text-brand-400">Salida</span>
                  <span className="flex items-center rounded-xl border border-surface-600 bg-surface-900 px-3 h-11">
                    <input
                      type="date"
                      value={search.startDate}
                      onChange={e => setSearch(s => ({ ...s, startDate: e.target.value }))}
                      style={{ colorScheme: 'dark', border: 'none', outline: 'none', background: 'transparent', color: 'inherit', width: '100%', fontSize: '12px' }}
                    />
                  </span>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-widest text-brand-400">Vuelta</span>
                  <span className="flex items-center rounded-xl border border-surface-600 bg-surface-900 px-3 h-11">
                    <input
                      type="date"
                      value={search.endDate}
                      onChange={e => setSearch(s => ({ ...s, endDate: e.target.value }))}
                      style={{ colorScheme: 'dark', border: 'none', outline: 'none', background: 'transparent', color: 'inherit', width: '100%', fontSize: '12px' }}
                    />
                  </span>
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-brand-400">Viajeros</span>
                <span className="flex items-center justify-between rounded-xl border border-surface-600 bg-surface-900 px-3 h-11">
                  <Users className="h-4 w-4 text-brand-400" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => setSearch(s => ({ ...s, passengers: Math.max(1, s.passengers - 1) }))}
                    className="text-[#4A8FA8] font-bold text-xl px-2"
                  >−</button>
                  <span className="text-center text-ink text-sm flex-1">{search.passengers}</span>
                  <button
                    type="button"
                    onClick={() => setSearch(s => ({ ...s, passengers: Math.min(20, s.passengers + 1) }))}
                    className="text-[#4A8FA8] font-bold text-xl px-2"
                  >+</button>
                </span>
              </label>

              <Button type="submit" size="md" fullWidth>
                <Search className="h-4 w-4" aria-hidden="true" />
                Buscar
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-white">Destinos destacados</h2>
            <p className="mt-2 text-ink-muted">Viajes disponibles, los favoritos de nuestros viajeros</p>
          </div>
          <Button to={PUBLIC_PATHS.SEARCH} variant="ghost">
            Ver todos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-surface-800" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {travels.slice(0, 6).map(travel => (
              <DestinationCard key={travel.id} destination={travel} featured />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default HomePage