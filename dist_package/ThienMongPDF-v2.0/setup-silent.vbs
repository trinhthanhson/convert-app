' ============================================
' Thiên Mộng PDF - Silent Setup
' ============================================
' Chạy setup.bat mà không hiển thị console

Set objShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' Run setup.bat in hidden mode
objShell.Run strPath & "\setup.bat", 0, True

' Sau setup hoàn tất, chạy app
Set objFSO = CreateObject("Scripting.FileSystemObject")
appPath = strPath & "\ThienMongConvert.exe"

If objFSO.FileExists(appPath) Then
    objShell.Run appPath, 1, False
Else
    WScript.Echo "Error: Application not found at " & appPath
End If

Set objShell = Nothing
Set objFSO = Nothing
