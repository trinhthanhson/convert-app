package service

import (
	"bytes"
	_ "embed" // Thư viện bắt buộc để nhúng file
	"encoding/base64"
	"fmt"
	"image/jpeg"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/gen2brain/go-fitz"
	"github.com/pdfcpu/pdfcpu/pkg/api"
)

// nhúng file engine.exe vào biến engineBytes (đảm bảo file nằm đúng thư mục bin)
//
//go:embed bin/engine.exe
var engineBytes []byte

// Cấu trúc kết quả trả về
type ProcessResult struct {
	Success    bool   `json:"success"`
	OutputPath string `json:"outputPath"`
	Error      string `json:"error"`
}

type PdfPagePreview struct {
	PageNumber int    `json:"pageNumber"`
	ImageData  string `json:"imageData"`
	Width      int    `json:"width"`
	Height     int    `json:"height"`
}

// runEngine: Hàm dùng chung để giải nén và chạy engine.exe
func runEngine(args ...string) ([]byte, error) {
	tempExe := filepath.Join(os.TempDir(), "thien_mong_engine_v2.exe")

	// CHỈ GHI FILE NẾU CHƯA TỒN TẠI (Tiết kiệm thời gian ghi đè)
	if _, err := os.Stat(tempExe); os.IsNotExist(err) {
		err = os.WriteFile(tempExe, engineBytes, 0755)
		if err != nil {
			return nil, fmt.Errorf("lỗi khởi tạo: %v", err)
		}
	}

	cmd := exec.Command(tempExe, args...)
	return cmd.CombinedOutput()
}

// --- CÁC HÀM XỬ LÝ CHÍNH ---

func ConvertPdfToDocx(inputPath string, outputPath string) ProcessResult {
	output, err := runEngine("pdf2word", inputPath, outputPath)
	if err != nil {
		return ProcessResult{Success: false, Error: string(output)}
	}
	return ProcessResult{Success: true, OutputPath: outputPath}
}

func ConvertDocxToPdf(inputPath string, outputPath string) ProcessResult {
	output, err := runEngine("word2pdf", inputPath, outputPath)
	if err != nil {
		return ProcessResult{Success: false, Error: string(output)}
	}
	return ProcessResult{Success: true, OutputPath: outputPath}
}

func MergePDFs(inputPaths []string, outputPath string) ProcessResult {
	// Dùng Go thuần, không gọi engine.exe nữa -> Tốc độ bàn thờ!
	err := api.MergeCreateFile(inputPaths, outputPath, false, nil)
	if err != nil {
		return ProcessResult{Success: false, Error: err.Error()}
	}
	return ProcessResult{Success: true, OutputPath: outputPath}
}

func GetPdfPagePreviews(inputPath string) ([]PdfPagePreview, error) {
	// 1. Mở file PDF bằng Fitz (MuPDF)
	doc, err := fitz.New(inputPath)
	if err != nil {
		return nil, fmt.Errorf("không thể mở file PDF: %v", err)
	}
	defer doc.Close()

	var previews []PdfPagePreview

	// 2. Duyệt qua từng trang (Giới hạn 10-20 trang đầu nếu file quá dài để tăng tốc)
	for n := 0; n < doc.NumPage(); n++ {
		// Render trang thành hình ảnh (DPI 72 là đủ để xem preview)
		img, err := doc.Image(n)
		if err != nil {
			return nil, err
		}

		// 3. Chuyển Image sang Base64 để Frontend hiển thị được ngay
		var buf bytes.Buffer
		// Nén JPEG chất lượng 50% để truyền tải cho nhanh
		err = jpeg.Encode(&buf, img, &jpeg.Options{Quality: 50})
		if err != nil {
			return nil, err
		}

		imgBase64 := base64.StdEncoding.EncodeToString(buf.Bytes())

		previews = append(previews, PdfPagePreview{
			PageNumber: n + 1,
			ImageData:  "data:image/jpeg;base64," + imgBase64,
			Width:      img.Bounds().Dx(),
			Height:     img.Bounds().Dy(),
		})
	}

	return previews, nil
}
