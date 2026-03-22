# 🚀 Hướng dẫn khởi động nhanh

## **Máy chưa có Python? Không vấn đề!**

Chỉ cần **1 cách làm** dưới đây:

---

## **Cách 1: Click để cài (Khuyến nghị ⭐)**

Nhấp đôi trên file:
```
setup.bat
```

✅ Bước 1: Tự động cài Python (nếu chưa có)
✅ Bước 2: Tự động cài Python packages  
✅ Bước 3: Chạy ứng dụng

**Xong!** Chờ đến khi ứng dụng mở ra.

---

## **Cách 2: Chạy silently (Chạy yên tĩnh)**

Nhấp đôi trên:
```
setup-silent.vbs
```

✅ Không bị bí console windows
✅ Tự động cài + chạy
✅ Hoàn toàn invisible

---

## **Cách 3: Manual (Nếu cách trên không chạy)**

### **Bước 1: Cài Python**
- Tải từ: https://www.python.org/downloads/
- Chọn Python 3.10 hoặc 3.11
- **QUAN TRỌNG**: ✓ Tick "Add Python to PATH"
- Cài xong, **restart máy**

### **Bước 2: Mở PowerShell (Admin)**
```
Ctrl + X → Chọn "Windows PowerShell (Admin)"
```

### **Bước 3: Cài packages**
```powershell
cd "D:\Folder\Chứa\App"
pip install -r requirements.txt
```

### **Bước 4: Chạy ứng dụng**
```powershell
.\ThienMongConvert.exe
```

hoặc nhấp đôi `ThienMongConvert.exe`

---

## **📋 Files trong folder:**

| File | Dùng để |
|------|---------|
| `setup.bat` | ✓ Cài tự động (Khuyến nghị) |
| `setup-silent.vbs` | ✓ Cài yên tĩnh |
| `install-full.ps1` | PowerShell script gốc |
| `requirements.txt` | Danh sách Python packages |
| `ThienMongConvert.exe` | **Ứng dụng chính** |

---

## **❌ Nếu gặp lỗi:**

| Lỗi | Giải pháp |
|-----|----------|
| `PowerShell execution policy` | Mở PowerShell Admin gõ: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force` |
| `python: command not found` | Cài Python lại và ✓ tick "Add Python to PATH" |
| `Requirements.txt not found` | Đảm bảo file `requirements.txt` ở cùng folder |
| `App won't start` | Mở PowerShell, gõ `python --version` để kiểm tra |

---

## **✅ Xong!**

Chỉ cần **nhấp đôi `setup.bat`** → Ứng dụng sẽ chạy!

Nếu vẫn gặp vấn đề, liên hệ support.
