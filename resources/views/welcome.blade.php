<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'ITO') }}</title>
    @vite(['resources/react/App.tsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
