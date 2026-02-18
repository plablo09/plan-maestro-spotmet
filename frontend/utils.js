export function formatVolume(m3) {
    if (m3 >= 1000000) return (m3 / 1000000).toFixed(2) + 'M m³';
    if (m3 >= 1000) return (m3 / 1000).toFixed(1) + 'k m³';
    return Math.round(m3) + ' m³';
}
