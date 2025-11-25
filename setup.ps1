<#
 Script de preparação de ambiente Windows para o projeto spring-boot-app.
 Execute em PowerShell (preferencialmente como Administrador para instalar pacotes).
#>

Write-Host "=== Verificando requisitos básicos ===" -ForegroundColor Cyan

function Test-Command {
    param([string]$Name)
    $exists = (Get-Command $Name -ErrorAction SilentlyContinue) -ne $null
    return $exists
}

$checks = @(
    @{ Name = 'git'; InstallWinget = 'Git.Git'; },
    @{ Name = 'java'; InstallWinget = 'EclipseAdoptium.Temurin.17.JDK'; },
    @{ Name = 'mvn'; InstallWinget = 'Apache.Maven'; },
    @{ Name = 'node'; InstallWinget = 'OpenJS.NodeJS.LTS'; },
    @{ Name = 'docker'; InstallWinget = 'Docker.DockerDesktop'; }
)

$missing = @()
foreach ($c in $checks) {
    if (Test-Command $c.Name) {
        Write-Host "[OK] $($c.Name) encontrado" -ForegroundColor Green
    } else {
        Write-Host "[FALTA] $($c.Name)" -ForegroundColor Yellow
        $missing += $c
    }
}

if ($missing.Count -gt 0) {
    Write-Host "=== Instalando dependências faltantes via winget ===" -ForegroundColor Cyan
    foreach ($m in $missing) {
        Write-Host "Instalando $($m.Name)..." -ForegroundColor Magenta
        winget install --id $($m.InstallWinget) -e --accept-source-agreements --accept-package-agreements
    }
} else {
    Write-Host "Nenhuma dependência principal faltante." -ForegroundColor Green
}

Write-Host "=== Versões instaladas ===" -ForegroundColor Cyan
if (Test-Command git)   { git --version }
if (Test-Command java)  { java -version }
if (Test-Command mvn)   { mvn -version }
if (Test-Command node)  { node -v; npm -v }
if (Test-Command docker){ docker --version; docker compose version }

Write-Host "=== Clonando repositório (se não existir) ===" -ForegroundColor Cyan
$targetDir = "$env:USERPROFILE\Documents\GitHub\spring-boot-app"
if (-not (Test-Path $targetDir)) {
    if (-not (Test-Command git)) { Write-Host "Git não instalado; abortando clone." -ForegroundColor Red; exit 1 }
    New-Item -ItemType Directory -Force -Path (Split-Path $targetDir) | Out-Null
    cd (Split-Path $targetDir)
    git clone https://github.com/FarwBr/spring-boot-app.git
} else {
    Write-Host "Diretório já existe, efetuando pull..." -ForegroundColor Yellow
    cd $targetDir
    git pull origin main
}

Write-Host "=== Opcional: Subir ambiente Docker ===" -ForegroundColor Cyan
if (Test-Command docker) {
    cd $targetDir
    docker compose up -d --build
    Write-Host "Containers iniciados. Use 'docker compose ps' para verificar." -ForegroundColor Green
} else {
    Write-Host "Docker não disponível; pule para execução local manual." -ForegroundColor Yellow
}

Write-Host "=== Finalizado. Verifique serviços conforme guia SETUP_WINDOWS.md ===" -ForegroundColor Cyan
