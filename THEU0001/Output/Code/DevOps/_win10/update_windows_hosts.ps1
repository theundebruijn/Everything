# copyright © 2020-present, Theun de Bruijn. all rights reserved.

Write-Host 'reading WSL2 ip address from: "\\wsl$\ubuntu-2010-wsl\home\theundebruijn\Work\Theun de Bruijn\Everything\THEU0001\Output\Code\DevOps\_tmp\ip_addr.txt"'

$my_ip = Get-Content "\\wsl$\ubuntu-2010-wsl\home\theundebruijn\Work\Theun de Bruijn\Everything\THEU0001\Output\Code\DevOps\_tmp\ip_addr.txt" -totalcount 1
Write-Host 'ip address found:'$my_ip''

# code for updateing the host file: https://stackoverflow.com/a/42843058
function setHostEntries([hashtable] $entries) {
    $hostsFile = "$env:windir\System32\drivers\etc\hosts"
    $newLines = @()

    $c = Get-Content -Path $hostsFile
    foreach ($line in $c) {
        $bits = [regex]::Split($line, "\s+")
        if ($bits.count -eq 2) {
            $match = $NULL
            ForEach($entry in $entries.GetEnumerator()) {
                if($bits[1] -eq $entry.Key) {
                    $newLines += ($entry.Value + '     ' + $entry.Key)
                    Write-Host replacing HOSTS entry for $entry.Key
                    $match = $entry.Key
                    break
                }
            }
            if($match -eq $NULL) {
                $newLines += $line
            } else {
                $entries.Remove($match)
            }
        } else {
            $newLines += $line
        }
    }

    foreach($entry in $entries.GetEnumerator()) {
        Write-Host adding HOSTS entry for $entry.Key
        $newLines += $entry.Value + '     ' + $entry.Key
    }

    Write-Host saving $hostsFile
    Clear-Content $hostsFile
    foreach ($line in $newLines) {
        $line | Out-File -encoding ASCII -append $hostsFile
    }
}

$entries = @{
    'local.giantesque.com' = $my_ip
};

setHostEntries($entries)
