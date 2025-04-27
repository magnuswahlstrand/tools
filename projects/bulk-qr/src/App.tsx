import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import './App.css'

interface QRSettings {
  size: number
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  dark: string
  light: string
}

function App() {
  const [input, setInput] = useState('')
  const [settings, setSettings] = useState<QRSettings>({
    size: 200,
    errorCorrectionLevel: 'M',
    dark: '#000000',
    light: '#ffffff'
  })

  const generateQRCode = useCallback(async (text: string) => {
    try {
      return await QRCode.toDataURL(text, {
        width: settings.size,
        errorCorrectionLevel: settings.errorCorrectionLevel,
        color: {
          dark: settings.dark,
          light: settings.light
        }
      })
    } catch (err) {
      console.error('Error generating QR code:', err)
      return null
    }
  }, [settings])

  const handleDownloadAll = async () => {
    const lines = input.split('\n').filter((line: string) => line.trim())
    if (lines.length > 20) {
      alert('Maximum 20 QR codes allowed')
      return
    }

    const zip = new JSZip()
    for (let i = 0; i < lines.length; i++) {
      const dataUrl = await generateQRCode(lines[i])
      if (dataUrl) {
        const data = dataUrl.split(',')[1]
        zip.file(`qr-${i + 1}.png`, data, { base64: true })
      }
    }

    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-codes.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  const qrCodes = input
    .split('\n')
    .filter((line: string) => line.trim())
    .slice(0, 20)

  return (
    <div className="container">
      <h1 className="title">
        <span className="desktop-title">Bulk QR Code Generator</span>
        <span className="mobile-title">QR Generator</span>
      </h1>
      
      <div className="settings">
        <div className="setting">
          <label htmlFor="size">Size:</label>
          <input
            id="size"
            type="number"
            min="100"
            max="1000"
            value={settings.size}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings(s => ({ ...s, size: +e.target.value }))}
          />
        </div>
        
        <div className="setting">
          <label htmlFor="correction">Error:</label>
          <select
            id="correction"
            value={settings.errorCorrectionLevel}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSettings(s => ({ ...s, errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' }))}
          >
            <option value="L">Low</option>
            <option value="M">Med</option>
            <option value="Q">High</option>
            <option value="H">Max</option>
          </select>
        </div>

        <div className="setting">
          <label htmlFor="dark">Color:</label>
          <div className="color-preview">
            <input
              id="dark"
              type="color"
              value={settings.dark}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings(s => ({ ...s, dark: e.target.value }))}
            />
            <span>{settings.dark}</span>
          </div>
        </div>

        <div className="setting">
          <label htmlFor="light">BG:</label>
          <div className="color-preview">
            <input
              id="light"
              type="color"
              value={settings.light}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings(s => ({ ...s, light: e.target.value }))}
            />
            <span>{settings.light}</span>
          </div>
        </div>
      </div>

      <div className="input-section">
        <textarea
          placeholder="Enter text (one per line, max 20 lines)"
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          rows={Math.min(10, Math.max(4, input.split('\n').length + 1))}
        />
      </div>

      <div className="qr-preview">
        {qrCodes.map((text: string, i: number) => (
          <QRPreview key={i} text={text} generateQRCode={generateQRCode} />
        ))}
      </div>

      {qrCodes.length > 0 && (
        <button onClick={handleDownloadAll} className="download-all">
          Download All ({qrCodes.length})
        </button>
      )}
    </div>
  )
}

function QRPreview({ text, generateQRCode }: { text: string; generateQRCode: (text: string) => Promise<string | null> }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    generateQRCode(text).then(setDataUrl)
  }, [text, generateQRCode])

  if (!dataUrl) return null

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `qr-${text.substring(0, 20)}.png`
    a.click()
  }

  return (
    <div className="qr-item">
      <img src={dataUrl} alt={`QR code for ${text}`} />
      <div className="qr-text-row">
        <div className="qr-text">{text}</div>
        <button onClick={handleDownload} className="download-icon" title="Download QR Code">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default App
