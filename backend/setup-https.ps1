<# 
Gera certificados HTTPS locais para o backend usando mkcert.
- Cria a pasta certs no backend.
- Inclui localhost, 127.0.0.1, ::1 e IPs privados detectados (10.x, 192.168.x, 172.16-31.x).
Requisitos:
- mkcert instalado e presente no PATH.
- Execução no Windows PowerShell.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Ir para a pasta do script
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)

# Verificar mkcert
if (-not (Get-Command mkcert -ErrorAction SilentlyContinue)) {
  Write-Host "mkcert não encontrado. Instale antes de continuar."
  exit 1
}

# Pasta de saída
$certsDir = Join-Path -Path (Get-Location) -ChildPath "certs"
if (-not (Test-Path $certsDir)) {
  New-Item -ItemType Directory -Path $certsDir | Out-Null
}

# Detectar IPs privados
$privateIps = @(Get-NetIPAddress -AddressFamily IPv4 `
  | Where-Object {
      ($_.IPAddress -like "10.*") -or
      ($_.IPAddress -like "192.168.*") -or
      ($_.IPAddress -match "^172\.(1[6-9]|2[0-9]|3[0-1])\.")
    } `
  | Select-Object -ExpandProperty IPAddress -Unique)

# Domínios/hosts padrão
$hosts = @("localhost", "127.0.0.1", "::1")

# Adicionar IPs detectados
if ($privateIps.Count -gt 0) {
  $hosts += $privateIps
}

$hosts = $hosts | Sort-Object -Unique

Write-Host "Gerando certificado para: $($hosts -join ', ')"

# Montar nomes de arquivo baseando no primeiro host
$baseName = "localhost+auto"
$keyFile = Join-Path $certsDir "$baseName-key.pem"
$certFile = Join-Path $certsDir "$baseName.pem"

# Remover arquivos antigos com mesmo padrão
Get-ChildItem $certsDir -Filter "localhost+auto*" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

# Instalar CA (se ainda não)
mkcert -install

# Gerar certificado
mkcert -key-file $keyFile -cert-file $certFile @hosts

Write-Host ""
Write-Host "Concluído. Arquivos:"
Write-Host "  Certificado: $certFile"
Write-Host "  Chave.......: $keyFile"
Write-Host ""
Write-Host "Inicie o backend em HTTPS (npm run dev) e aponte o frontend para https://<seu-ip>:3001 via VITE_API_URL."
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

