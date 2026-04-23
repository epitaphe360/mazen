$token = (Get-Content "$env:APPDATA\com.vercel.cli\Data\auth.json" | ConvertFrom-Json).token
$projectId = "prj_r361nOr3LgMR4qYjDLPQOkXcZhla"
$teamId = "team_KOiGHlaybJQfSM31qlv7XgHP"

$vars = @(
  @{ key = "SUPABASE_URL";              value = "https://wfoiqwymzyzhtapvuqbg.supabase.co";  type = "plain" },
  @{ key = "SUPABASE_SERVICE_ROLE_KEY"; value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmb2lxd3ltenl6aHRhcHZ1cWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk0MDg3NywiZXhwIjoyMDkyNTE2ODc3fQ.PmTOc9dONZkIxQbiIxGEQdqrolJbDVLdJ3aVrjZ27iM"; type = "sensitive" },
  @{ key = "VITE_SUPABASE_URL";         value = "https://wfoiqwymzyzhtapvuqbg.supabase.co";  type = "plain" },
  @{ key = "VITE_SUPABASE_ANON_KEY";    value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmb2lxd3ltenl6aHRhcHZ1cWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDA4NzcsImV4cCI6MjA5MjUxNjg3N30.PaHN5rEVB8Vm0UgaqiXUyp-MsYXSl4MZJT8viyCF1PQ"; type = "sensitive" },
  @{ key = "JWT_SECRET";                value = "hcPbJCvOptiNXnF1au6Bjoy0lEHLRUK28Yg3qwS4TVIQ9GAM"; type = "sensitive" },
  @{ key = "OWNER_EMAIL";               value = "admin@mazen-govtech.com"; type = "plain" },
  @{ key = "NODE_ENV";                  value = "production"; type = "plain" }
)

$headers = @{
  Authorization = "Bearer $token"
  "Content-Type" = "application/json"
}

$listUrl = "https://api.vercel.com/v10/projects/$projectId/env?teamId=$teamId"

# Récupère les vars existantes
$existing = @{}
try {
  $listResp = Invoke-RestMethod -Method GET -Uri $listUrl -Headers $headers
  foreach ($e in $listResp.envs) {
    $existing[$e.key] = $e.id
  }
  Write-Host "Variables existantes: $($existing.Keys -join ', ')"
} catch {
  Write-Host "Impossible de lister les variables: $_"
}

foreach ($v in $vars) {
  $body = @{
    key    = $v.key
    value  = $v.value
    type   = $v.type
    target = @("production", "preview")
  } | ConvertTo-Json

  if ($existing.ContainsKey($v.key)) {
    # PATCH
    $id = $existing[$v.key]
    $patchUrl = "https://api.vercel.com/v10/projects/$projectId/env/$id?teamId=$teamId"
    try {
      Invoke-RestMethod -Method PATCH -Uri $patchUrl -Headers $headers -Body $body | Out-Null
      Write-Host "✅ UPDATED $($v.key)"
    } catch {
      Write-Host "❌ PATCH failed $($v.key): $_"
    }
  } else {
    # POST
    try {
      Invoke-RestMethod -Method POST -Uri $listUrl -Headers $headers -Body $body | Out-Null
      Write-Host "✅ CREATED $($v.key)"
    } catch {
      Write-Host "❌ POST failed $($v.key): $_"
    }
  }
}

Write-Host ""
Write-Host "=== Vérification finale ==="
$finalList = Invoke-RestMethod -Method GET -Uri $listUrl -Headers $headers
$finalList.envs | Select-Object key, type, target | Format-Table -AutoSize
