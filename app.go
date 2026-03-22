package main

import (
	"context"
	"convert-app/internal/service"
	"fmt"
	"path/filepath"
	"strings"

	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp tạo một instance mới của App struct
func NewApp() *App {
	return &App{}
}

// startup được gọi khi ứng dụng bắt đầu khởi động
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// --- HỆ THỐNG DIALOG (CHỌN FILE & LƯU FILE) ---

// SelectSingleFile: Mở cửa sổ chọn 1 file duy nhất (PDF hoặc Word)
func (a *App) SelectSingleFile(filterName string, extension string) (string, error) {
	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Chọn file để xử lý",
		Filters: []runtime.FileFilter{
			{DisplayName: filterName, Pattern: extension},
		},
	})
	if err != nil {
		return "", err
	}
	return selection, nil
}

// SelectMultipleFiles: Mở cửa sổ chọn nhiều file PDF cùng lúc (Dùng cho Gộp PDF)
func (a *App) SelectMultipleFiles() ([]string, error) {
	selection, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Chọn các file PDF để gộp",
		Filters: []runtime.FileFilter{
			{DisplayName: "PDF Files (*.pdf)", Pattern: "*.pdf"},
		},
	})
	if err != nil {
		return nil, err
	}
	return selection, nil
}

// GetSavePath: Quan trọng - Mở hộp thoại để người dùng chọn nơi lưu và đặt tên file
func (a *App) GetSavePath(defaultName string, filter string) (string, error) {
	return runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Chọn nơi lưu file kết quả",
		DefaultFilename: defaultName,
		Filters: []runtime.FileFilter{
			{DisplayName: "Files", Pattern: filter},
		},
	})
}

// --- HỆ THỐNG XỬ LÝ (ACTIONS) ---
// Lưu ý: Các hàm Action bây giờ nhận thêm outputPath từ Frontend

// ActionPdfToWord: Xử lý chuyển PDF sang Word
func (a *App) ActionPdfToWord(inputPath string, outputPath string) service.ProcessResult {
	if inputPath == "" || outputPath == "" {
		return service.ProcessResult{Success: false, Error: "Thiếu đường dẫn file đầu vào hoặc đầu ra"}
	}
	// Gọi hàm từ processor.go (đã bỏ alias service. vì nằm cùng package main)
	return service.ConvertPdfToDocx(inputPath, outputPath)
}

// ActionWordToPdf: Xử lý chuyển Word sang PDF
func (a *App) ActionWordToPdf(inputPath string, outputPath string) service.ProcessResult {
	if inputPath == "" || outputPath == "" {
		return service.ProcessResult{Success: false, Error: "Thiếu đường dẫn file đầu vào hoặc đầu ra"}
	}
	return service.ConvertDocxToPdf(inputPath, outputPath)
}

// ActionMergePDF: Xử lý gộp nhiều file PDF
func (a *App) ActionMergePDF(inputPaths []string, outputPath string) service.ProcessResult {
	if len(inputPaths) < 2 || outputPath == "" {
		return service.ProcessResult{Success: false, Error: "Cần ít nhất 2 file và đường dẫn lưu file"}
	}
	return service.MergePDFs(inputPaths, outputPath)
}

// --- TIỆN ÍCH HỆ THỐNG ---

// OpenFileFolder: Mở thư mục chứa file đã chuyển đổi thành công
func (a *App) OpenFileFolder(path string) {
	dir := filepath.Dir(path)
	runtime.BrowserOpenURL(a.ctx, dir)
}

// DeletePages nhận đường dẫn file và danh sách các trang cần GIỮ LẠI
// Chỉnh sửa lại hàm DeletePages để nhận thêm tham số lưu
func (a *App) DeletePages(inputPath string, pagesToRemove []int, outputPath string) (string, error) {
	if len(pagesToRemove) == 0 {
		return "", fmt.Errorf("vui lòng chọn ít nhất một trang để xóa")
	}

	// Chuyển mảng int []int{1, 2} thành mảng string []string{"1", "2"} để pdfcpu hiểu
	var selectedPages []string
	for _, p := range pagesToRemove {
		selectedPages = append(selectedPages, fmt.Sprintf("%d", p))
	}

	// Sử dụng pdfcpu để xóa các trang đó và lưu ra file mới
	err := api.RemovePagesFile(inputPath, outputPath, selectedPages, nil)
	if err != nil {
		return "", err
	}

	return outputPath, nil
}

type Result struct {
	Success    bool   `json:"success"`
	OutputPath string `json:"outputPath"`
	Error      string `json:"error"`
}

func (a *App) ActionDeletePages(inputPath string, pagesToRemove string, outputPath string) Result {
	// Chuyển đổi chuỗi "1, 3, 5-10" thành mảng trang mà thư viện hiểu
	// Lưu ý: Thư viện pdfcpu có hàm api.RemovePages hỗ trợ trực tiếp chuỗi này

	err := api.RemovePagesFile(inputPath, outputPath, strings.Split(pagesToRemove, ","), nil)
	if err != nil {
		return Result{Success: false, Error: err.Error()}
	}

	return Result{Success: true, OutputPath: outputPath}
}

// ShowNotification: Hiển thị thông báo nhanh trên hệ thống
func (a *App) ShowNotification(title string, message string) {
	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    runtime.InfoDialog,
		Title:   title,
		Message: message,
	})
}

// GetPdfPagePreviews: Lấy preview của tất cả các trang PDF
func (a *App) GetPdfPagePreviews(filePath string) ([]service.PdfPagePreview, error) {
	if filePath == "" {
		return nil, fmt.Errorf("đường dẫn file không được để trống")
	}
	return service.GetPdfPagePreviews(filePath)
}
