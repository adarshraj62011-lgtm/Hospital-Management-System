$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$services = @(
  @{
    Name = "Hospital Backend"
    Path = Join-Path $root "Backend"
    Command = "node server.js"
  },
  @{
    Name = "Hospital Frontend"
    Path = Join-Path $root "frontend"
    Command = "npm run dev"
  },
  @{
    Name = "Hospital Dashboard"
    Path = Join-Path $root "dashboard"
    Command = "npm run dev"
  }
)

foreach ($service in $services) {
  Start-Process powershell `
    -ArgumentList @(
      "-NoExit",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      "`$Host.UI.RawUI.WindowTitle = '$($service.Name)'; Set-Location '$($service.Path)'; $($service.Command)"
    ) `
    -WorkingDirectory $service.Path `
    -WindowStyle Normal
}

Write-Host ""
Write-Host "Project services launched:"
Write-Host "Frontend:  http://localhost:5173"
Write-Host "Dashboard: http://localhost:5174"
Write-Host "Backend:   http://localhost:4000/api/v1/health"
Write-Host ""
Write-Host "Admin login:"
Write-Host "Email:    adarshraj62011@gmail.com"
Write-Host "Password: adarshraj01"
