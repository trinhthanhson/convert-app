package service

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

// ProcessResult: Cấu trúc dùng chung cho tất cả các hành động
type ProcessResult struct {
	Success    bool   `json:"success"`
	OutputPath string `json:"outputPath"`
	Error      string `json:"error"`
}

// PdfPagePreview: Cấu trúc cho preview trang PDF
type PdfPagePreview struct {
	PageNumber int    `json:"pageNumber"`
	ImageData  string `json:"imageData"` // base64 encoded image
	Width      int    `json:"width"`
	Height     int    `json:"height"`
}

// ConvertPdfToDocx: Chuyển PDF -> Word với outputPath do người dùng chọn
func ConvertPdfToDocx(inputPath string, outputPath string) ProcessResult {
	// Sử dụng trực tiếp outputPath được truyền từ App Handler
	pyScript := fmt.Sprintf("from pdf2docx import Converter; cv = Converter(r'%s'); cv.convert(r'%s'); cv.close()", inputPath, outputPath)
	cmd := exec.Command("python", "-c", pyScript)

	if err := cmd.Run(); err != nil {
		return ProcessResult{Success: false, Error: err.Error()}
	}
	return ProcessResult{Success: true, OutputPath: outputPath}
}

// ConvertDocxToPdf: Chuyển Word -> PDF với outputPath do người dùng chọn
func ConvertDocxToPdf(inputPath string, outputPath string) ProcessResult {
	// Sử dụng trực đưa outputPath vào script Python
	pyScript := fmt.Sprintf("from docx2pdf import convert; convert(r'%s', r'%s')", inputPath, outputPath)
	cmd := exec.Command("python", "-c", pyScript)

	if err := cmd.Run(); err != nil {
		return ProcessResult{Success: false, Error: err.Error()}
	}
	return ProcessResult{Success: true, OutputPath: outputPath}
}

// MergePDFs: Gộp nhiều file PDF thành một với outputPath cụ thể
func MergePDFs(inputPaths []string, outputPath string) ProcessResult {
	if len(inputPaths) == 0 {
		return ProcessResult{Success: false, Error: "Danh sách file trống"}
	}

	// Chuyển mảng path Go sang list Python r'path' để tránh lỗi ký tự đặc biệt windows
	var pyPaths []string
	for _, p := range inputPaths {
		pyPaths = append(pyPaths, fmt.Sprintf("r'%s'", p))
	}
	pyList := "[" + strings.Join(pyPaths, ",") + "]"

	pyScript := fmt.Sprintf(`
from pypdf import PdfWriter
merger = PdfWriter()
for pdf in %s:
    merger.append(pdf)
merger.write(r'%s')
merger.close()
	`, pyList, outputPath)

	cmd := exec.Command("python", "-c", pyScript)
	if err := cmd.Run(); err != nil {
		return ProcessResult{Success: false, Error: err.Error()}
	}

	return ProcessResult{Success: true, OutputPath: outputPath}
}

// GetPdfPagePreviews: Lấy preview của tất cả các trang PDF dưới dạng base64 images
func GetPdfPagePreviews(inputPath string) ([]PdfPagePreview, error) {
	// Sử dụng Python với pdf2image để chuyển đổi PDF thành images
	pyScript := fmt.Sprintf(`
import base64
from pdf2image import convert_from_path
import io
import json
import sys

try:
    # Chuyển đổi tất cả trang thành images với DPI thấp để preview nhanh
    images = convert_from_path(r'%s', dpi=72, fmt='JPEG', jpegopt={'quality': 50})
    
    if len(images) == 0:
        print(json.dumps({'error': 'PDF file appears to be empty or corrupted'}))
        sys.exit(1)
    
    previews = []
    for i, img in enumerate(images, 1):
        # Chuyển image thành base64
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=50)
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        preview = {
            'pageNumber': i,
            'imageData': f'data:image/jpeg;base64,{img_base64}',
            'width': img.width,
            'height': img.height
        }
        previews.append(preview)
    
    # In JSON array trực tiếp
    print(json.dumps(previews))
except ImportError as e:
    print(json.dumps({'error': 'Missing required dependency: pdf2image or poppler. Please install poppler system library.'}))
    sys.exit(1)
except Exception as e:
    # In error dưới dạng JSON object để dễ parse
    error_result = {'error': f'Failed to process PDF: {str(e)}'}
    print(json.dumps(error_result))
    sys.exit(1)
	`, inputPath)

	// Set up environment with poppler PATH
	cmd := exec.Command("python", "-c", pyScript)
	popplerPath := `d:\GoLang\convert-app\convert-app\temp\poppler-23.11.0\Library\bin`
	cmd.Env = append(os.Environ(), "PATH="+popplerPath+string(os.PathListSeparator)+os.Getenv("PATH"))

	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("failed to execute Python script: %v", err)
	}

	outputStr := strings.TrimSpace(string(output))

	// Parse JSON từ Python
	var result interface{}
	if err := json.Unmarshal([]byte(outputStr), &result); err != nil {
		return nil, fmt.Errorf("failed to parse JSON output: %v, output: %s", err, outputStr)
	}

	// Check if it's an error response
	if resultMap, ok := result.(map[string]interface{}); ok {
		if errorMsg, exists := resultMap["error"]; exists {
			return nil, fmt.Errorf("PDF processing error: %v", errorMsg)
		}
	}

	// Parse as array of previews
	var previews []PdfPagePreview
	if previewsArray, ok := result.([]interface{}); ok {
		for _, item := range previewsArray {
			if previewMap, ok := item.(map[string]interface{}); ok {
				preview := PdfPagePreview{
					PageNumber: int(previewMap["pageNumber"].(float64)),
					ImageData:  previewMap["imageData"].(string),
					Width:      int(previewMap["width"].(float64)),
					Height:     int(previewMap["height"].(float64)),
				}
				previews = append(previews, preview)
			}
		}
	} else {
		return nil, fmt.Errorf("unexpected JSON structure: %s", outputStr)
	}

	return previews, nil
}
