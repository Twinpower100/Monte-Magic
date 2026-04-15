# Восстанавливает docker/postgres/init/01_local_dump.sql в УЖЕ запущенный контейнер postgres.
# Требуется: docker compose up -d postgres (или полный compose).
#
# Дамп должен быть создан с --clean (как в dump-local-db.ps1).

param(
    [string] $DumpFile = "docker/postgres/init/01_local_dump.sql",
    [string] $Container = "goosegarden_postgres",
    [string] $DbUser = "goose_garden_admin",
    [string] $DbName = "goose_garden"
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

$path = Join-Path $root $DumpFile
if (-not (Test-Path $path)) {
    throw "Нет файла: $path. Сначала выполните .\scripts\dump-local-db.ps1"
}

Write-Host "Импорт в контейнер $Container ..."
Get-Content -Path $path -Raw -Encoding UTF8 | docker exec -i $Container psql -U $DbUser -d $DbName

if ($LASTEXITCODE -ne 0) {
    throw "psql завершился с кодом $LASTEXITCODE"
}

Write-Host "Готово."
