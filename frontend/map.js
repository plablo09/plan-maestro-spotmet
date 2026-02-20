import { formatVolume } from './utils.js';

// Neighborhood color mapping (Paired 12 palette)
const coloniaPalette = {
    'Hipódromo': '#a6cee3',
    'Condesa': '#1f78b4',
    'Hipódromo Condesa': '#b2df8a',
    'Buenos Aires': '#33a02c',
    'Roma Norte': '#fb9a99',
    'Roma Sur': '#e31a1c',
    'Escandón I Sección': '#fdbf6f',
    'Escandón II Sección': '#ff7f00',
    'San Miguel Chapultepec I Sección': '#cab2d6',
    'San Miguel Chapultepec II Sección': '#6a3d9a',
    'Doctores': '#ffff99',
    'Juárez': '#b15928',
    'Otras': '#ccc'
};

const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            'osm': {
                type: 'raster',
                tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
                tileSize: 256,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            'buildings-source': {
                type: 'vector',
                tiles: [window.location.origin + '/tiles/{z}/{x}/{y}.mvt?v=1.9'],
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
                    'fill-extrusion-opacity': 0.7
                }
            }
        ]
    },
    center: [-99.17137, 19.40198],
    zoom: 14.75,
    pitch: 56,
    bearing: 12.8
});

const steps = [
    {
        id: 0,
        title: 'Normatividad Base',
        description: 'Muestra el máximo de niveles permitidos por la normativa vigente para cada predio.',
        legendTitle: 'Barrios/Colonias',
        statsLabel: 'Volumen Total Permitido:',
        legendItems: [
            { label: 'Hipódromo', color: coloniaPalette['Hipódromo'] },
            { label: 'Condesa', color: coloniaPalette['Condesa'] },
            { label: 'Hipódromo Condesa', color: coloniaPalette['Hipódromo Condesa'] },
            { label: 'Buenos Aires', color: coloniaPalette['Buenos Aires'] },
            { label: 'Roma Norte', color: coloniaPalette['Roma Norte'] },
            { label: 'Roma Sur', color: coloniaPalette['Roma Sur'] },
            { label: 'Escandón I', color: coloniaPalette['Escandón I Sección'] },
            { label: 'Escandón II', color: coloniaPalette['Escandón II Sección'] },
            { label: 'S.M. Chapultepec I', color: coloniaPalette['San Miguel Chapultepec I Sección'] },
            { label: 'S.M. Chapultepec II', color: coloniaPalette['San Miguel Chapultepec II Sección'] },
            { label: 'Otras', color: coloniaPalette['Otras'] }
        ],
        getStyle: () => ({
            height: ['*', ['coalesce', ['get', 'niv_norm'], 0], 3],
            color: [
                'match',
                ['get', 'colonia'],
                'Hipódromo', coloniaPalette['Hipódromo'],
                'Condesa', coloniaPalette['Condesa'],
                'Hipódromo Condesa', coloniaPalette['Hipódromo Condesa'],
                'Buenos Aires', coloniaPalette['Buenos Aires'],
                'Roma Norte', coloniaPalette['Roma Norte'],
                'Roma Sur', coloniaPalette['Roma Sur'],
                'Escandón I Sección', coloniaPalette['Escandón I Sección'],
                'Escandón II Sección', coloniaPalette['Escandón II Sección'],
                'San Miguel Chapultepec I Sección', coloniaPalette['San Miguel Chapultepec I Sección'],
                'San Miguel Chapultepec II Sección', coloniaPalette['San Miguel Chapultepec II Sección'],
                'Doctores', coloniaPalette['Doctores'],
                'Juárez', coloniaPalette['Juárez'],
                coloniaPalette['Otras']
            ]
        }),
        calculateStats: (features) => {
            let totalVol = 0;
            const seen = new Set();
            features.forEach(f => {
                const id = f.properties.cta_catast;
                if (id && !seen.has(id)) {
                    const area = parseFloat(f.properties.lot_area) || 0;
                    const levels = parseFloat(f.properties.niv_norm) || 0;
                    totalVol += area * levels * 3;
                    seen.add(id);
                }
            });
            return totalVol;
        }
    },
    {
        id: 1,
        title: 'Realidad Registrada',
        description: 'Lo que dice el Catastro: Niveles construidos según los registros oficiales, coloreados por su cumplimiento normativo.',
        legendTitle: 'Cumplimiento',
        statsLabel: 'Volumen Total Registrado:',
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
        }),
        calculateStats: (features) => {
            let totalVol = 0;
            const seen = new Set();
            features.forEach(f => {
                const id = f.properties.cta_catast;
                if (id && !seen.has(id)) {
                    const area = parseFloat(f.properties.lot_area) || 0;
                    const levels = parseFloat(f.properties.niv_const) || 0;
                    totalVol += area * levels * 3;
                    seen.add(id);
                }
            });
            return totalVol;
        }
    },
    {
        id: 2,
        title: 'Brecha de Cumplimiento',
        description: 'El potencial disponible o excedido: Visualización de la diferencia entre la norma y el registro catastral.',
        legendTitle: 'Disponibilidad',
        statsLabel: 'Volumen de Potencial Disponible:',
        legendItems: [
            { label: 'Capacidad disponible', color: '#3498db' },
            { label: 'Excede normatividad (Sin extrusión)', color: '#e74c3c' }
        ],
        getStyle: () => ({
            height: ['max', 0, ['*', ['-', ['coalesce', ['get', 'niv_norm'], 0], ['coalesce', ['get', 'niv_const'], 0]], 3]],
            color: [
                'case',
                ['>', ['coalesce', ['get', 'niv_const'], 0], ['coalesce', ['get', 'niv_norm'], 0]], '#e74c3c',
                '#3498db'
            ]
        }),
        calculateStats: (features) => {
            let totalVol = 0;
            const seen = new Set();
            features.forEach(f => {
                const id = f.properties.cta_catast;
                if (id && !seen.has(id)) {
                    const area = parseFloat(f.properties.lot_area) || 0;
                    const diff = (parseFloat(f.properties.niv_norm) || 0) - (parseFloat(f.properties.niv_const) || 0);
                    if (diff > 0) {
                        totalVol += area * diff * 3;
                    }
                    seen.add(id);
                }
            });
            return totalVol;
        }
    }
];

let currentStepIndex = 0;
let appMode = 'narrative'; // 'narrative' or 'explorer'

function updateModeUI() {
    const isNarrative = appMode === 'narrative';
    
    // Update buttons
    document.getElementById('btnNarrative').classList.toggle('active', isNarrative);
    document.getElementById('btnExplorer').classList.toggle('active', !isNarrative);
    
    // Update content panels
    document.getElementById('narrativeControls').classList.toggle('active', isNarrative);
    document.getElementById('explorerControls').classList.toggle('active', !isNarrative);
    
    updateMap();
}

function setRadioValue(name, value) {
    const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radio) radio.checked = true;
}

function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : null;
}

document.getElementById('btnNarrative').addEventListener('click', () => {
    appMode = 'narrative';
    updateModeUI();
});

document.getElementById('btnExplorer').addEventListener('click', () => {
    // Sync radios with current step state before switching
    if (appMode === 'narrative') {
        if (currentStepIndex === 0) {
            setRadioValue('height', 'normativa');
            setRadioValue('color', 'barrios');
        } else if (currentStepIndex === 1) {
            setRadioValue('height', 'registro');
            setRadioValue('color', 'cumplimiento');
        } else {
            setRadioValue('height', 'brecha');
            setRadioValue('color', 'disponibilidad');
        }
    }
    appMode = 'explorer';
    updateModeUI();
});

document.getElementById('groupHeight').addEventListener('change', updateMap);
document.getElementById('groupColor').addEventListener('change', updateMap);

function updateStats() {
    if (!map.isStyleLoaded()) return;
    
    let totalVolume = 0;
    let label = "";
    
    if (appMode === 'narrative') {
        const step = steps[currentStepIndex];
        const features = map.queryRenderedFeatures({ layers: ['buildings-extrusion'] });
        totalVolume = step.calculateStats(features);
        label = step.statsLabel;
    } else {
        const heightType = getRadioValue('height');
        const features = map.queryRenderedFeatures({ layers: ['buildings-extrusion'] });
        
        const seen = new Set();
        features.forEach(f => {
            const id = f.properties.cta_catast;
            if (id && !seen.has(id)) {
                const area = parseFloat(f.properties.lot_area) || 0;
                let val = 0;
                if (heightType === 'normativa') val = parseFloat(f.properties.niv_norm) || 0;
                else if (heightType === 'registro') val = parseFloat(f.properties.niv_const) || 0;
                else if (heightType === 'brecha') {
                    const diff = (parseFloat(f.properties.niv_norm) || 0) - (parseFloat(f.properties.niv_const) || 0);
                    val = Math.max(0, diff);
                }
                totalVolume += area * val * 3;
                seen.add(id);
            }
        });
        
        const heightLabels = {
            'none': 'Área total (Plano):',
            'normativa': 'Volumen Total Permitido:',
            'registro': 'Volumen Total Registrado:',
            'brecha': 'Volumen de Potencial Disponible:'
        };
        label = heightLabels[heightType];
    }
    
    document.getElementById('statsLabel').innerText = label;
    document.getElementById('statsValue').innerText = formatVolume(totalVolume);
}

function updateMap() {
    if (!map.isStyleLoaded()) return;

    let heightStyle, colorStyle, title, description, legendTitle, legendItems;

    if (appMode === 'narrative') {
        const step = steps[currentStepIndex];
        const style = step.getStyle();
        heightStyle = style.height;
        colorStyle = style.color;
        title = step.title;
        description = step.description;
        legendTitle = step.legendTitle;
        legendItems = step.legendItems;
    } else {
        const heightType = getRadioValue('height');
        const colorType = getRadioValue('color');

        // Heights
        if (heightType === 'none') heightStyle = 0;
        else if (heightType === 'normativa') heightStyle = ['*', ['coalesce', ['get', 'niv_norm'], 0], 3];
        else if (heightType === 'registro') heightStyle = ['*', ['coalesce', ['get', 'niv_const'], 0], 3];
        else if (heightType === 'brecha') heightStyle = ['max', 0, ['*', ['-', ['coalesce', ['get', 'niv_norm'], 0], ['coalesce', ['get', 'niv_const'], 0]], 3]];

        // Colors
        if (colorType === 'barrios') {
            colorStyle = [
                'match', ['get', 'colonia'],
                'Hipódromo', coloniaPalette['Hipódromo'],
                'Condesa', coloniaPalette['Condesa'],
                'Hipódromo Condesa', coloniaPalette['Hipódromo Condesa'],
                'Buenos Aires', coloniaPalette['Buenos Aires'],
                'Roma Norte', coloniaPalette['Roma Norte'],
                'Roma Sur', coloniaPalette['Roma Sur'],
                'Escandón I Sección', coloniaPalette['Escandón I Sección'],
                'Escandón II Sección', coloniaPalette['Escandón II Sección'],
                'San Miguel Chapultepec I Sección', coloniaPalette['San Miguel Chapultepec I Sección'],
                'San Miguel Chapultepec II Sección', coloniaPalette['San Miguel Chapultepec II Sección'],
                'Doctores', coloniaPalette['Doctores'],
                'Juárez', coloniaPalette['Juárez'],
                coloniaPalette['Otras']
            ];
            legendTitle = 'Barrios/Colonias';
            legendItems = [
                { label: 'Hipódromo', color: coloniaPalette['Hipódromo'] },
                { label: 'Condesa', color: coloniaPalette['Condesa'] },
                { label: 'Roma', color: coloniaPalette['Roma Norte'] },
                { label: 'Escandón', color: coloniaPalette['Escandón II Sección'] },
                { label: 'S.M. Chapultepec', color: coloniaPalette['San Miguel Chapultepec II Sección'] },
                { label: 'Otras', color: coloniaPalette['Otras'] }
            ];
        } else if (colorType === 'cumplimiento') {
            colorStyle = [
                'match', ['get', 'rev_normat'],
                'respeta la normatividad', '#2ecc71',
                'igual a la normatividad', '#f1c40f',
                'fuera de la normatividad', '#e74c3c',
                'sin información normativa', '#95a5a6',
                '#ccc'
            ];
            legendTitle = 'Cumplimiento';
            legendItems = [
                { label: 'Respeta', color: '#2ecc71' },
                { label: 'Igual', color: '#f1c40f' },
                { label: 'Fuera', color: '#e74c3c' },
                { label: 'S/I', color: '#95a5a6' }
            ];
        } else {
            colorStyle = [
                'case',
                ['>', ['coalesce', ['get', 'niv_const'], 0], ['coalesce', ['get', 'niv_norm'], 0]], '#e74c3c',
                '#3498db'
            ];
            legendTitle = 'Disponibilidad';
            legendItems = [
                { label: 'Disponible', color: '#3498db' },
                { label: 'Excede', color: '#e74c3c' }
            ];
        }
    }

    map.setPaintProperty('buildings-extrusion', 'fill-extrusion-height', heightStyle);
    map.setPaintProperty('buildings-extrusion', 'fill-extrusion-color', colorStyle);

    if (appMode === 'narrative') {
        document.getElementById('stepTitle').innerText = title;
        document.getElementById('stepDescription').innerText = description;
    }
    
    document.getElementById('legendTitle').innerText = legendTitle;
    const legendItemsDiv = document.getElementById('legendItems');
    legendItemsDiv.innerHTML = '';
    if (legendItems) {
        legendItems.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `<span style="background-color: ${item.color}"></span>${item.label}`;
            legendItemsDiv.appendChild(div);
        });
    }
    
    updateStats();
}

document.getElementById('btnCloseIntro').addEventListener('click', () => {
    document.getElementById('introOverlay').classList.add('hidden');
});

document.getElementById('btnHelp').addEventListener('click', () => {
    document.getElementById('introOverlay').classList.remove('hidden');
});

map.on('load', () => {
    updateMap();
    map.on('moveend', updateStats);
    map.on('idle', updateStats);
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
    const norm = props.niv_norm || 0;
    const constr = props.niv_const || 0;
    const diff = norm - constr;
    
    let comparisonLine = '';
    if (currentStepIndex === 0) {
        comparisonLine = `<strong>Niveles Permitidos:</strong> ${norm}`;
    } else if (currentStepIndex === 1) {
        comparisonLine = `<strong>Niveles Registrados:</strong> ${constr}<br><strong>Estatus:</strong> ${props.rev_normat}`;
    } else {
        const diffText = diff > 0 ? `${diff.toFixed(1)} niveles disponibles` : (diff < 0 ? `${Math.abs(diff).toFixed(1)} niveles excedidos` : 'Cumplimiento exacto');
        comparisonLine = `<strong>Brecha:</strong> ${diffText}<br><strong>Norma:</strong> ${norm} vs <strong>Realidad:</strong> ${constr}`;
    }

    new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
            <div class="popup-content">
                <div class="popup-header">${props.colonia}</div>
                <strong>Cuenta:</strong> ${props.cta_catast}<br>
                <strong>Zonificación:</strong> ${props.zonif}<br>
                <strong>Área:</strong> ${props.lot_area ? Math.round(props.lot_area) : 'N/A'} m²<br>
                <hr>
                ${comparisonLine}
            </div>
        `)
        .addTo(map);
});

map.on('mouseenter', 'buildings-extrusion', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'buildings-extrusion', () => {
    map.getCanvas().style.cursor = '';
});
