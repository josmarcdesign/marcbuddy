# Script para configurar ngrok para o projeto MarcBuddy

Write-Host "=== Configuração do ngrok para MarcBuddy ===" -ForegroundColor Green
Write-Host ""

# Verificar se ngrok já está instalado
$ngrokPath = Get-Command ngrok -ErrorAction SilentlyContinue

if ($ngrokPath) {
    Write-Host "✓ ngrok já está instalado em: $($ngrokPath.Source)" -ForegroundColor Green
} else {
    Write-Host "📥 Baixando ngrok..." -ForegroundColor Yellow
    
    # Criar pasta para ngrok
    $ngrokDir = "$env:USERPROFILE\ngrok"
    if (-not (Test-Path $ngrokDir)) {
        New-Item -ItemType Directory -Path $ngrokDir | Out-Null
    }
    
    # Baixar ngrok
    $zipPath = "$env:TEMP\ngrok.zip"
    $downloadUrl = "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip"
    
    try {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing
        Write-Host "✓ Download concluído" -ForegroundColor Green
        
        # Extrair
        Write-Host "📦 Extraindo ngrok..." -ForegroundColor Yellow
        Expand-Archive -Path $zipPath -DestinationPath $ngrokDir -Force
        Remove-Item $zipPath
        
        Write-Host "✓ ngrok extraído para: $ngrokDir" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANTE: Adicione ao PATH ou use o caminho completo:" -ForegroundColor Yellow
        Write-Host "   $ngrokDir\ngrok.exe" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Erro ao baixar ngrok: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor, baixe manualmente de: https://ngrok.com/download" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "=== Próximos passos ===" -ForegroundColor Green
Write-Host ""
Write-Host "1. Crie uma conta gratuita em: https://dashboard.ngrok.com/signup" -ForegroundColor Yellow
Write-Host "2. Obtenha seu authtoken em: https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor Yellow
Write-Host "3. Configure o authtoken:" -ForegroundColor Yellow
Write-Host "   ngrok config add-authtoken SEU_TOKEN_AQUI" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Para iniciar o túnel do frontend (porta 3000):" -ForegroundColor Yellow
Write-Host "   ngrok http 3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Para iniciar o túnel do backend (porta 3001) em outro terminal:" -ForegroundColor Yellow
Write-Host "   ngrok http 3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. Use as URLs fornecidas pelo ngrok para acessar o site externamente!" -ForegroundColor Green

