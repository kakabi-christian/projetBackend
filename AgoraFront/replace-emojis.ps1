# Script PowerShell pour remplacer tous les emojis par des icônes Bootstrap Icons

$replacements = @{
    '👥' = '<i class="bi bi-people-fill"></i>'
    '🚀' = '<i class="bi bi-rocket-takeoff-fill"></i>'
    '💚' = '<i class="bi bi-heart-fill"></i>'
    '🎯' = '<i class="bi bi-bullseye"></i>'
    '🤝' = '<i class="bi bi-people-fill"></i>'
    '🌍' = '<i class="bi bi-globe-americas"></i>'
    '⚖️' = '<i class="bi bi-balance-scale"></i>'
    '💡' = '<i class="bi bi-lightbulb-fill"></i>'
    '📅' = '<i class="bi bi-calendar-event-fill"></i>'
    '📍' = '<i class="bi bi-geo-alt-fill"></i>'
    '✓' = '<i class="bi bi-check-circle-fill"></i>'
    '⏳' = '<i class="bi bi-hourglass-split"></i>'
    '📱' = '<i class="bi bi-telephone-fill"></i>'
    '⚠️' = '<i class="bi bi-exclamation-triangle-fill"></i>'
    '🔒' = '<i class="bi bi-lock-fill"></i>'
    '✉️' = '<i class="bi bi-envelope-fill"></i>'
    '💰' = '<i class="bi bi-cash-coin"></i>'
    '🏆' = '<i class="bi bi-trophy-fill"></i>'
    '📄' = '<i class="bi bi-file-earmark-text-fill"></i>'
    '🔍' = '<i class="bi bi-search"></i>'
    '⚙️' = '<i class="bi bi-gear-fill"></i>'
    '🏠' = '<i class="bi bi-house-fill"></i>'
    '📈' = '<i class="bi bi-graph-up-arrow"></i>'
    '📉' = '<i class="bi bi-graph-down-arrow"></i>'
    '🔔' = '<i class="bi bi-bell-fill"></i>'
    '👤' = '<i class="bi bi-person-fill"></i>'
    '🗂️' = '<i class="bi bi-folder-fill"></i>'
    '📎' = '<i class="bi bi-paperclip"></i>'
    '🖼️' = '<i class="bi bi-image-fill"></i>'
    '🎨' = '<i class="bi bi-palette-fill"></i>'
    '📝' = '<i class="bi bi-pencil-square"></i>'
    '🗑️' = '<i class="bi bi-trash-fill"></i>'
    '➕' = '<i class="bi bi-plus-circle-fill"></i>'
    '➖' = '<i class="bi bi-dash-circle-fill"></i>'
    '↗️' = '<i class="bi bi-arrow-up-right"></i>'
    '⬇️' = '<i class="bi bi-download"></i>'
    '⬆️' = '<i class="bi bi-upload"></i>'
    '🔄' = '<i class="bi bi-arrow-clockwise"></i>'
    '❌' = '<i class="bi bi-x-circle-fill"></i>'
    'ℹ️' = '<i class="bi bi-info-circle-fill"></i>'
    '🌟' = '<i class="bi bi-star-fill"></i>'
    '📦' = '<i class="bi bi-box-seam-fill"></i>'
    '🎁' = '<i class="bi bi-gift-fill"></i>'
    '💼' = '<i class="bi bi-briefcase-fill"></i>'
    '📊' = '<i class="bi bi-bar-chart-fill"></i>'
    '🔗' = '<i class="bi bi-link-45deg"></i>'
    '🏷️' = '<i class="bi bi-tag-fill"></i>'
    '👁️' = '<i class="bi bi-eye-fill"></i>'
    '⏱️' = '<i class="bi bi-stopwatch-fill"></i>'
    '🛠️' = '<i class="bi bi-tools"></i>'
    '📧' = '<i class="bi bi-envelope-fill"></i>'
    '🎓' = '<i class="bi bi-mortarboard-fill"></i>'
    '🌐' = '<i class="bi bi-globe"></i>'
    '💬' = '<i class="bi bi-chat-fill"></i>'
    '📢' = '<i class="bi bi-megaphone-fill"></i>'
}

# Trouver tous les fichiers HTML
$htmlFiles = Get-ChildItem -Path "agoraCooperativefrontend\src\app" -Filter "*.html" -Recurse

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($emoji in $replacements.Keys) {
        $icon = $replacements[$emoji]
        if ($content -match [regex]::Escape($emoji)) {
            $content = $content -replace [regex]::Escape($emoji), $icon
            $fileReplacements++
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $totalFiles++
        $totalReplacements += $fileReplacements
        Write-Host "✓ $($file.Name) - $fileReplacements remplacement(s)" -ForegroundColor Green
    }
}

Write-Host "`n=== Résumé ===" -ForegroundColor Cyan
Write-Host "Fichiers modifiés: $totalFiles" -ForegroundColor Yellow
Write-Host "Total remplacements: $totalReplacements" -ForegroundColor Yellow
Write-Host "`nTerminé! 🎉" -ForegroundColor Green
