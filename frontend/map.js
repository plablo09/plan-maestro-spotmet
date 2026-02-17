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
                    'fill-extrusion-base': 0,
                    'fill-extrusion-opacity': 0.8
                }
            }
        ]
    },
    center: [-99.17137, 19.40198],
    zoom: 13.65,
    pitch: 56,
    bearing: 12.8
});

const steps = [
    {
        id: 0,
        title: 'Paso 1: Zonificación Máxima',
        description: 'Muestra el máximo de niveles permitidos por la normativa vigente para cada predio.',
        legendTitle: 'Barrios/Colonias',
        getStyle: () => ({
            height: ['*', ['coalesce', ['get', 'niv_norm'], 0], 3],
            color: [
                'match',
                ['get', 'colonia'],
                'Hipódromo', '#1abc9c',
                'Condesa', '#3498db',
                'Hipódromo Condesa', '#9b59b6',
                'Buenos Aires', '#f1c40f',
                'San Miguel Chapultepec II Sección', '#e67e22',
                'Escandón II Sección', '#e74c3c',
                'Escandón I Sección', '#ecf0f1',
                'Doctores', '#95a5a6',
                'Roma Norte', '#2c3e50',
                'Juárez', '#d35400',
                'San Miguel Chapultepec I Sección', '#7f8c8d',
                'Roma Sur', '#16a085',
                '#ccc' // Default color for others
            ]
        })
    },
    {
        id: 1,
        title: 'Paso 2: Realidad Actual',
        description: 'Niveles construidos actualmente, coloreados por su estatus de cumplimiento normativo.',
        legendTitle: 'Cumplimiento',
        legendItems: [
            { label: 'Respeta la normatividad', color: '#2ecc71' },
            { label: 'Igual a la normatividad', color: '#f1c40f' },
            { label: 'Fuera de la normatividad', color: '#e74c3c' },
            { label: 'Sin información normativa', color: '#95a5a6' }
        ],
        getStyle: () => ({
            height: ['*', ['coalesce', ['get', 'niv_const'], 0], 3],
            color: [
                'match',
                ['get', 'rev_normat'],
                'respeta la normatividad', '#2ecc71',
                'igual a la normatividad', '#f1c40f',
                'fuera de la normatividad', '#e74c3c',
                'sin información normativa', '#95a5a6',
                '#ccc'
            ]
        })
    },
    {
        id: 2,
        title: 'Paso 3: Potencial Disponible',
        description: 'Niveles que aún pueden construirse. Rojo indica predios que ya superaron el límite permitido.',
        legendTitle: 'Disponibilidad',
        legendItems: [
            { label: 'Capacidad disponible', color: '#3498db' },
            { label: 'Excede normatividad (Sin extrusión)', color: '#e74c3c' }
        ],
        getStyle: () => ({
            height: [
                'max',
                0,
                ['*', ['-', ['get', 'niv_norm'], ['get', 'niv_const']], 3]
            ],
            color: [
                'case',
                ['>', ['get', 'niv_const'], ['get', 'niv_norm']], '#e74c3c', // Exceeds
                '#3498db' // Available
            ]
        })
    }
];

let currentStepIndex = 0;

function updateMap() {
    const step = steps[currentStepIndex];
    const style = step.getStyle();

    map.setPaintProperty('buildings-extrusion', 'fill-extrusion-height', style.height);
    map.setPaintProperty('buildings-extrusion', 'fill-extrusion-color', style.color);

    document.getElementById('stepTitle').innerText = step.title;
    document.getElementById('stepDescription').innerText = step.description;
    document.getElementById('legendTitle').innerText = step.legendTitle;

    const legendItemsDiv = document.getElementById('legendItems');
    legendItemsDiv.innerHTML = '';
    
    if (step.legendItems) {
        step.legendItems.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `<span style="background-color: ${item.color}"></span>${item.label}`;
            legendItemsDiv.appendChild(div);
        });
    } else if (currentStepIndex === 0) {
        legendItemsDiv.innerHTML = '<div>Colores por colonia principal.</div>';
    }
}

map.on('load', () => {
    updateMap();
});

document.getElementById('prevStep').addEventListener('click', () => {
    currentStepIndex = (currentStepIndex - 1 + steps.length) % steps.length;
    updateMap();
});

document.getElementById('nextStep').addEventListener('click', () => {
    currentStepIndex = (currentStepIndex + 1) % steps.length;
    updateMap();
});

map.addControl(new maplibregl.NavigationControl());

map.on('click', 'buildings-extrusion', (e) => {
    const props = e.features[0].properties;
    const diff = props.niv_norm - props.niv_const;
    const diffText = diff > 0 ? `${diff.toFixed(1)} niveles disponibles` : (diff < 0 ? `${Math.abs(diff).toFixed(1)} niveles excedidos` : 'Sin diferencia');

    new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
            <strong>Cuenta Catastral:</strong> ${props.cta_catast}<br>
            <strong>Colonia:</strong> ${props.colonia}<br>
            <strong>Zonificación:</strong> ${props.zonif}<br>
            <strong>Niveles Permitidos:</strong> ${props.niv_norm}<br>
            <strong>Niveles Construidos:</strong> ${props.niv_const}<br>
            <strong>Diferencia:</strong> ${diffText}<br>
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
