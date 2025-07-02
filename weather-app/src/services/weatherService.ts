interface OpenWeatherMapResponse {
  name: string;
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

export class WeatherAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'WeatherAPIError';
  }
}

export async function fetchWeather(cityName: string): Promise<WeatherData> {
  const apiKey = process.env.REACT_APP_API_KEY;
  
  if (!apiKey) {
    throw new WeatherAPIError('APIキーが設定されていません。環境変数REACT_APP_API_KEYを確認してください。');
  }

  if (!cityName.trim()) {
    throw new WeatherAPIError('都市名を入力してください。');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName.trim())}&appid=${apiKey}&units=metric&lang=ja`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new WeatherAPIError(`都市「${cityName}」が見つかりません。都市名を確認してください。`, 404);
      } else if (response.status === 401) {
        throw new WeatherAPIError('APIキーが無効です。設定を確認してください。', 401);
      } else {
        throw new WeatherAPIError(`天気情報の取得に失敗しました。(エラーコード: ${response.status})`, response.status);
      }
    }

    const data: OpenWeatherMapResponse = await response.json();
    
    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new WeatherAPIError('ネットワークエラーが発生しました。インターネット接続を確認してください。');
    }
    
    throw new WeatherAPIError('予期しないエラーが発生しました。しばらく時間をおいて再度お試しください。');
  }
}
