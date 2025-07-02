interface OpenWeatherMapResponse {
  name: string;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

export async function fetchWeather(cityName: string): Promise<WeatherData> {
  const apiKey = import.meta.env.REACT_APP_API_KEY;
  
  if (!apiKey) {
    throw new Error('APIキーが設定されていません');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('都市が見つかりません');
      }
      throw new Error('天気情報の取得に失敗しました');
    }

    const data: OpenWeatherMapResponse = await response.json();
    
    if (!data.name || !data.main || !data.weather || data.weather.length === 0) {
      throw new Error('無効な天気データです');
    }

    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('天気情報の取得中にエラーが発生しました');
  }
}
