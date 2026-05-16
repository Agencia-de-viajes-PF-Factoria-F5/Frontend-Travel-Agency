import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, MapPin } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import DestinationCard from '../components/common/DestinationCard'
import PageHeader from '../components/ui/PageHeader'
import { travelService } from '../services/TravelsService'

const SearchResultsPage = () => {
  const [searchParams]          = useSearchParams()
  const [travels, setTravels]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [onlyOffers, setOnlyOffers] = useState(false)
  const [search, setSearch]     = useState(searchParams.get('destiny') ?? '')

  const startDateParam = searchParams.get('startDate') ?? ''
  const endDateParam   = searchParams.get('endDate') ?? ''

  useEffect(() => {
    travelService.getAvailable()
      .then(data => setTravels(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = travels.filter(t => {
    const matchDestiny = !search ||
      t.destiny?.toLowerCase().includes(search.toLowerCase()) ||
      t.hotelCity?.toLowerCase().includes(search.toLowerCase())

    const matchOffer = onlyOffers ? t.sale === true : true

    const matchStartDate = !startDateParam ||
      new Date(t.startDate) >= new Date(startDateParam)

    const matchEndDate = !endDateParam ||
      new Date(t.endDate) <= new Date(endDateParam)

    return matchDestiny && matchOffer && matchStartDate && matchEndDate
  })

  return (
    <div className="container-page py-12">
      <PageHeader
        eyebrow="Búsqueda"
        title="Viajes disponibles"
        description={`${filtered.length} destinos encontrados`}
        actions={
          <Button variant="secondary" size="md">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Ordenar
          </Button>
        }
      />

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">

        <Card as="aside" aria-label="Filtros" className="h-fit p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Filtros
          </h2>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Destino</p>
            <div className="flex items-center gap-2 rounded-xl border border-surface-600 bg-surface-900 px-3">
              <MapPin className="h-4 w-4 text-brand-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Buscar destino..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-10 w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
              />
            </div>
          </div>

          {startDateParam && (
            <div className="mt-4 rounded-lg bg-surface-800 p-3 text-xs text-ink-muted">
              📅 Salida desde: <span className="text-white">{startDateParam}</span>
              {endDateParam && <> · Vuelta hasta: <span className="text-white">{endDateParam}</span></>}
            </div>
          )}

          <div className="mt-6 border-t border-surface-700 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyOffers}
                onChange={e => setOnlyOffers(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm text-ink-soft">Solo viajes en oferta</span>
            </label>
          </div>

          <Button
            variant="ghost"
            size="sm"
            fullWidth
            className="mt-6"
            onClick={() => { setSearch(''); setOnlyOffers(false) }}
          >
            Limpiar filtros
          </Button>
        </Card>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-surface-800" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <MapPin className="h-10 w-10 text-brand-400" />
            <p className="text-lg font-semibold text-white">Sin resultados</p>
            <p className="text-sm text-ink-muted">Prueba con otro destino o quita los filtros</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(travel => (
              <DestinationCard key={travel.id} destination={travel} featured />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default SearchResultsPage