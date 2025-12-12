# Script para configurar HTTPS no MarcBuddy
# Este script gera certificados SSL usando mkcert

Write-Host "Configurando HTTPS para MarcBuddy..." -ForegroundColor Cyan
Write-Host ""

# Verificar se mkcert está instalado
$mkcertInstalled = Get-Command mkcert -ErrorAction SilentlyContinue

if (-not $mkcertInstalled) {
    Write-Host "ERRO: mkcert nao esta instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para instalar o mkcert no Windows:" -ForegroundColor Yellow
    Write-Host "  1. Instale o Chocolatey (se ainda nao tiver):" -ForegroundColor White
    Write-Host "     Set-ExecutionPolicy Bypass -Scope Process -Force" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Instale o mkcert:" -ForegroundColor White
    Write-Host "     choco install mkcert" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  OU baixe manualmente de: https://github.com/FiloSottile/mkcert/releases" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "OK: mkcert encontrado!" -ForegroundColor Green
Write-Host ""

# Instalar certificado root (se ainda não estiver instalado)
Write-Host "Instalando certificado root local..." -ForegroundColor Cyan
try {
    $installResult = mkcert -install 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Certificado root instalado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Certificado root pode ja estar instalado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERRO ao instalar certificado root: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
Write-Host ""

# Criar diretório para certificados
$certsDir = ".\certs"
if (-not (Test-Path $certsDir)) {
    New-Item -ItemType Directory -Path $certsDir | Out-Null
    Write-Host "OK: Diretorio 'certs' criado" -ForegroundColor Green
}

# Detectar IP local da rede
Write-Host "Detectando IP local da rede..." -ForegroundColor Cyan
$localIPs = @()
try {
    $adapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" }
    foreach ($adapter in $adapters) {
        $localIPs += $adapter.IPAddress
    }
    if ($localIPs.Count -gt 0) {
        Write-Host "OK: IPs locais detectados: $($localIPs -join ', ')" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Nenhum IP local detectado, usando apenas localhost" -ForegroundColor Yellow
    }
} catch {
    Write-Host "AVISO: Nao foi possivel detectar IP local automaticamente" -ForegroundColor Yellow
}

# Preparar lista de hosts para o certificado
$hosts = @("localhost", "127.0.0.1", "::1")
$hosts += $localIPs
$hosts = $hosts | Select-Object -Unique

Write-Host ""
Write-Host "Gerando certificados SSL para: $($hosts -join ', ')" -ForegroundColor Cyan
try {
    $currentDir = Get-Location
    Set-Location $certsDir
    $certResult = mkcert $hosts 2>&1
    Set-Location $currentDir
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Certificados gerados com sucesso!" -ForegroundColor Green
        if ($certResult) {
            Write-Host "   $certResult" -ForegroundColor Gray
        }
    } else {
        Write-Host "ERRO ao gerar certificados: $certResult" -ForegroundColor Red
        Write-Host ""
        Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
} catch {
    Write-Host "ERRO ao gerar certificados: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""
Write-Host "OK: Configuracao concluida!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
$certsFullPath = (Resolve-Path $certsDir -ErrorAction SilentlyContinue).Path
if (-not $certsFullPath) {
    $certsFullPath = (Join-Path (Get-Location).Path $certsDir)
}
Write-Host "  1. Os certificados foram salvos em: $certsFullPath" -ForegroundColor White
Write-Host "  2. Reinicie os servidores (frontend e backend)" -ForegroundColor White
Write-Host "  3. Acesse: https://localhost:3000 (frontend)" -ForegroundColor White
Write-Host "     OU: https://$($localIPs[0]):3000 (se acessando pela rede local)" -ForegroundColor White
Write-Host "  4. Acesse: https://localhost:3001 (backend)" -ForegroundColor White
Write-Host "     OU: https://$($localIPs[0]):3001 (se acessando pela rede local)" -ForegroundColor White
Write-Host ""
Write-Host "AVISO: Se o navegador ainda mostrar aviso de seguranca, clique em Avancado e Prosseguir" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
