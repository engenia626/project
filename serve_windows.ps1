$ErrorActionPreference = 'Stop'
$root = (Resolve-Path $PSScriptRoot).Path
$prefix = 'http://127.0.0.1:8026/'
$server = New-Object System.Net.HttpListener
$server.Prefixes.Add($prefix)
try { $server.Start() } catch { Write-Host 'Port 8026 is unavailable. Close old server windows and retry.'; Write-Host $_; exit 1 }
Write-Host ('Xiaoman is running at ' + $prefix)
Write-Host 'Press Ctrl+C to stop.'
try { Start-Process $prefix } catch { Write-Host ('Open your browser at ' + $prefix) }
try {
  while ($server.IsListening) {
    $ctx = $server.GetContext()
    try {
      $urlPath = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = 'index.html' }
      $full = [IO.Path]::GetFullPath((Join-Path $root $urlPath.Replace('/', [IO.Path]::DirectorySeparatorChar)))
      if (-not $full.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid path' }
      if (-not [IO.File]::Exists($full)) { $ctx.Response.StatusCode=404; $ctx.Response.Close(); continue }
      $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
      $mime = switch ($ext) { '.html' {'text/html; charset=utf-8'} '.js' {'text/javascript; charset=utf-8'} '.css' {'text/css; charset=utf-8'} '.png' {'image/png'} '.jpg' {'image/jpeg'} '.webp' {'image/webp'} '.svg' {'image/svg+xml'} '.ogg' {'audio/ogg'} '.glb' {'model/gltf-binary'} default {'application/octet-stream'} }
      $ctx.Response.ContentType=$mime
      $ctx.Response.Headers['Cache-Control']='no-store'
      $file = [IO.File]::OpenRead($full)
      try { $ctx.Response.ContentLength64=$file.Length; $file.CopyTo($ctx.Response.OutputStream) } finally { $file.Close() }
      $ctx.Response.OutputStream.Close()
    } catch { try { $ctx.Response.StatusCode=500; $ctx.Response.Close() } catch {} }
  }
} finally { $server.Stop(); $server.Close() }
