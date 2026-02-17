const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            'osm': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap contributors'
            },
            'buildings-source': {
                type: 'vector',
                tiles: [window.location.origin + '/tiles/{z}/{x}/{y}.mvt'],
                minzoom: 12,
                maxzoom: 20
            }
        },
        layers: [
            {
                id: 'osm-layer',
                type: 'raster',
                source: 'osm'
            },
            {
                id: 'buildings-extrusion',
                type: 'fill-extrusion',
                source: 'buildings-source',
                'source-layer': 'buildings',
                paint: {
                    'fill-extrusion-color': [
                        'match',
                        ['get', 'rev_normat'],
                        'respeta la normatividad', '#2ecc71',
                        'igual a la normatividad', '#f1c40f',
                        'fuera de la normatividad', '#e74c3c',
                        'sin información normativa', '#95a5a6',
                        '#ccc'
                    ],
                    'fill-extrusion-height': [
                        '*',
                        ['coalesce', ['get', 'niv_const'], 1],
                        3 // 3 meters per level
                    ],
                    'fill-extrusion-base': 0,
                    'fill-extrusion-opacity': 0.8
                }
            }
        ]
    },
    center: [-99.18832, 19.40754], // Center on the data centroid
    zoom: 16,
    pitch: 45,
    bearing: -17
});

map.addControl(new maplibregl.NavigationControl());

map.on('click', 'buildings-extrusion', (e) => {
    const props = e.features[0].properties;
    new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
            <strong>Cuenta Catastral:</strong> ${props.cta_catast}<br>
            <strong>Colonia:</strong> ${props.colonia}<br>
            <strong>Zonificación:</strong> ${props.zonif}<br>
            <strong>Niveles Permitidos:</strong> ${props.niv_norm}<br>
            <strong>Niveles Construidos:</strong> ${props.niv_const}<br>
            <strong>Estatus:</strong> ${props.rev_normat}
        `)
        .addTo(map);
});

map.on('mouseenter', 'buildings-extrusion', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'buildings-extrusion', () => {
    map.getCanvas().style.cursor = '';
});
