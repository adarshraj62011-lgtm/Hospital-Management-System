$windowTitles = @(
  "Hospital Backend",
  "Hospital Frontend",
  "Hospital Dashboard"
)

$processes = Get-Process | Where-Object {
  $_.ProcessName -eq "powershell" -and $windowTitles -contains $_.MainWindowTitle
}

foreach ($process in $processes) {
  try {
    Stop-Process -Id $process.Id -Force -ErrorAction Stop
  } catch {
  }
}

Write-Host "Stopped project service windows."
