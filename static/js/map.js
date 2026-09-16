// GIS Risk Map JavaScript for Srivilliputhur Municipality Drainage Prototype

function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  if (typeof L === 'undefined') {
    console.warn('Leaflet not yet available, retrying in 100ms...');
    setTimeout(initMap, 100);
    return;
  }

  // Prevent multiple initializations if already initialized
  if (mapElement._leaflet_id) {
    return;
  }

  // Center on Srivilliputhur Municipality (Andal Temple / Town Center)
  const centerLat = 9.5088;
  const centerLng = 77.6307;
  const map = L.map('map', {
    center: [centerLat, centerLng],
    zoom: 14,
    zoomControl: true
  });

  // Base Tile Layer - CartoDB Voyager tiles (Highly reliable on cloud hosting & SSL)
  const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Invalidate size after brief delays to guarantee proper container sizing
  setTimeout(() => map.invalidateSize(), 150);
  setTimeout(() => map.invalidateSize(), 500);

  // Layer Groups
  const syntheticLayer = L.layerGroup().addTo(map);
  const verifiedDrainLayer = L.layerGroup().addTo(map);
  const incidentsLayer = L.layerGroup().addTo(map);

  // Custom Pin Generator
  function createCustomIcon(color, iconClass) {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 12px;">
              <i class="${iconClass}"></i>
             </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });
  }

  const greenIcon = createCustomIcon('#10b981', 'fa-solid fa-check');
  const amberIcon = createCustomIcon('#f59e0b', 'fa-solid fa-triangle-exclamation');
  const blueIcon = createCustomIcon('#0284c7', 'fa-solid fa-faucet');
  const purpleIcon = createCustomIcon('#8b5cf6', 'fa-solid fa-newspaper');

  // 1. Plot Synthetic Points
  if (window.SYNTHETIC_POINTS && Array.isArray(window.SYNTHETIC_POINTS)) {
    window.SYNTHETIC_POINTS.forEach(pt => {
      if (pt.latitude && pt.longitude) {
        const isMedium = pt.overflow_risk_label === 'MEDIUM';
        const icon = isMedium ? amberIcon : greenIcon;
        const riskBadge = isMedium ? '<span class="badge-risk-medium">MEDIUM RISK</span>' : '<span class="badge-risk-low">LOW RISK</span>';

        const popupContent = `
          <div class="text-xs p-1">
            <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-2">
              <span class="font-bold text-slate-900">${pt.drain_id}</span>
              ${riskBadge}
            </div>
            <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] mb-2">
              <div><span class="text-slate-500">Ward:</span> <strong>Ward ${pt.ward_no}</strong></div>
              <div><span class="text-slate-500">Street:</span> ${pt.street_name || 'Not Available'}</div>
              <div><span class="text-slate-500">Drain Type:</span> ${pt.drain_type}</div>
              <div><span class="text-slate-500">Blockage:</span> <strong>${pt.blockage_percent}%</strong></div>
              <div><span class="text-slate-500">Plastic Level:</span> ${pt.plastic_accumulation_level} (Score ${pt.plastic_accumulation_score})</div>
              <div><span class="text-slate-500">Water Depth:</span> ${pt.water_level_cm} cm</div>
              <div><span class="text-slate-500">Cleaning:</span> ${pt.days_since_cleaning} days ago</div>
              <div><span class="text-slate-500">Dimensions:</span> ${pt.drain_width_m}m × ${pt.drain_depth_m}m</div>
            </div>
            <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span class="badge-status-synthetic">SYNTHETIC_PROTOTYPE</span>
              <span class="text-slate-400">Layer 2 Synthetic Data</span>
            </div>
          </div>
        `;

        const marker = L.marker([pt.latitude, pt.longitude], { icon: icon }).bindPopup(popupContent);
        marker.riskLevel = pt.overflow_risk_label;
        syntheticLayer.addLayer(marker);
      }
    });
  }

  // 2. Plot Verified Drainage (Tender Drain in Ward 32)
  if (window.VERIFIED_DRAINS && Array.isArray(window.VERIFIED_DRAINS)) {
    window.VERIFIED_DRAINS.forEach(d => {
      const popupContent = `
        <div class="text-xs p-1">
          <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-2">
            <span class="font-bold text-slate-900">${d.drain_id}</span>
            <span class="badge-status-verified">VERIFIED_PUBLIC</span>
          </div>
          <div class="text-[11px] space-y-1 mb-2">
            <div><span class="text-slate-500">Ward:</span> <strong>Ward ${d.ward_no}</strong></div>
            <div><span class="text-slate-500">Street:</span> ${d.street_name}</div>
            <div><span class="text-slate-500">Drain Type:</span> ${d.drain_type}</div>
            <div><span class="text-slate-500">Dimensions:</span> Length ${d.drain_length_m}m | ${d.drain_width_m}m × ${d.drain_depth_m}m</div>
            <div><span class="text-slate-500">Culverts:</span> ${d.culvert_count}</div>
            <div><span class="text-slate-500">Source:</span> ${d.source}</div>
          </div>
          <div class="p-1.5 bg-sky-50 rounded text-[10px] text-sky-800">
            <strong>Official Tender Record:</strong> Road & Storm Water Drain Construction Tender.
          </div>
        </div>
      `;
      const marker = L.marker([9.5042, 77.6358], { icon: blueIcon }).bindPopup(popupContent);
      verifiedDrainLayer.addLayer(marker);
    });
  }

  // 3. Representative Historical Incidents (Landmarks)
  const historicalPins = [
    { name: "Bus Stand & Uzhavar Santhai", desc: "Waterlogging & sewage overflow on roads (2026-02-24)", lat: 9.5122, lng: 77.6285, cause: "Blocked drains and silt" },
    { name: "Madavarvilagam Vaithyanatha Swamy Temple", desc: "Temple flooding / Waterlogging (2024-12-17)", lat: 9.5188, lng: 77.6251, cause: "Heavy rain (~2 hours)" },
    { name: "Andal Temple Bazaar Streets", desc: "Heavy rain / Infrastructure damage (2021-07-07)", lat: 9.5152, lng: 77.6325, cause: "Heavy rain with wind" },
    { name: "Kulalar Street & Ottamadam", desc: "House collapse & flooding (2021-12-06)", lat: 9.5065, lng: 77.6310, cause: "Continuous heavy rain" }
  ];

  historicalPins.forEach(p => {
    const popupContent = `
      <div class="text-xs p-1">
        <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-2">
          <span class="font-bold text-slate-900">${p.name}</span>
          <span class="badge-status-historical">HISTORICAL_PUBLIC</span>
        </div>
        <div class="text-[11px] space-y-1 mb-2">
          <div><span class="text-slate-500">Event:</span> ${p.desc}</div>
          <div><span class="text-slate-500">Cause Stated:</span> <strong>${p.cause}</strong></div>
          <div class="text-slate-500 text-[10px] italic">Landmark Reference | Source: News report</div>
        </div>
      </div>
    `;
    const marker = L.marker([p.lat, p.lng], { icon: purpleIcon }).bindPopup(popupContent);
    incidentsLayer.addLayer(marker);
  });

  // Filter controls
  document.getElementById('filter-all')?.addEventListener('click', function () {
    syntheticLayer.eachLayer(l => l.setOpacity(1));
    setActiveFilter(this);
  });

  document.getElementById('filter-medium')?.addEventListener('click', function () {
    syntheticLayer.eachLayer(l => {
      l.setOpacity(l.riskLevel === 'MEDIUM' ? 1 : 0);
    });
    setActiveFilter(this);
  });

  document.getElementById('filter-low')?.addEventListener('click', function () {
    syntheticLayer.eachLayer(l => {
      l.setOpacity(l.riskLevel === 'LOW' ? 1 : 0);
    });
    setActiveFilter(this);
  });

  document.getElementById('toggle-verified')?.addEventListener('change', function () {
    if (this.checked) map.addLayer(verifiedDrainLayer);
    else map.removeLayer(verifiedDrainLayer);
  });

  document.getElementById('toggle-incidents')?.addEventListener('change', function () {
    if (this.checked) map.addLayer(incidentsLayer);
    else map.removeLayer(incidentsLayer);
  });

  function setActiveFilter(btn) {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('bg-teal-700', 'text-white');
      b.classList.add('bg-slate-100', 'text-slate-700');
    });
    btn.classList.add('bg-teal-700', 'text-white');
    btn.classList.remove('bg-slate-100', 'text-slate-700');
  }
}

// Immediate execution if DOM is ready, or on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
