import { useState } from 'react'
import './App.css'
import { Search } from 'lucide-react'

interface WeatherData {
  city: string
  temperature: number
  description: string
  icon: string
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  disabled: boolean
}

interface WeatherDisplayProps {
  weatherData: WeatherData | null
}

function SearchBar({ value, onChange, onSearch, disabled }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <input
        type="text"
        placeholder="都市名を入力"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !disabled) {
            onSearch()
          }
        }}
      />
      <button
        onClick={onSearch}
        disabled={disabled}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
      >
        <Search size={16} />
        検索
      </button>
    </div>
  )
}

function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
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
      </div>
    </div>
  )
}

function App() {
  const [cityInput, setCityInput] = useState('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  const handleSearch = () => {
    if (cityInput.trim()) {
      const dummyWeatherData: WeatherData = {
        city: cityInput.trim(),
        temperature: Math.floor(Math.random() * 30) + 5,
        description: ['晴れ', '曇り', '雨', '雪', '霧'][Math.floor(Math.random() * 5)],
        icon: `https://openweathermap.org/img/wn/01d@2x.png`
      }
      setWeatherData(dummyWeatherData)
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
          />
        </div>

        <WeatherDisplay weatherData={weatherData} />
      </div>
    </div>
  )
}

export default App
