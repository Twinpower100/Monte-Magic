# Снимает дамп локальной БД в docker/postgres/init/01_local_dump.sql
# для первого запуска postgres в docker compose (см. docker/postgres/init/README.md).
#
# Использование:
#   $env:PGPASSWORD = "ваш_пароль"
#   .\scripts\dump-local-db.ps1
#
# Или без PGPASSWORD — скрипт запросит пароль.

param(
    [string] $DbHost = "localhost",
    [string] $DbPort = "5433",
    [string] $DbUser = "goose_garden_admin",
    [string] $DbName = "goose_garden",
    [string] $OutputFile = "docker/postgres/init/01_local_dump.sql"
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

$outputPath = if ([System.IO.Path]::IsPathRooted($OutputFile)) {
    $OutputFile
} else {
    Join-Path $root $OutputFile
}
$outDir = Split-Path $outputPath -Parent
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

if (-not $env:PGPASSWORD) {
    $sec = Read-Host "Пароль PostgreSQL ($DbUser@$DbHost`:$DbPort/$DbName)" -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
    try {
        $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

Write-Host "Дамп: $DbHost`:$DbPort / $DbName -> $outputPath"

& pg_dump `
    -h $DbHost -p $DbPort -U $DbUser -d $DbName `
    --clean --if-exists --no-owner --no-acl --format=plain `
    -f $outputPath

if ($LASTEXITCODE -ne 0) {
    throw "pg_dump завершился с кодом $LASTEXITCODE. Убедитесь, что pg_dump в PATH и параметры подключения верны."
}

Write-Host ""
Write-Host "Готово. Дальше (первый импорт в Docker):"
Write-Host "  docker compose down -v"
Write-Host "  docker compose up -d"
Write-Host ""
Write-Host "Или без сброса тома: .\scripts\restore-into-running-docker.ps1"
