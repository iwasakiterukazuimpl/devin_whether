import { useState } from 'react'
import './App.css'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { useWeather } from './hooks/useWeather'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  disabled: boolean
  loading: boolean
}

interface WeatherDisplayProps {
  weatherData: {
    city: string
    temperature: number
    description: string
    icon: string
    humidity?: number
    windSpeed?: number
  } | null
  loading: boolean
  error: string | null
}

function SearchBar({ value, onChange, onSearch, disabled, loading }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <input
        type="text"
        placeholder="都市名を入力"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !disabled && !loading) {
            onSearch()
          }
        }}
        disabled={loading}
      />
      <button
        onClick={onSearch}
        disabled={disabled || loading}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 justify-center min-w-[100px]"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Search size={16} />
        )}
        {loading ? '検索中...' : '検索'}
      </button>
    </div>
  )
}

function WeatherDisplay({ weatherData, loading, error }: WeatherDisplayProps) {
  if (loading) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
        <Loader2 size={32} className="animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-gray-600 text-lg">天気情報を取得中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 rounded-lg text-center border border-red-200">
        <AlertCircle size={32} className="mx-auto mb-4 text-red-500" />
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 text-lg">都市が未選択です</p>
      </div>
    )
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{weatherData.city}</h2>
        <img
          src={weatherData.icon}
          alt={weatherData.description}
          className="w-16 h-16"
        />
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-semibold text-blue-600">
          {weatherData.temperature}°C
        </p>
        <p className="text-lg text-gray-600 capitalize">
          {weatherData.description}
        </p>
        {weatherData.humidity && (
          <p className="text-sm text-gray-500">
            湿度: {weatherData.humidity}%
          </p>
        )}
        {weatherData.windSpeed && (
          <p className="text-sm text-gray-500">
            風速: {weatherData.windSpeed} m/s
          </p>
        )}
      </div>
    </div>
  )
}

function App() {
  const [cityInput, setCityInput] = useState('')
  const { weatherData, loading, error, fetchWeather } = useWeather()

  const handleSearch = async () => {
    if (cityInput.trim()) {
      await fetchWeather(cityInput.trim())
    }
  }

  const isSearchDisabled = cityInput.trim() === ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">天気予報アプリ</h1>
          <p className="text-gray-600">都市名を入力して天気情報を確認しましょう</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <SearchBar
            value={cityInput}
            onChange={setCityInput}
            onSearch={handleSearch}
            disabled={isSearchDisabled}
            loading={loading}
          />
        </div>

        <WeatherDisplay weatherData={weatherData} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default App
