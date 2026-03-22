package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "Thiên Mộng Studio",
		Width:  1024,
		Height: 768,

		// 1. QUAN TRỌNG: Bật chế độ không khung
		Frameless: true,

		// 2. QUAN TRỌNG: Để Alpha = 0 (Trong suốt nền App)
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 0},

		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			// 3. Ép Webview và Window trong suốt để thấy hiệu ứng Mica
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			BackdropType:         windows.Mica,
			Theme:                windows.SystemDefault,
		},
		OnStartup: app.startup,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
