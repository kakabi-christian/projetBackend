<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #004a99; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #004a99; color: white; padding: 10px; text-align: left; }
        td { border: 1px solid #ddd; padding: 8px; font-size: 11px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>AGORA COOP</h1>
        <h3>LISTE DES MEMBRES</h3>
    </div>

    <table>
        <thead>
            <tr>
                <th>Code</th>
                <th>Nom & Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Inscription</th>
            </tr>
        </thead>
        <tbody>
            @foreach($membres as $membre)
            <tr>
                <td><strong>{{ $membre->code_membre }}</strong></td>
                <td>{{ strtoupper($membre->nom) }} {{ $membre->prenom }}</td>
                <td>{{ $membre->email }}</td>
                <td>{{ $membre->telephone ?? 'N/A' }}</td>
                <td>{{ optional($membre->date_inscription)->format('d/m/Y') ?? 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Document généré le {{ date('d/m/Y à H:i') }} - Agora App
    </div>
</body>
</html>