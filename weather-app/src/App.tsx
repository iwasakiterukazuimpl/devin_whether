import { useState } from 'react'
import './App.css'
import { Search } from 'lucide-react'

interface 天気データ {
  都市: string
  気温: number
  説明: string
  アイコン: string
}

interface 検索バープロパティ {
  値: string
  変更時: (値: string) => void
  検索時: () => void
  無効: boolean
}

interface 天気表示プロパティ {
  天気データ: 天気データ | null
}

function 検索バー({ 値, 変更時, 検索時, 無効 }: 検索バープロパティ) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <input
        type="text"
        placeholder="都市名を入力"
        value={値}
        onChange={(e) => 変更時(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !無効) {
            検索時()
          }
        }}
      />
      <button
        onClick={検索時}
        disabled={無効}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
      >
        <Search size={16} />
        検索
      </button>
    </div>
  )
}

function 天気表示({ 天気データ }: 天気表示プロパティ) {
  if (!天気データ) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 text-lg">都市が未選択です</p>
      </div>
    )
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{天気データ.都市}</h2>
        <img
          src={天気データ.アイコン}
          alt={天気データ.説明}
          className="w-16 h-16"
        />
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-semibold text-blue-600">
          {天気データ.気温}°C
        </p>
        <p className="text-lg text-gray-600 capitalize">
          {天気データ.説明}
        </p>
      </div>
    </div>
  )
}

function App() {
  const [都市入力, set都市入力] = useState('')
  const [天気データ, set天気データ] = useState<天気データ | null>(null)

  const 検索処理 = () => {
    if (都市入力.trim()) {
      const ダミー天気データ: 天気データ = {
        都市: 都市入力.trim(),
        気温: Math.floor(Math.random() * 30) + 5,
        説明: ['晴れ', '曇り', '雨', '雪', '霧'][Math.floor(Math.random() * 5)],
        アイコン: `https://openweathermap.org/img/wn/01d@2x.png`
      }
      set天気データ(ダミー天気データ)
    }
  }

  const 検索無効 = 都市入力.trim() === ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">天気予報アプリ</h1>
          <p className="text-gray-600">都市名を入力して天気情報を確認しましょう</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <検索バー
            値={都市入力}
            変更時={set都市入力}
            検索時={検索処理}
            無効={検索無効}
          />
        </div>

        <天気表示 天気データ={天気データ} />
      </div>
    </div>
  )
}

export default App
