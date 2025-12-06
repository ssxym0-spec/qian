@echo off
chcp 65001 >nul
echo ========================================
echo   高端茶叶品牌落地页 - 快速启动脚本
echo ========================================
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo [1/3] 首次运行，正在安装依赖...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ 依赖安装失败！
        echo.
        echo 请检查：
        echo   1. 是否已安装 Node.js？
        echo   2. 网络连接是否正常？
        echo.
        pause
        exit /b 1
    )
    echo.
    echo ✅ 依赖安装完成！
    echo.
) else (
    echo [1/3] 依赖已安装，跳过安装步骤
    echo.
)

echo [2/3] 检查后端服务...
echo.
echo ⚠️  重要提示：
echo    确保你的 Express 后端服务正在运行！
echo    - 地址：http://localhost:3000
echo    - 接口：GET /api/public/landing-page
echo.
timeout /t 3 /nobreak >nul

echo [3/3] 启动前端开发服务器...
echo.
echo ✨ 前端服务将在以下地址启动：
echo    http://localhost:3001
echo.
echo 📝 提示：
echo    - 按 Ctrl+C 停止服务器
echo    - 修改代码后会自动热重载
echo.
echo ========================================
echo.

call npm run dev

pause
