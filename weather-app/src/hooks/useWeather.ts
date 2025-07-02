import { useState } from 'react'

interface WeatherData {
  city: string
  temperature: number
  description: string
  icon: string
  humidity?: number
  windSpeed?: number
}

interface OpenWeatherResponse {
  name: string
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
}

interface UseWeatherReturn {
  weatherData: WeatherData | null
  loading: boolean
  error: string | null
  fetchWeather: (city: string) => Promise<void>
}

export function useWeather(): UseWeatherReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (city: string): Promise<void> => {
    if (!city.trim()) {
      setError('都市名を入力してください')
      return
    }

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    if (!apiKey || apiKey === 'your_api_key_here') {
      setError('APIキーが設定されていません')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric&lang=ja`
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('都市が見つかりませんでした')
        } else if (response.status === 401) {
          throw new Error('APIキーが無効です')
        } else {
          throw new Error('天気情報の取得に失敗しました')
        }
      }

      const data: OpenWeatherResponse = await response.json()

      const transformedData: WeatherData = {
        city: data.name,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      }

      setWeatherData(transformedData)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('ネットワークエラーが発生しました')
      }
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  return {
    weatherData,
    loading,
    error,
    fetchWeather
  }
}
