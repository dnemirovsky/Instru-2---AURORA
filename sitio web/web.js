/**
 * VigilaDrive - Plataforma de Monitoreo de Somnolencia en Tiempo Real
 * Módulo Principal de Control y Simulación de Telemetría
 * 
 * NOTA PARA DESARROLLO FUTURO:
 * La variable `driversData` contiene los registros ficticios. Para conectar
 * con una base de datos o API REST/WebSocket, reemplace la carga inicial por:
 * fetch('/api/conductores').then(...) o websocket.onmessage = (event) => ...
 */

// ============================================================================
// 1. DATOS FICTICIOS INICIALES (Flota de transporte en ruta)
// ============================================================================
let driversData = [
  {
    id: "DRV-101",
    name: "Carlos Benítez",
    license: "B2-993821",
    vehicle: "Scania R450 - Semi Tolva",
    plate: "AF 421 PL",
    route: "Rosario → Buenos Aires (RN 9)",
    status: "normal", // 'normal' | 'precaucion' | 'alerta'
    fatigueScore: 12, // Porcentaje de fatiga 0-100
    perclos: 3.8,     // % Cierre ocular PERCLOS
    blinkRate: 17,    // Parpadeos por minuto
    driveHours: "2h 10m",
    driveMinutesRaw: 130,
    microsleeps: 0,
    speed: "82 km/h",
    lastStop: "Hace 2h 10m (San Nicolás)",
    lastEvent: "Parámetros estables. Mirada atenta en carril.",
    lastEventTime: "16:14"
  },
  {
    id: "DRV-102",
    name: "Martín Rodríguez",
    license: "B2-882110",
    vehicle: "Mercedes Actros 2045 - Semi Térmico",
    plate: "AE 304 TR",
    route: "Córdoba → Rosario (Autopista 9)",
    status: "alerta",
    fatigueScore: 88,
    perclos: 22.4,
    blinkRate: 34,
    driveHours: "5h 40m",
    driveMinutesRaw: 340,
    microsleeps: 2,
    speed: "86 km/h",
    lastStop: "Hace 4h (Villa María)",
    lastEvent: "CRÍTICO: Microsueño detectado (1.8s) y desviación de carril.",
    lastEventTime: "16:18"
  },
  {
    id: "DRV-103",
    name: "Diego Albornoz",
    license: "B2-401924",
    vehicle: "Volvo FH 540 - B-Doble Cargas",
    plate: "AD 771 KL",
    route: "Mendoza → San Luis (RN 7)",
    status: "precaucion",
    fatigueScore: 54,
    perclos: 11.2,
    blinkRate: 26,
    driveHours: "3h 50m",
    driveMinutesRaw: 230,
    microsleeps: 0,
    speed: "79 km/h",
    lastStop: "Hace 3h (La Paz)",
    lastEvent: "3 bostezos seguidos y parpadeo lento detectado.",
    lastEventTime: "16:10"
  },
  {
    id: "DRV-104",
    name: "Lucía Ferraro",
    license: "B2-710293",
    vehicle: "Iveco Hi-Way 480 - Cisterna",
    plate: "AG 112 BB",
    route: "Bahía Blanca → Neuquén (RN 22)",
    status: "normal",
    fatigueScore: 18,
    perclos: 4.1,
    blinkRate: 19,
    driveHours: "1h 30m",
    driveMinutesRaw: 90,
    microsleeps: 0,
    speed: "80 km/h",
    lastStop: "Hace 1h 30m (Río Colorado)",
    lastEvent: "Conducción regular, atención constante en ruta.",
    lastEventTime: "16:05"
  },
  {
    id: "DRV-105",
    name: "Jorge Soria",
    license: "B2-663102",
    vehicle: "Scania R500 - Sider",
    plate: "AC 992 MN",
    route: "Mar del Plata → CABA (Autovía 2)",
    status: "precaucion",
    fatigueScore: 61,
    perclos: 13.5,
    blinkRate: 28,
    driveHours: "4h 15m",
    driveMinutesRaw: 255,
    microsleeps: 0,
    speed: "84 km/h",
    lastStop: "Hace 3h 15m (Dolores)",
    lastEvent: "Inclinación reiterada de cabeza detectada por cámara.",
    lastEventTime: "16:12"
  },
  {
    id: "DRV-106",
    name: "Gonzalo Morales",
    license: "B2-551098",
    vehicle: "Volkswagen Constellation - Furgón",
    plate: "AE 884 RT",
    route: "Santa Fe → Paraná (Túnel Subfluvial)",
    status: "normal",
    fatigueScore: 14,
    perclos: 3.2,
    blinkRate: 16,
    driveHours: "1h 10m",
    driveMinutesRaw: 70,
    microsleeps: 0,
    speed: "65 km/h",
    lastStop: "Hace 1h (Santa Fe Capital)",
    lastEvent: "Parámetros oculares normales.",
    lastEventTime: "15:58"
  },
  {
    id: "DRV-107",
    name: "Mariana Vega",
    license: "B2-990143",
    vehicle: "Mercedes Actros 2651 - Portacontenedor",
    plate: "AF 553 ZZ",
    route: "Zárate → Puerto Campana (RN 12)",
    status: "normal",
    fatigueScore: 9,
    perclos: 2.9,
    blinkRate: 18,
    driveHours: "0h 50m",
    driveMinutesRaw: 50,
    microsleeps: 0,
    speed: "72 km/h",
    lastStop: "Inicio de turno hace 50m",
    lastEvent: "Excelente nivel de atención. Sin incidencias.",
    lastEventTime: "16:02"
  },
  {
    id: "DRV-108",
    name: "Esteban Roldán",
    license: "B2-332901",
    vehicle: "Volvo FH 460 - Semi Abierto",
    plate: "AD 619 VC",
    route: "Tucumán → Salta (RN 9)",
    status: "alerta",
    fatigueScore: 92,
    perclos: 25.1,
    blinkRate: 36,
    driveHours: "6h 10m",
    driveMinutesRaw: 370,
    microsleeps: 3,
    speed: "78 km/h",
    lastStop: "Hace 5h 20m (Rosario de la Frontera)",
    lastEvent: "CRÍTICO: Cierre sostenido de párpados (>2.1s). Alarma activada.",
    lastEventTime: "16:16"
  },
  {
    id: "DRV-109",
    name: "Rodrigo Giménez",
    license: "B2-887412",
    vehicle: "Scania G410 - Grano Granel",
    plate: "AE 633 PQ",
    route: "Pergamino → Puerto San Martín (RN 188)",
    status: "normal",
    fatigueScore: 22,
    perclos: 4.8,
    blinkRate: 20,
    driveHours: "2h 45m",
    driveMinutesRaw: 165,
    microsleeps: 0,
    speed: "75 km/h",
    lastStop: "Hace 2h 45m (Pergamino)",
    lastEvent: "Conducción estable dentro de límites normales.",
    lastEventTime: "16:08"
  },
  {
    id: "DRV-110",
    name: "Facundo Gómez",
    license: "B2-771239",
    vehicle: "Iveco Stralis 440 - Paquetería",
    plate: "AC 450 HH",
    route: "San Juan → La Rioja (RN 40)",
    status: "precaucion",
    fatigueScore: 48,
    perclos: 10.4,
    blinkRate: 25,
    driveHours: "3h 30m",
    driveMinutesRaw: 210,
    microsleeps: 0,
    speed: "81 km/h",
    lastStop: "Hace 3h (Jáchal)",
    lastEvent: "Distracción lateral prolongada (>3s) y bostezo.",
    lastEventTime: "16:11"
  }
];

// Registro de eventos en vivo
let incidentEvents = [
  {
    id: "EV-1",
    driverId: "DRV-108",
    driverName: "Esteban Roldán",
    time: "16:16",
    type: "alerta",
    text: "Microsueño crítico detectado (>2.1s) en RN 9. Alarma en cabina activada preventivamente."
  },
  {
    id: "EV-2",
    driverId: "DRV-102",
    driverName: "Martín Rodríguez",
    time: "16:18",
    type: "alerta",
    text: "Pestañeo retardado y cabeceo leve registrado en Autopista Córdoba-Rosario."
  },
  {
    id: "EV-3",
    driverId: "DRV-105",
    driverName: "Jorge Soria",
    time: "16:12",
    type: "precaucion",
    text: "Inclinación de postura y bostezos reiterados detectados por el sensor de fatiga."
  },
  {
    id: "EV-4",
    driverId: "DRV-103",
    driverName: "Diego Albornoz",
    time: "16:10",
    type: "precaucion",
    text: "Bostezos continuos. Frecuencia de parpadeo se eleva a 26/min."
  }
];

// Base de datos histórica de alertas por conductor
let historyEvents = [
  {
    id: "HIST-1",
    timestamp: "04/09/2026 16:16",
    driverId: "DRV-108",
    driverName: "Esteban Roldán",
    vehicle: "Volvo FH 460",
    plate: "AD 619 VC",
    route: "Tucumán → Salta (RN 9)",
    eventType: "Microsueño Crítico",
    perclos: "25.1%",
    duration: "2.1s",
    severity: "alerta",
    actionTaken: "Alarma sonora en cabina emitida"
  },
  {
    id: "HIST-2",
    timestamp: "04/09/2026 16:18",
    driverId: "DRV-102",
    driverName: "Martín Rodríguez",
    vehicle: "Mercedes Actros 2045",
    plate: "AE 304 TR",
    route: "Córdoba → Rosario (Autopista 9)",
    eventType: "Cierre de párpados prolongado",
    perclos: "22.4%",
    duration: "1.8s",
    severity: "alerta",
    actionTaken: "Enlace de voz con cabina"
  },
  {
    id: "HIST-3",
    timestamp: "04/09/2026 16:12",
    driverId: "DRV-105",
    driverName: "Jorge Soria",
    vehicle: "Scania R500",
    plate: "AC 992 MN",
    route: "Mar del Plata → CABA (Autovía 2)",
    eventType: "Inclinación de cabeza reiterada",
    perclos: "13.5%",
    duration: "4.2s",
    severity: "precaucion",
    actionTaken: "Monitoreo preventivo continuado"
  },
  {
    id: "HIST-4",
    timestamp: "04/09/2026 16:10",
    driverId: "DRV-103",
    driverName: "Diego Albornoz",
    vehicle: "Volvo FH 540",
    plate: "AD 771 KL",
    route: "Mendoza → San Luis (RN 7)",
    eventType: "Frecuencia de parpadeo alterada (26/min)",
    perclos: "11.2%",
    duration: "30s",
    severity: "precaucion",
    actionTaken: "Aviso en pantalla de a bordo"
  },
  {
    id: "HIST-5",
    timestamp: "04/09/2026 15:45",
    driverId: "DRV-108",
    driverName: "Esteban Roldán",
    vehicle: "Volvo FH 460",
    plate: "AD 619 VC",
    route: "Tucumán → Salta (RN 9)",
    eventType: "Cabeceo lateral con vibración de asiento",
    perclos: "19.8%",
    duration: "1.6s",
    severity: "alerta",
    actionTaken: "Alarma sonora activada"
  },
  {
    id: "HIST-6",
    timestamp: "04/09/2026 15:30",
    driverId: "DRV-110",
    driverName: "Facundo Gómez",
    vehicle: "Iveco Stralis 440",
    plate: "AC 450 HH",
    route: "San Juan → La Rioja (RN 40)",
    eventType: "Pérdida de mirada frontal (>3s)",
    perclos: "10.4%",
    duration: "3.2s",
    severity: "precaucion",
    actionTaken: "Notificación de alerta en telemetría"
  },
  {
    id: "HIST-7",
    timestamp: "04/09/2026 14:15",
    driverId: "DRV-102",
    driverName: "Martín Rodríguez",
    vehicle: "Mercedes Actros 2045",
    plate: "AE 304 TR",
    route: "Córdoba → Rosario (Autopista 9)",
    eventType: "Microsueño inicial (1.4s)",
    perclos: "17.2%",
    duration: "1.4s",
    severity: "alerta",
    actionTaken: "Señal acústica emitida"
  },
  {
    id: "HIST-8",
    timestamp: "04/09/2026 13:50",
    driverId: "DRV-105",
    driverName: "Jorge Soria",
    vehicle: "Scania R500",
    plate: "AC 992 MN",
    route: "Mar del Plata → CABA (Autovía 2)",
    eventType: "3 bostezos continuos",
    perclos: "9.8%",
    duration: "15s",
    severity: "precaucion",
    actionTaken: "Registro preventivo"
  },
  {
    id: "HIST-9",
    timestamp: "04/09/2026 12:20",
    driverId: "DRV-101",
    driverName: "Carlos Benítez",
    vehicle: "Scania R450",
    plate: "AF 421 PL",
    route: "Rosario → Buenos Aires (RN 9)",
    eventType: "Pestañeo lento transitorio",
    perclos: "6.5%",
    duration: "2.0s",
    severity: "precaucion",
    actionTaken: "Sin intervención requerida"
  },
  {
    id: "HIST-10",
    timestamp: "03/09/2026 23:40",
    driverId: "DRV-108",
    driverName: "Esteban Roldán",
    vehicle: "Volvo FH 460",
    plate: "AD 619 VC",
    route: "Tucumán → Salta (RN 9)",
    eventType: "Microsueño en horario nocturno (2.4s)",
    perclos: "27.5%",
    duration: "2.4s",
    severity: "alerta",
    actionTaken: "Parada obligatoria de descanso ordenada"
  }
];

// ============================================================================
// 2. ESTADO DE LA APLICACIÓN
// ============================================================================
const state = {
  currentAppView: "inicio", // 'inicio' | 'historial' | 'alta'
  activeFilter: "all",      // 'all' | 'normal' | 'precaucion' | 'alerta'
  searchQuery: "",
  activeView: "grid",       // 'grid' | 'table'
  selectedDriver: null,
  simulationRunning: true,
  simulationInterval: null,
  clockInterval: null,

  // Filtros de Historial
  historyDriverFilter: "all",
  historySeverityFilter: "all",
  historySearchQuery: "",

  // Gráfico de Alarmas vs. Horas de Manejo
  chartDriverFilter: "all",
  chartMetricFilter: "all",
  chartHoveredIndex: null
};

// ============================================================================
// 3. REFERENCIAS AL DOM
// ============================================================================
const DOM = {
  // Navegación y Menú Desplegable
  navMenuBtn: document.getElementById("navMenuBtn"),
  navDropdownMenu: document.getElementById("navDropdownMenu"),
  navDropdownWrapper: document.getElementById("navDropdownWrapper"),
  currentViewLabel: document.getElementById("currentViewLabel"),
  dropdownItems: document.querySelectorAll(".dropdown-item"),
  views: {
    inicio: document.getElementById("viewInicio"),
    historial: document.getElementById("viewHistorial"),
    alta: document.getElementById("viewAlta")
  },

  // KPIs Inicio
  countTotal: document.getElementById("countTotal"),
  countNormal: document.getElementById("countNormal"),
  countWarning: document.getElementById("countWarning"),
  countDanger: document.getElementById("countDanger"),
  pctNormal: document.getElementById("pctNormal"),
  pctWarning: document.getElementById("pctWarning"),
  pctDanger: document.getElementById("pctDanger"),
  kpiCards: {
    all: document.getElementById("kpiTotalCard"),
    normal: document.getElementById("kpiNormalCard"),
    precaucion: document.getElementById("kpiWarningCard"),
    alerta: document.getElementById("kpiDangerCard")
  },

  // Controles Inicio
  searchInput: document.getElementById("searchInput"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  filterButtons: document.querySelectorAll(".filter-btn"),
  btnGridView: document.getElementById("btnGridView"),
  btnTableView: document.getElementById("btnTableView"),
  simToggleBtn: document.getElementById("simToggleBtn"),
  simToggleText: document.getElementById("simToggleText"),
  liveIndicator: document.getElementById("liveIndicator"),
  currentTime: document.getElementById("currentTime"),

  // Áreas de Contenido Inicio
  driversGrid: document.getElementById("driversGrid"),
  driversTableWrapper: document.getElementById("driversTableWrapper"),
  driversTableBody: document.getElementById("driversTableBody"),
  emptyState: document.getElementById("emptyState"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),

  // Feed de Eventos Inicio
  eventsList: document.getElementById("eventsList"),
  eventsCount: document.getElementById("eventsCount"),

  // Modal Detalle
  driverModal: document.getElementById("driverModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  modalAvatar: document.getElementById("modalAvatar"),
  modalDriverName: document.getElementById("modalDriverName"),
  modalDriverMeta: document.getElementById("modalDriverMeta"),
  modalStatusBanner: document.getElementById("modalStatusBanner"),
  modalStatusDot: document.getElementById("modalStatusDot"),
  modalStatusText: document.getElementById("modalStatusText"),
  modalStatusDesc: document.getElementById("modalStatusDesc"),
  modalScoreVal: document.getElementById("modalScoreVal"),
  modalPerclos: document.getElementById("modalPerclos"),
  modalBlinkRate: document.getElementById("modalBlinkRate"),
  modalDriveHours: document.getElementById("modalDriveHours"),
  modalMicrosleeps: document.getElementById("modalMicrosleeps"),
  modalRoute: document.getElementById("modalRoute"),
  modalVehicle: document.getElementById("modalVehicle"),
  modalSpeed: document.getElementById("modalSpeed"),
  modalLastStop: document.getElementById("modalLastStop"),
  btnSendCabinAlert: document.getElementById("btnSendCabinAlert"),
  btnCallCabin: document.getElementById("btnCallCabin"),
  btnAssignRestStop: document.getElementById("btnAssignRestStop"),
  actionFeedback: document.getElementById("actionFeedback"),

  // Controles y Elementos de Vista Historial
  historyDriverSelect: document.getElementById("historyDriverSelect"),
  historySeveritySelect: document.getElementById("historySeveritySelect"),
  historySearchInput: document.getElementById("historySearchInput"),
  hkpiTotal: document.getElementById("hkpiTotal"),
  hkpiMicrosleeps: document.getElementById("hkpiMicrosleeps"),
  hkpiWarnings: document.getElementById("hkpiWarnings"),
  hkpiActions: document.getElementById("hkpiActions"),
  historyTableBody: document.getElementById("historyTableBody"),
  historyEmptyState: document.getElementById("historyEmptyState"),

  // Gráfico de Alarmas vs Tiempo de Conducción
  chartDriverSelect: document.getElementById("chartDriverSelect"),
  chartMetricPills: document.querySelectorAll("#chartMetricPills .chart-pill"),
  fatigueTimeCanvas: document.getElementById("fatigueTimeCanvas"),
  chartCanvasWrapper: document.getElementById("chartCanvasWrapper"),
  chartTooltip: document.getElementById("chartTooltip"),
  chartInsightBar: document.getElementById("chartInsightBar"),
  chartInsightBadge: document.getElementById("chartInsightBadge"),
  chartInsightText: document.getElementById("chartInsightText"),
  chartFleetCount: document.getElementById("chartFleetCount"),
  legendDriverItem: document.getElementById("legendDriverItem"),
  chartLegendDriverName: document.getElementById("chartLegendDriverName"),

  // Controles y Elementos de Vista Alta de Conductor
  newDriverForm: document.getElementById("newDriverForm"),
  formDriverName: document.getElementById("formDriverName"),
  formDriverLicense: document.getElementById("formDriverLicense"),
  formDriverVehicle: document.getElementById("formDriverVehicle"),
  formDriverPlate: document.getElementById("formDriverPlate"),
  formDriverRoute: document.getElementById("formDriverRoute"),
  formDriveHours: document.getElementById("formDriveHours"),
  formDriverStatus: document.getElementById("formDriverStatus"),
  formDriverFatigue: document.getElementById("formDriverFatigue"),
  fatigueValDisplay: document.getElementById("fatigueValDisplay"),
  formDriverNotes: document.getElementById("formDriverNotes"),
  btnCancelAlta: document.getElementById("btnCancelAlta"),
  errDriverName: document.getElementById("errDriverName"),
  errDriverLicense: document.getElementById("errDriverLicense"),
  errDriverVehicle: document.getElementById("errDriverVehicle"),
  errDriverPlate: document.getElementById("errDriverPlate"),
  errDriverRoute: document.getElementById("errDriverRoute"),

  // Toasts
  toastContainer: document.getElementById("toastContainer")
};

// ============================================================================
// 4. INICIALIZACIÓN
// ============================================================================
function init() {
  startClock();
  setupNavigation();
  setupEventListeners();
  setupHistoryListeners();
  setupChartInteractivity();
  setupAltaForm();
  populateHistoryDriverSelect();
  populateChartDriverSelect();
  renderAll();
  startSimulation();
}

// ============================================================================
// 5. RENDERIZADO PRINCIPAL
// ============================================================================
function renderAll() {
  renderKPIs();
  renderDrivers();
  renderEvents();
}

/**
 * Actualiza los contadores globales y porcentajes de estado
 */
function renderKPIs() {
  const total = driversData.length;
  const normalCount = driversData.filter(d => d.status === "normal").length;
  const warningCount = driversData.filter(d => d.status === "precaucion").length;
  const dangerCount = driversData.filter(d => d.status === "alerta").length;

  DOM.countTotal.textContent = total;
  DOM.countNormal.textContent = normalCount;
  DOM.countWarning.textContent = warningCount;
  DOM.countDanger.textContent = dangerCount;

  DOM.pctNormal.textContent = total > 0 ? `${Math.round((normalCount / total) * 100)}%` : "0%";
  DOM.pctWarning.textContent = total > 0 ? `${Math.round((warningCount / total) * 100)}%` : "0%";
  DOM.pctDanger.textContent = total > 0 ? `${Math.round((dangerCount / total) * 100)}%` : "0%";

  // Actualizar tarjeta activa
  Object.entries(DOM.kpiCards).forEach(([filterKey, cardEl]) => {
    if (cardEl) {
      if (state.activeFilter === filterKey) {
        cardEl.classList.add("active-filter");
      } else {
        cardEl.classList.remove("active-filter");
      }
    }
  });
}

/**
 * Filtra los conductores según el estado activo y la búsqueda de texto
 */
function getFilteredDrivers() {
  return driversData.filter(driver => {
    // Filtro por Estado
    const matchesStatus = (state.activeFilter === "all") || (driver.status === state.activeFilter);

    // Filtro por Texto (nombre, patente, vehículo o ruta)
    const query = state.searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      driver.name.toLowerCase().includes(query) ||
      driver.plate.toLowerCase().includes(query) ||
      driver.vehicle.toLowerCase().includes(query) ||
      driver.route.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });
}

/**
 * Renderiza la lista de conductores en modo cuadrícula o tabla
 */
function renderDrivers() {
  const filtered = getFilteredDrivers();

  if (filtered.length === 0) {
    DOM.driversGrid.style.display = "none";
    DOM.driversTableWrapper.style.display = "none";
    DOM.emptyState.style.display = "block";
    return;
  }

  DOM.emptyState.style.display = "none";

  if (state.activeView === "grid") {
    DOM.driversGrid.style.display = "grid";
    DOM.driversTableWrapper.style.display = "none";
    renderGridView(filtered);
  } else {
    DOM.driversGrid.style.display = "none";
    DOM.driversTableWrapper.style.display = "block";
    renderTableView(filtered);
  }
}

/**
 * Renderiza vista de tarjetas (Grid)
 */
function renderGridView(drivers) {
  DOM.driversGrid.innerHTML = "";

  drivers.forEach(driver => {
    const card = document.createElement("article");
    card.className = `driver-card card-${driver.status}`;
    card.setAttribute("tabindex", "0");

    // Initials para avatar
    const initials = driver.name.split(" ").map(n => n[0]).join("").substring(0, 2);

    // Configuración visual según estado
    const statusConfig = getStatusConfig(driver.status);

    card.innerHTML = `
      <div class="driver-card-header">
        <div class="driver-info-main">
          <div class="driver-avatar ${driver.status === 'alerta' ? 'avatar-alerta' : ''}">
            ${initials}
          </div>
          <div class="driver-name-block">
            <h3>${escapeHtml(driver.name)}</h3>
            <span class="driver-license">Licencia: ${escapeHtml(driver.license)}</span>
          </div>
        </div>
        <span class="status-badge ${statusConfig.badgeClass}">
          <span class="status-bullet ${driver.status === 'alerta' ? 'blink' : ''}"></span>
          ${statusConfig.label}
        </span>
      </div>

      <div class="driver-vehicle-meta">
        <div class="meta-row">
          <span class="meta-key">Unidad:</span>
          <span class="meta-val">${escapeHtml(driver.vehicle)}</span>
        </div>
        <div class="meta-row">
          <span class="meta-key">Patente:</span>
          <span class="plate-pill">${escapeHtml(driver.plate)}</span>
        </div>
        <div class="meta-row">
          <span class="meta-key">Ruta:</span>
          <span class="meta-val">${escapeHtml(driver.route)}</span>
        </div>
      </div>

      <div class="fatigue-section">
        <div class="fatigue-header">
          <span class="fatigue-label">Nivel de Somnolencia:</span>
          <span class="fatigue-score text-${statusConfig.colorClass}">${driver.fatigueScore}%</span>
        </div>
        <div class="fatigue-bar-bg">
          <div class="fatigue-bar-fill fill-${driver.status}" style="width: ${Math.min(driver.fatigueScore, 100)}%;"></div>
        </div>
      </div>


      <div class="card-actions">
        <button class="btn-card-detail" data-driver-id="${driver.id}">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Más información
        </button>
      </div>
    `;

    // Botón de detalle
    const detailBtn = card.querySelector(".btn-card-detail");
    detailBtn.addEventListener("click", () => openDriverModal(driver.id));

    DOM.driversGrid.appendChild(card);
  });
}

/**
 * Renderiza vista de tabla compacta
 */
function renderTableView(drivers) {
  DOM.driversTableBody.innerHTML = "";

  drivers.forEach(driver => {
    const tr = document.createElement("tr");
    if (driver.status === "alerta") tr.className = "row-danger";

    const statusConfig = getStatusConfig(driver.status);
    const initials = driver.name.split(" ").map(n => n[0]).join("").substring(0, 2);

    tr.innerHTML = `
      <td>
        <div class="table-driver-col">
          <div class="mini-avatar">${initials}</div>
          <div>
            <strong>${escapeHtml(driver.name)}</strong>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${escapeHtml(driver.license)}</div>
          </div>
        </div>
      </td>
      <td>
        <div>${escapeHtml(driver.vehicle)}</div>
        <span class="plate-pill">${escapeHtml(driver.plate)}</span>
      </td>
      <td>${escapeHtml(driver.route)}</td>
      <td><strong>${escapeHtml(driver.driveHours)}</strong></td>
      <td>
        <span class="table-score-badge text-${statusConfig.colorClass}">${driver.fatigueScore}%</span>
        <span style="font-size: 0.72rem; color: var(--text-muted);">(PERCLOS: ${driver.perclos}%)</span>
      </td>
      <td>
        <span class="status-badge ${statusConfig.badgeClass}">
          <span class="status-bullet ${driver.status === 'alerta' ? 'blink' : ''}"></span>
          ${statusConfig.label}
        </span>
      </td>
      <td class="table-event-cell" title="${escapeHtml(driver.lastEvent)}">
        ${escapeHtml(driver.lastEvent)}
      </td>
      <td class="text-right">
        <button class="btn-table-action" data-driver-id="${driver.id}">Detalles</button>
      </td>
    `;

    const actionBtn = tr.querySelector(".btn-table-action");
    actionBtn.addEventListener("click", () => openDriverModal(driver.id));

    DOM.driversTableBody.appendChild(tr);
  });
}

/**
 * Renderiza el feed lateral de incidentes y alertas
 */
function renderEvents() {
  DOM.eventsList.innerHTML = "";
  DOM.eventsCount.textContent = incidentEvents.length;

  incidentEvents.forEach(evt => {
    const item = document.createElement("div");
    item.className = `event-item ${evt.type === 'alerta' ? 'event-item-danger' : evt.type === 'precaucion' ? 'event-item-warning' : ''}`;
    
    item.innerHTML = `
      <span class="event-time">${evt.time}</span>
      <div class="event-content">
        <strong>${escapeHtml(evt.driverName)}</strong>
        <p>${escapeHtml(evt.text)}</p>
      </div>
    `;

    // Al hacer click en el evento se abre el modal del chofer
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      openDriverModal(evt.driverId);
    });

    DOM.eventsList.appendChild(item);
  });
}

// ============================================================================
// 6. MODAL DE DETALLES Y PROTOCOLO DE CABINA
// ============================================================================
function openDriverModal(driverId) {
  const driver = driversData.find(d => d.id === driverId);
  if (!driver) return;

  state.selectedDriver = driver;

  // Llenar cabecera modal
  const initials = driver.name.split(" ").map(n => n[0]).join("").substring(0, 2);
  DOM.modalAvatar.textContent = initials;
  DOM.modalDriverName.textContent = driver.name;
  DOM.modalDriverMeta.textContent = `Licencia: ${driver.license} • ${driver.vehicle} (${driver.plate})`;

  // Banner de Estado
  const statusConfig = getStatusConfig(driver.status);
  DOM.modalStatusBanner.style.backgroundColor = statusConfig.bg;
  DOM.modalStatusBanner.style.borderColor = statusConfig.border;
  DOM.modalStatusDot.style.backgroundColor = statusConfig.color;
  DOM.modalStatusText.textContent = statusConfig.bannerTitle;
  DOM.modalStatusText.style.color = statusConfig.textColor;
  DOM.modalStatusDesc.textContent = statusConfig.bannerDesc;
  DOM.modalScoreVal.textContent = `${driver.fatigueScore}%`;
  DOM.modalScoreVal.style.color = statusConfig.textColor;

  // Métricas
  DOM.modalPerclos.textContent = `${driver.perclos}%`;
  DOM.modalBlinkRate.textContent = `${driver.blinkRate} /min`;
  DOM.modalDriveHours.textContent = driver.driveHours;
  DOM.modalMicrosleeps.textContent = driver.microsleeps;

  // Info Viaje
  DOM.modalRoute.textContent = driver.route;
  DOM.modalVehicle.textContent = `${driver.vehicle} (Patente ${driver.plate})`;
  DOM.modalSpeed.textContent = driver.speed;
  DOM.modalLastStop.textContent = driver.lastStop;

  // Limpiar feedback de acción previa
  DOM.actionFeedback.style.display = "none";
  DOM.actionFeedback.textContent = "";

  // Mostrar modal
  DOM.driverModal.style.display = "flex";
  DOM.driverModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // evitar scroll de fondo
}

function closeDriverModal() {
  DOM.driverModal.style.display = "none";
  DOM.driverModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "auto";
  state.selectedDriver = null;
}

// ============================================================================
// 7. SIMULACIÓN EN TIEMPO REAL
// ============================================================================
function startClock() {
  function update() {
    const now = new Date();
    DOM.currentTime.textContent = now.toLocaleTimeString("es-AR", { hour12: false });
  }
  update();
  state.clockInterval = setInterval(update, 1000);
}

function startSimulation() {
  if (state.simulationInterval) clearInterval(state.simulationInterval);

  state.simulationInterval = setInterval(() => {
    if (!state.simulationRunning) return;

    // 1. Variar levemente métricas continuas de conductores aleatorios
    const randomIndex = Math.floor(Math.random() * driversData.length);
    const driver = driversData[randomIndex];

    // Variación aleatoria suave de PERCLOS y Parpadeos
    const deltaPerclos = (Math.random() * 0.4 - 0.2);
    driver.perclos = Math.max(1.0, Math.min(38.0, +(driver.perclos + deltaPerclos).toFixed(1)));

    const deltaBlinks = Math.floor(Math.random() * 3) - 1;
    driver.blinkRate = Math.max(10, Math.min(45, driver.blinkRate + deltaBlinks));

    // Refrescar KPIs y vistas
    renderKPIs();
    renderDrivers();

    // Si el modal está abierto para este conductor, refrescar valores
    if (state.selectedDriver && state.selectedDriver.id === driver.id) {
      DOM.modalPerclos.textContent = `${driver.perclos}%`;
      DOM.modalBlinkRate.textContent = `${driver.blinkRate} /min`;
    }

    // 2. Probabilidad baja de generar un evento dinámico en vivo
    if (Math.random() < 0.25) {
      triggerSimulatedLiveAlert();
    }
  }, 4000);
}

/**
 * Simula la llegada de un nuevo evento de telemetría desde los sensores
 */
function triggerSimulatedLiveAlert() {
  const alertDrivers = driversData.filter(d => d.status === "alerta" || d.status === "precaucion");
  if (alertDrivers.length === 0) return;

  const target = alertDrivers[Math.floor(Math.random() * alertDrivers.length)];
  const now = new Date();
  const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });

  let eventText = "";
  if (target.status === "alerta") {
    const msDuration = (1.2 + Math.random() * 0.8).toFixed(1);
    eventText = `Sensor facial: Cierre ocular continuo de ${msDuration}s registrado.`;
  } else {
    eventText = `Cámara de cabina: Patrón de parpadeo irregular (${target.blinkRate}/min).`;
  }

  // Actualizar conductor
  target.lastEvent = eventText;
  target.lastEventTime = timeStr;

  // Insertar al inicio de la lista de eventos
  incidentEvents.unshift({
    id: `EV-${Date.now()}`,
    driverId: target.id,
    driverName: target.name,
    time: timeStr,
    type: target.status,
    text: eventText
  });

  // Guardar también en la base histórica
  historyEvents.unshift({
    id: `HIST-${Date.now()}`,
    timestamp: `${now.toLocaleDateString("es-AR")} ${timeStr}`,
    driverId: target.id,
    driverName: target.name,
    vehicle: target.vehicle,
    plate: target.plate,
    route: target.route,
    eventType: target.status === "alerta" ? "Microsueño en ruta" : "Fatiga / Bostezos continuos",
    perclos: `${target.perclos}%`,
    duration: target.status === "alerta" ? "1.7s" : "15s",
    severity: target.status,
    actionTaken: target.status === "alerta" ? "Alerta sonora preventiva transmitida" : "Monitoreo preventivo"
  });

  // Mantener máx 10 eventos en feed de inicio
  if (incidentEvents.length > 10) incidentEvents.pop();

  renderEvents();
  renderDrivers();
  if (state.currentAppView === "historial") renderHistory();

  // Mostrar Toast no intrusivo si es alerta
  if (target.status === "alerta") {
    showToast(`⚠️ Alerta Somnolencia: ${target.name} (${target.plate})`, "toast-danger");
  }
}

// ============================================================================
// 8. ACCIONES DE INTERVENCIÓN (Botones de Cabina)
// ============================================================================
function setupEventListeners() {
  // Filtros de Estado
  DOM.filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeFilter = btn.getAttribute("data-status");
      renderKPIs();
      renderDrivers();
    });
  });

  // Clicks directos en las tarjetas KPI para filtrar rápido
  Object.entries(DOM.kpiCards).forEach(([filterKey, cardEl]) => {
    if (cardEl) {
      cardEl.addEventListener("click", () => {
        state.activeFilter = filterKey;
        // sincronizar botón de filtro
        DOM.filterButtons.forEach(b => {
          if (b.getAttribute("data-status") === filterKey) {
            b.classList.add("active");
          } else {
            b.classList.remove("active");
          }
        });
        renderKPIs();
        renderDrivers();
      });
    }
  });

  // Búsqueda en tiempo real
  DOM.searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    DOM.clearSearchBtn.style.display = state.searchQuery ? "block" : "none";
    renderDrivers();
  });

  DOM.clearSearchBtn.addEventListener("click", () => {
    DOM.searchInput.value = "";
    state.searchQuery = "";
    DOM.clearSearchBtn.style.display = "none";
    renderDrivers();
  });

  DOM.resetFiltersBtn.addEventListener("click", () => {
    state.activeFilter = "all";
    state.searchQuery = "";
    DOM.searchInput.value = "";
    DOM.clearSearchBtn.style.display = "none";
    DOM.filterButtons.forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-status") === "all");
    });
    renderKPIs();
    renderDrivers();
  });

  // Cambio de Vista (Cuadrícula / Tabla)
  DOM.btnGridView.addEventListener("click", () => {
    state.activeView = "grid";
    DOM.btnGridView.classList.add("active");
    DOM.btnTableView.classList.remove("active");
    renderDrivers();
  });

  DOM.btnTableView.addEventListener("click", () => {
    state.activeView = "table";
    DOM.btnTableView.classList.add("active");
    DOM.btnGridView.classList.remove("active");
    renderDrivers();
  });

  // Pausa / Reanudación de Simulación
  DOM.simToggleBtn.addEventListener("click", () => {
    state.simulationRunning = !state.simulationRunning;
    if (state.simulationRunning) {
      DOM.simToggleText.textContent = "Pausar Simulación";
      DOM.liveIndicator.style.opacity = "1";
      showToast("Simulación en tiempo real reanudada", "toast-success");
    } else {
      DOM.simToggleText.textContent = "Reanudar Simulación";
      DOM.liveIndicator.style.opacity = "0.4";
      showToast("Simulación pausada", "toast-warning");
    }
  });

  // Modal Cerrar
  DOM.closeModalBtn.addEventListener("click", closeDriverModal);
  DOM.driverModal.addEventListener("click", (e) => {
    if (e.target === DOM.driverModal) closeDriverModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.selectedDriver) {
      closeDriverModal();
    }
  });

  // Acciones dentro del Modal
  DOM.btnSendCabinAlert.addEventListener("click", () => {
    if (!state.selectedDriver) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    const dateStr = `${now.toLocaleDateString("es-AR")} ${timeStr}`;

    showActionFeedback(`🔔 Alarma sonora emitida con éxito en la cabina de ${state.selectedDriver.name}.`, "warning");
    showToast(`Alerta sonora transmitida al vehículo ${state.selectedDriver.plate}`, "toast-warning");

    // Registrar en feed de inicio
    incidentEvents.unshift({
      id: `ACT-${Date.now()}`,
      driverId: state.selectedDriver.id,
      driverName: state.selectedDriver.name,
      time: timeStr,
      type: "alerta",
      text: "Operador central emitió señal acústica preventiva en cabina."
    });

    // Registrar en historial permanente
    historyEvents.unshift({
      id: `HIST-${Date.now()}`,
      timestamp: dateStr,
      driverId: state.selectedDriver.id,
      driverName: state.selectedDriver.name,
      vehicle: state.selectedDriver.vehicle,
      plate: state.selectedDriver.plate,
      route: state.selectedDriver.route,
      eventType: "Intervención de Operador",
      perclos: `${state.selectedDriver.perclos}%`,
      duration: "-",
      severity: "alerta",
      actionTaken: "Alarma acústica preventiva en cabina"
    });

    renderEvents();
    if (state.currentAppView === "historial") renderHistory();
  });

  DOM.btnCallCabin.addEventListener("click", () => {
    if (!state.selectedDriver) return;
    showActionFeedback(`📞 Conectando enlace de voz con cabina de ${state.selectedDriver.name}...`, "info");
    showToast(`Llamada en curso hacia cabina (${state.selectedDriver.plate})`, "toast-success");
  });

  DOM.btnAssignRestStop.addEventListener("click", () => {
    if (!state.selectedDriver) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    const dateStr = `${now.toLocaleDateString("es-AR")} ${timeStr}`;
    
    // Cambiar estado a precaución si estaba en alerta
    state.selectedDriver.status = "precaucion";
    state.selectedDriver.lastEvent = "Parada de descanso ordenada por operador. Unidad dirigiéndose a parador.";
    
    showActionFeedback(`🛑 Parada obligatoria enviada a telemetría de a bordo. Se notificó al conductor.`, "success");
    showToast(`Instrucción de parada registrada para ${state.selectedDriver.name}`, "toast-success");

    // Registrar en historial permanente
    historyEvents.unshift({
      id: `HIST-${Date.now()}`,
      timestamp: dateStr,
      driverId: state.selectedDriver.id,
      driverName: state.selectedDriver.name,
      vehicle: state.selectedDriver.vehicle,
      plate: state.selectedDriver.plate,
      route: state.selectedDriver.route,
      eventType: "Orden de Parada Obligatoria",
      perclos: `${state.selectedDriver.perclos}%`,
      duration: "-",
      severity: "precaucion",
      actionTaken: "Desvío hacia parador de descanso ordenado"
    });

    renderKPIs();
    renderDrivers();
    renderEvents();
    if (state.currentAppView === "historial") renderHistory();

    // Actualizar visual del modal
    openDriverModal(state.selectedDriver.id);
  });
}

function showActionFeedback(text, type = "success") {
  DOM.actionFeedback.style.display = "block";
  DOM.actionFeedback.textContent = text;
  if (type === "warning") {
    DOM.actionFeedback.style.backgroundColor = "#fef2f2";
    DOM.actionFeedback.style.color = "#991b1b";
    DOM.actionFeedback.style.borderColor = "#fecaca";
  } else if (type === "info") {
    DOM.actionFeedback.style.backgroundColor = "#eff6ff";
    DOM.actionFeedback.style.color = "#1e40af";
    DOM.actionFeedback.style.borderColor = "#bfdbfe";
  } else {
    DOM.actionFeedback.style.backgroundColor = "#ecfdf5";
    DOM.actionFeedback.style.color = "#065f46";
    DOM.actionFeedback.style.borderColor = "#a7f3d0";
  }
}

// ============================================================================
// 9. UTILIDADES Y HELPERS
// ============================================================================
function getStatusConfig(status) {
  switch (status) {
    case "normal":
      return {
        label: "Normal",
        badgeClass: "badge-normal",
        colorClass: "normal",
        color: "#10b981",
        bg: "#ecfdf5",
        border: "#a7f3d0",
        textColor: "#065f46",
        bannerTitle: "ESTADO: NORMAL (VIGILANCIA ADECUADA)",
      };
    case "precaucion":
      return {
        label: "Precaución",
        badgeClass: "badge-warning",
        colorClass: "warning",
        color: "#f59e0b",
        bg: "#fffbeb",
        border: "#fde68a",
        textColor: "#92400e",
        bannerTitle: "ESTADO: PRECAUCIÓN (FATIGA LEVE)",
      };
    case "alerta":
      return {
        label: "Alerta Crítica",
        badgeClass: "badge-danger",
        colorClass: "danger",
        color: "#ef4444",
        bg: "#fef2f2",
        border: "#fecaca",
        textColor: "#991b1b",
        bannerTitle: "ESTADO: ALERTA CRÍTICA (SOMNOLENCIA)",
      };
    default:
      return {
        label: status,
        badgeClass: "",
        colorClass: "normal",
        color: "#64748b",
        bg: "#f1f5f9",
        border: "#e2e8f0",
        textColor: "#0f172a",
        bannerTitle: status,
        bannerDesc: ""
      };
  }
}

function showToast(message, typeClass = "toast-success") {
  const toast = document.createElement("div");
  toast.className = `toast ${typeClass}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// 10. NAVEGACIÓN Y CONTROL DEL MENÚ DESPLEGABLE
// ============================================================================
function setupNavigation() {
  if (!DOM.navMenuBtn || !DOM.navDropdownMenu) return;

  // Abrir / cerrar al hacer clic en el botón del menú
  DOM.navMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = DOM.navDropdownWrapper.classList.contains("open");
    if (isOpen) {
      closeNavMenu();
    } else {
      openNavMenu();
    }
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener("click", (e) => {
    if (DOM.navDropdownWrapper && !DOM.navDropdownWrapper.contains(e.target)) {
      closeNavMenu();
    }
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNavMenu();
  });

  // Clic en items de navegación
  DOM.dropdownItems.forEach(item => {
    item.addEventListener("click", () => {
      const viewId = item.getAttribute("data-view");
      switchView(viewId);
      closeNavMenu();
    });
  });
}

function openNavMenu() {
  DOM.navDropdownWrapper.classList.add("open");
  DOM.navDropdownMenu.style.display = "flex";
  DOM.navMenuBtn.classList.add("active-dropdown");
  DOM.navMenuBtn.setAttribute("aria-expanded", "true");
}

function closeNavMenu() {
  DOM.navDropdownWrapper.classList.remove("open");
  DOM.navDropdownMenu.style.display = "none";
  DOM.navMenuBtn.classList.remove("active-dropdown");
  DOM.navMenuBtn.setAttribute("aria-expanded", "false");
}

function switchView(viewName) {
  state.currentAppView = viewName;

  // Ocultar todas las vistas
  Object.values(DOM.views).forEach(el => {
    if (el) el.style.display = "none";
  });

  // Mostrar vista activa
  if (DOM.views[viewName]) {
    DOM.views[viewName].style.display = "block";
  }

  // Actualizar item activo en el menú
  DOM.dropdownItems.forEach(item => {
    if (item.getAttribute("data-view") === viewName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Actualizar etiqueta del botón
  const labels = {
    inicio: "Inicio",
    historial: "Ver Historial",
    alta: "Alta de conductores"
  };
  if (DOM.currentViewLabel) {
    DOM.currentViewLabel.textContent = labels[viewName] || "Inicio";
  }

  // Acciones al cambiar de vista
  if (viewName === "historial") {
    populateHistoryDriverSelect();
    populateChartDriverSelect();
    renderHistory();
    setTimeout(renderFatigueTimeChart, 60);
  }

  if (viewName === "inicio") {
    renderKPIs();
    renderDrivers();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================================
// 11. VISTA 2: VER HISTORIAL DE ALERTAS POR CONDUCTOR Y GRÁFICO DE FATIGA
// ============================================================================
const CHART_CONFIG = {
  hoursLabels: ["1h", "2h", "3h", "4h", "5h", "6h", "7h+"],
  hoursDescriptions: [
    "0 a 1 hora",
    "1 a 2 horas",
    "2 a 3 horas",
    "3 a 4 horas",
    "4 a 5 horas",
    "5 a 6 horas",
    "Más de 6 horas"
  ],
  colors: {
    avgLine: "#2563eb",
    avgFillStart: "rgba(37, 99, 235, 0.16)",
    driverLine: "#ef4444",
    driverLineWarning: "#f59e0b",
    driverLineNormal: "#10b981",
    grid: "#e2e8f0",
    text: "#64748b",
    criticalZone: "rgba(239, 68, 68, 0.04)"
  }
};

/**
 * Retorna la curva de alarmas disparadas en función de las horas continuas al volante (1h a 7h+)
 * calculada según el perfil fisiológico, estado y puntuación de fatiga del conductor
 */
function getDriverAlarmCurve(driver, metric = "all") {
  let baseFactor = 1.0;
  if (driver.status === "alerta") {
    baseFactor = 1.8 + (driver.fatigueScore / 100);
  } else if (driver.status === "precaucion") {
    baseFactor = 1.1 + (driver.fatigueScore / 180);
  } else {
    baseFactor = 0.5 + (driver.fatigueScore / 220);
  }

  // Modelos empíricos de incremento de fatiga en transporte
  const baseCurveAll = [0.3, 0.7, 1.5, 3.4, 5.8, 8.2, 10.6];
  const baseCurveAlerta = [0.0, 0.1, 0.4, 1.6, 3.5, 5.7, 8.0];
  const baseCurvePrecaucion = [0.3, 0.6, 1.1, 1.8, 2.3, 2.5, 2.6];

  let template = baseCurveAll;
  if (metric === "alerta") template = baseCurveAlerta;
  if (metric === "precaucion") template = baseCurvePrecaucion;

  // Variación determinista según ID del conductor
  const seed = (driver.id.charCodeAt(driver.id.length - 1) % 5) - 2;
  const variation = seed * 0.08;

  return template.map(val => {
    const calc = val * (baseFactor + variation);
    return Math.max(0, +calc.toFixed(1));
  });
}

/**
 * Calcula el promedio dinámico de la flota promediando las curvas de todos los conductores activos
 */
function getFleetAverageCurve(metric = "all") {
  if (!driversData || driversData.length === 0) return [0, 0, 0, 0, 0, 0, 0];
  const totals = [0, 0, 0, 0, 0, 0, 0];
  driversData.forEach(driver => {
    const curve = getDriverAlarmCurve(driver, metric);
    curve.forEach((val, i) => {
      totals[i] += val;
    });
  });
  return totals.map(sum => +(sum / driversData.length).toFixed(1));
}

function populateHistoryDriverSelect() {
  if (!DOM.historyDriverSelect) return;
  const currentVal = DOM.historyDriverSelect.value;
  DOM.historyDriverSelect.innerHTML = `<option value="all">Todos los conductores (${driversData.length})</option>`;

  driversData.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = `${d.name} (${d.plate}) - ${d.vehicle}`;
    DOM.historyDriverSelect.appendChild(opt);
  });

  if (currentVal && Array.from(DOM.historyDriverSelect.options).some(o => o.value === currentVal)) {
    DOM.historyDriverSelect.value = currentVal;
  }
}

function populateChartDriverSelect() {
  if (!DOM.chartDriverSelect) return;
  const currentVal = DOM.chartDriverSelect.value;
  DOM.chartDriverSelect.innerHTML = `<option value="all">Promedio general</option>`;

  driversData.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = `${d.name} (${d.plate})`;
    DOM.chartDriverSelect.appendChild(opt);
  });

  if (currentVal && Array.from(DOM.chartDriverSelect.options).some(o => o.value === currentVal)) {
    DOM.chartDriverSelect.value = currentVal;
  }
}

function setupHistoryListeners() {
  if (!DOM.historyDriverSelect) return;

  // Filtro de conductor general en tabla e historial
  DOM.historyDriverSelect.addEventListener("change", (e) => {
    state.historyDriverFilter = e.target.value;
    state.chartDriverFilter = e.target.value;
    if (DOM.chartDriverSelect) DOM.chartDriverSelect.value = e.target.value;
    renderHistory();
    renderFatigueTimeChart();
  });

  DOM.historySeveritySelect.addEventListener("change", (e) => {
    state.historySeverityFilter = e.target.value;
    renderHistory();
  });

  DOM.historySearchInput.addEventListener("input", (e) => {
    state.historySearchQuery = e.target.value.toLowerCase().trim();
    renderHistory();
  });

  // Selector específico del gráfico
  if (DOM.chartDriverSelect) {
    DOM.chartDriverSelect.addEventListener("change", (e) => {
      state.chartDriverFilter = e.target.value;
      if (e.target.value !== "all") {
        state.historyDriverFilter = e.target.value;
        if (DOM.historyDriverSelect) DOM.historyDriverSelect.value = e.target.value;
        renderHistory();
      } else {
        renderFatigueTimeChart();
      }
    });
  }

  // Píldoras de métricas del gráfico
  if (DOM.chartMetricPills) {
    DOM.chartMetricPills.forEach(pill => {
      pill.addEventListener("click", () => {
        DOM.chartMetricPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.chartMetricFilter = pill.getAttribute("data-metric");
        renderFatigueTimeChart();
      });
    });
  }
}

function renderHistory() {
  if (!DOM.historyTableBody) return;

  const filtered = historyEvents.filter(evt => {
    const matchDriver = (state.historyDriverFilter === "all") || (evt.driverId === state.historyDriverFilter);
    const matchSeverity = (state.historySeverityFilter === "all") || (evt.severity === state.historySeverityFilter);
    const q = state.historySearchQuery;
    const matchSearch = !q ||
      evt.driverName.toLowerCase().includes(q) ||
      evt.plate.toLowerCase().includes(q) ||
      evt.vehicle.toLowerCase().includes(q) ||
      evt.route.toLowerCase().includes(q) ||
      evt.eventType.toLowerCase().includes(q) ||
      evt.actionTaken.toLowerCase().includes(q);

    return matchDriver && matchSeverity && matchSearch;
  });

  // Métricas acumuladas de historial
  const total = filtered.length;
  const microsleeps = filtered.filter(e => e.eventType.toLowerCase().includes("microsueño") || e.severity === "alerta").length;
  const warnings = filtered.filter(e => e.severity === "precaucion").length;
  const actions = filtered.filter(e => e.actionTaken && !e.actionTaken.toLowerCase().includes("sin intervención") && !e.actionTaken.toLowerCase().includes("preventivo")).length;

  DOM.hkpiTotal.textContent = total;
  DOM.hkpiMicrosleeps.textContent = microsleeps;
  DOM.hkpiWarnings.textContent = warnings;
  DOM.hkpiActions.textContent = actions;

  DOM.historyTableBody.innerHTML = "";

  if (filtered.length === 0) {
    DOM.historyEmptyState.style.display = "block";
  } else {
    DOM.historyEmptyState.style.display = "none";
    filtered.forEach(evt => {
      const tr = document.createElement("tr");
      if (evt.severity === "alerta") tr.className = "row-danger";

      const statusConfig = getStatusConfig(evt.severity);

      tr.innerHTML = `
        <td><span style="font-family: monospace; font-size: 0.8rem; font-weight: 600;">${escapeHtml(evt.timestamp)}</span></td>
        <td>
          <strong>${escapeHtml(evt.driverName)}</strong>
        </td>
        <td>
          <div>${escapeHtml(evt.vehicle)}</div>
          <span class="plate-pill">${escapeHtml(evt.plate)}</span>
        </td>
        <td>${escapeHtml(evt.route)}</td>
        <td><strong>${escapeHtml(evt.eventType)}</strong></td>
        <td><span style="font-weight: 700;">${escapeHtml(evt.perclos)}</span></td>
        <td>${escapeHtml(evt.duration)}</td>
        <td>
          <span class="status-badge ${statusConfig.badgeClass}">
            <span class="status-bullet ${evt.severity === 'alerta' ? 'blink' : ''}"></span>
            ${statusConfig.label}
          </span>
        </td>
      `;

      DOM.historyTableBody.appendChild(tr);
    });
  }

  // Refrescar el gráfico
  renderFatigueTimeChart();
}

/**
 * Renderizado en HTML5 Canvas de la Curva de Alarmas vs Horas de Manejo
 */
function renderFatigueTimeChart() {
  const canvas = DOM.fatigueTimeCanvas;
  if (!canvas || !DOM.views.historial || DOM.views.historial.style.display === "none") return;

  const ctx = canvas.getContext("2d");
  const wrapper = DOM.chartCanvasWrapper;
  const rect = wrapper.getBoundingClientRect();

  if (rect.width === 0) return;

  // Calibración High-DPI
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = rect.width;
  const displayHeight = rect.height;

  canvas.width = Math.floor(displayWidth * dpr);
  canvas.height = Math.floor(displayHeight * dpr);
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;

  ctx.resetTransform();
  ctx.scale(dpr, dpr);

  const pad = { top: 25, right: 30, bottom: 50, left: 50 };
  const chartW = displayWidth - pad.left - pad.right;
  const chartH = displayHeight - pad.top - pad.bottom;

  // Obtener datos
  const metric = state.chartMetricFilter || "all";
  const fleetAvgCurve = getFleetAverageCurve(metric);
  const selectedDriver = driversData.find(d => d.id === state.chartDriverFilter);
  const driverCurve = selectedDriver ? getDriverAlarmCurve(selectedDriver, metric) : null;

  // Actualizar leyendas
  if (DOM.chartFleetCount) DOM.chartFleetCount.textContent = driversData.length;
  if (selectedDriver) {
    DOM.legendDriverItem.style.display = "inline-flex";
    DOM.chartLegendDriverName.textContent = selectedDriver.name;
  } else {
    DOM.legendDriverItem.style.display = "none";
  }

  // Actualizar barra de insights
  updateChartInsightBar(selectedDriver, fleetAvgCurve, driverCurve);

  // Escala Y
  const maxFleet = Math.max(...fleetAvgCurve);
  const maxDriver = driverCurve ? Math.max(...driverCurve) : 0;
  const rawMax = Math.max(maxFleet, maxDriver, 6);
  const maxY = Math.ceil((rawMax * 1.15) / 2) * 2;

  const getX = (i) => pad.left + (i / (CHART_CONFIG.hoursLabels.length - 1)) * chartW;
  const getY = (val) => pad.top + chartH - (val / maxY) * chartH;

  ctx.clearRect(0, 0, displayWidth, displayHeight);


  // 2. Cuadrícula horizontal y valores Y
  const ySteps = 4;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.font = "500 11px Inter, system-ui, sans-serif";

  for (let i = 0; i <= ySteps; i++) {
    const val = (maxY / ySteps) * i;
    const yPos = getY(val);

    ctx.strokeStyle = CHART_CONFIG.colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, yPos);
    ctx.lineTo(displayWidth - pad.right, yPos);
    ctx.stroke();

    ctx.fillStyle = CHART_CONFIG.colors.text;
    ctx.fillText(`${val.toFixed(val % 1 === 0 ? 0 : 1)}`, pad.left - 8, yPos);
  }

  // Título Y
  ctx.save();
  ctx.translate(14, pad.top + chartH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillStyle = "#64748b";
  ctx.font = "600 11px Inter, system-ui, sans-serif";
  ctx.fillText("Alarmas disparadas", 0, 0);
  ctx.restore();

  // 3. Etiquetas X
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "600 11px Inter, system-ui, sans-serif";
  CHART_CONFIG.hoursLabels.forEach((label, i) => {
    const xPos = getX(i);
    ctx.fillText(label, xPos, pad.top + chartH + 8);
  });

  ctx.fillStyle = "#64748b";
  ctx.font = "500 11px Inter, system-ui, sans-serif";
  ctx.fillText("Tiempo de conducción continua (horas)", pad.left + chartW / 2, pad.top + chartH + 26);

  // 4. Curva del Promedio de la Flota
  drawSmoothLine(ctx, fleetAvgCurve, getX, getY, CHART_CONFIG.colors.avgLine, 2.6, true, CHART_CONFIG.colors.avgFillStart);

  // Puntos del promedio
  fleetAvgCurve.forEach((val, i) => {
    const px = getX(i);
    const py = getY(val);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = CHART_CONFIG.colors.avgLine;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // 5. Curva del Conductor Seleccionado (si se eligió uno)
  if (selectedDriver && driverCurve) {
    let driverColor = CHART_CONFIG.colors.driverLine;
    if (selectedDriver.status === "precaucion") driverColor = CHART_CONFIG.colors.driverLineWarning;
    if (selectedDriver.status === "normal") driverColor = CHART_CONFIG.colors.driverLineNormal;

    drawSmoothLine(ctx, driverCurve, getX, getY, driverColor, 3.2, false);

    driverCurve.forEach((val, i) => {
      const px = getX(i);
      const py = getY(val);
      ctx.fillStyle = driverColor;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  // 6. Crosshair interactivo en hover
  if (state.chartHoveredIndex !== null && state.chartHoveredIndex >= 0 && state.chartHoveredIndex < CHART_CONFIG.hoursLabels.length) {
    const idx = state.chartHoveredIndex;
    const hx = getX(idx);

    ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(hx, pad.top);
    ctx.lineTo(hx, pad.top + chartH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Resaltado de puntos
    const avgY = getY(fleetAvgCurve[idx]);
    ctx.fillStyle = CHART_CONFIG.colors.avgLine;
    ctx.beginPath();
    ctx.arc(hx, avgY, 6.5, 0, Math.PI * 2);
    ctx.fill();

    if (selectedDriver && driverCurve) {
      let driverColor = selectedDriver.status === "alerta" ? "#ef4444" : selectedDriver.status === "precaucion" ? "#f59e0b" : "#10b981";
      const drvY = getY(driverCurve[idx]);
      ctx.fillStyle = driverColor;
      ctx.beginPath();
      ctx.arc(hx, drvY, 7.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawSmoothLine(ctx, data, getX, getY, strokeColor, lineWidth, isArea = false, fillStart = null) {
  if (data.length === 0) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(getX(0), getY(data[0]));

  for (let i = 0; i < data.length - 1; i++) {
    const x0 = getX(i);
    const y0 = getY(data[i]);
    const x1 = getX(i + 1);
    const y1 = getY(data[i + 1]);
    const mx = (x0 + x1) / 2;
    ctx.bezierCurveTo(mx, y0, mx, y1, x1, y1);
  }

  if (isArea && fillStart) {
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const bottomY = getY(0);
    ctx.lineTo(lastX, bottomY);
    ctx.lineTo(firstX, bottomY);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, bottomY);
    gradient.addColorStop(0, fillStart);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    for (let i = 0; i < data.length - 1; i++) {
      const x0 = getX(i);
      const y0 = getY(data[i]);
      const x1 = getX(i + 1);
      const y1 = getY(data[i + 1]);
      const mx = (x0 + x1) / 2;
      ctx.bezierCurveTo(mx, y0, mx, y1, x1, y1);
    }
  }

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.restore();
}

function updateChartInsightBar(driver, fleetAvg, driverCurve) {
  if (!DOM.chartInsightBar || !DOM.chartInsightBadge || !DOM.chartInsightText) return;

  if (!driver || !driverCurve) {
    DOM.chartInsightBar.className = "chart-insight-bar";
    DOM.chartInsightBadge.textContent = "Promedio";
       return;
  }

  const diffH4 = driverCurve[3] - fleetAvg[3];
  const pctDiffH4 = Math.round((diffH4 / (fleetAvg[3] || 1)) * 100);

  if (driver.status === "alerta" || pctDiffH4 > 25) {
    DOM.chartInsightBar.className = "chart-insight-bar insight-danger";
    DOM.chartInsightBadge.textContent = "⚠️ Riesgo Elevado";
    DOM.chartInsightText.innerHTML = `
      <strong>${escapeHtml(driver.name)} (${driver.plate})</strong> supera el promedio en un <strong>+${pctDiffH4}%</strong> de alarmas a partir de la 4ª hora de viaje. 
      Se recomienda ordenar parada de descanso obligatoria antes de superar las 3.5h de conducción.
    `;
  } else if (driver.status === "precaucion" || pctDiffH4 > 0) {
    DOM.chartInsightBar.className = "chart-insight-bar insight-warning";
    DOM.chartInsightBadge.textContent = "⚠️ Fatiga Moderada";
    DOM.chartInsightText.innerHTML = `
      <strong>${escapeHtml(driver.name)}</strong> presenta una curva con <strong>${driverCurve[4]} alarmas proyectadas</strong> hacia la 5ª hora. 
      Mantener monitoreo de parpadeos y bostezos en tiempo real.
    `;
  } else {
    DOM.chartInsightBar.className = "chart-insight-bar";
    DOM.chartInsightBadge.textContent = "✅ Nivel Óptimo";
    DOM.chartInsightText.innerHTML = `
      <strong>${escapeHtml(driver.name)}</strong> mantiene una incidencia de somnolencia un <strong>${Math.abs(pctDiffH4)}% inferior</strong> a la media general de la flota. 
      Excelente índice de atención en ruta.
    `;
  }
}

function setupChartInteractivity() {
  const canvas = DOM.fatigueTimeCanvas;
  const tooltip = DOM.chartTooltip;
  if (!canvas || !tooltip) return;

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const padLeft = 50;
    const padRight = 30;
    const chartW = rect.width - padLeft - padRight;
    const mouseX = e.clientX - rect.left;

    if (mouseX < padLeft - 15 || mouseX > rect.width - padRight + 15) {
      state.chartHoveredIndex = null;
      tooltip.style.display = "none";
      renderFatigueTimeChart();
      return;
    }

    const relX = Math.max(0, Math.min(chartW, mouseX - padLeft));
    const stepRatio = chartW / (CHART_CONFIG.hoursLabels.length - 1);
    const nearestIndex = Math.round(relX / stepRatio);

    state.chartHoveredIndex = nearestIndex;
    renderFatigueTimeChart();

    const metric = state.chartMetricFilter || "all";
    const fleetAvg = getFleetAverageCurve(metric);
    const selectedDriver = driversData.find(d => d.id === state.chartDriverFilter);
    const driverCurve = selectedDriver ? getDriverAlarmCurve(selectedDriver, metric) : null;

    const hourLabel = CHART_CONFIG.hoursDescriptions[nearestIndex];
    const avgVal = fleetAvg[nearestIndex];

    let driverRowHtml = "";
    let deltaHtml = "";

    if (selectedDriver && driverCurve) {
      const drvVal = driverCurve[nearestIndex];
      const diff = +(drvVal - avgVal).toFixed(1);
      const diffPct = Math.round((diff / (avgVal || 1)) * 100);
      const isAbove = diff > 0;

      driverRowHtml = `
        <div class="tooltip-row">
          <span class="tooltip-label" style="color:#fca5a5;">${escapeHtml(selectedDriver.name)}:</span>
          <span class="tooltip-val" style="color:#ffffff;">${drvVal} alarmas</span>
        </div>
      `;

      deltaHtml = `
        <div class="tooltip-delta">
          ${isAbove ? `⚠️ +${diffPct}% respecto a la media de la flota` : `✅ ${diffPct}% bajo la media de flota`}
        </div>
      `;
    }

    tooltip.innerHTML = `
      <div class="tooltip-title">⏱️ Conducción: ${hourLabel}</div>
      <div class="tooltip-row">
        <span class="tooltip-label" style="color:#93c5fd;">Promedio Flota:</span>
        <span class="tooltip-val">${avgVal} alarmas</span>
      </div>
      ${driverRowHtml}
      ${deltaHtml}
    `;

    const pointX = padLeft + nearestIndex * stepRatio;
    tooltip.style.left = `${pointX}px`;
    tooltip.style.top = `${e.clientY - rect.top}px`;
    tooltip.style.display = "block";
  });

  canvas.addEventListener("mouseleave", () => {
    state.chartHoveredIndex = null;
    tooltip.style.display = "none";
    renderFatigueTimeChart();
  });

  window.addEventListener("resize", () => {
    if (state.currentAppView === "historial") {
      renderFatigueTimeChart();
    }
  });
}

// ============================================================================
// 12. VISTA 3: ALTA DE CONDUCTORES
// ============================================================================
function setupAltaForm() {
  if (!DOM.newDriverForm) return;

  // Slider sincronizado con etiqueta
  DOM.formDriverFatigue.addEventListener("input", (e) => {
    DOM.fatigueValDisplay.textContent = `${e.target.value}%`;
  });

  // Botón cancelar
  DOM.btnCancelAlta.addEventListener("click", () => {
    clearAltaForm();
    switchView("inicio");
  });

  // Envío del formulario
  DOM.newDriverForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let hasError = false;

    const name = DOM.formDriverName.value.trim();
    const license = DOM.formDriverLicense.value.trim();
    const vehicle = DOM.formDriverVehicle.value.trim();
    const plate = DOM.formDriverPlate.value.trim().toUpperCase();
    const route = DOM.formDriverRoute.value.trim();
    const driveHours = DOM.formDriveHours.value.trim() || "0h 30m";
    const status = DOM.formDriverStatus.value;
    const fatigue = parseInt(DOM.formDriverFatigue.value, 10) || 15;
    const notes = DOM.formDriverNotes.value.trim() || "Conductor ingresado a la flota activa.";

    // Limpiar errores visuales previos
    [DOM.errDriverName, DOM.errDriverLicense, DOM.errDriverVehicle, DOM.errDriverPlate, DOM.errDriverRoute].forEach(el => {
      if (el) { el.style.display = "none"; el.textContent = ""; }
    });
    [DOM.formDriverName, DOM.formDriverLicense, DOM.formDriverVehicle, DOM.formDriverPlate, DOM.formDriverRoute].forEach(el => {
      if (el) el.classList.remove("input-error");
    });

    if (!name) {
      showFieldError(DOM.formDriverName, DOM.errDriverName, "Por favor ingrese el nombre y apellido");
      hasError = true;
    }
    if (!license) {
      showFieldError(DOM.formDriverLicense, DOM.errDriverLicense, "Ingrese el número de licencia");
      hasError = true;
    }
    if (!vehicle) {
      showFieldError(DOM.formDriverVehicle, DOM.errDriverVehicle, "Ingrese el modelo del camión / unidad");
      hasError = true;
    }
    if (!plate) {
      showFieldError(DOM.formDriverPlate, DOM.errDriverPlate, "Ingrese la patente (ej: AF 123 CD)");
      hasError = true;
    }
    if (!route) {
      showFieldError(DOM.formDriverRoute, DOM.errDriverRoute, "Especifique el corredor o ruta asignada");
      hasError = true;
    }

    if (hasError) return;

    // Calcular valores biométricos coherentes
    let perclos = +(fatigue * 0.25).toFixed(1);
    let blinkRate = status === "alerta" ? 32 : status === "precaucion" ? 24 : 17;
    let microsleeps = status === "alerta" ? 1 : 0;

    const newDriverId = `DRV-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    const fullDateStr = `${now.toLocaleDateString("es-AR")} ${timeStr}`;

    const newDriver = {
      id: newDriverId,
      name: name,
      license: license,
      vehicle: vehicle,
      plate: plate,
      route: route,
      status: status,
      fatigueScore: fatigue,
      perclos: perclos,
      blinkRate: blinkRate,
      driveHours: driveHours,
      driveMinutesRaw: 60,
      microsleeps: microsleeps,
      speed: "78 km/h",
      lastStop: "Inicio de turno reciente",
      lastEvent: notes,
      lastEventTime: timeStr
    };

    // Añadir al inicio del listado de conductores
    driversData.unshift(newDriver);

    // Registrar en el historial
    historyEvents.unshift({
      id: `HIST-${Date.now()}`,
      timestamp: fullDateStr,
      driverId: newDriver.id,
      driverName: newDriver.name,
      vehicle: newDriver.vehicle,
      plate: newDriver.plate,
      route: newDriver.route,
      eventType: status === "normal" ? "Alta y vinculación a monitoreo" : `Alta con estado ${status}`,
      perclos: `${newDriver.perclos}%`,
      duration: "-",
      severity: newDriver.status,
      actionTaken: "Registro exitoso en el sistema"
    });

    // Limpiar formulario
    clearAltaForm();

    // Actualizar datos globales
    renderKPIs();
    renderDrivers();
    populateHistoryDriverSelect();

    // Notificación flotante de confirmación
    showToast(`✅ Conductor ${newDriver.name} dado de alta con éxito (${newDriver.plate})`, "toast-success");

    // Redirigir a Inicio
    switchView("inicio");
  });
}

function showFieldError(inputEl, errorEl, message) {
  if (inputEl) inputEl.classList.add("input-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

function clearAltaForm() {
  DOM.newDriverForm.reset();
  DOM.fatigueValDisplay.textContent = "15%";
  DOM.formDriverFatigue.value = 15;
  [DOM.errDriverName, DOM.errDriverLicense, DOM.errDriverVehicle, DOM.errDriverPlate, DOM.errDriverRoute].forEach(el => {
    if (el) { el.style.display = "none"; el.textContent = ""; }
  });
  [DOM.formDriverName, DOM.formDriverLicense, DOM.formDriverVehicle, DOM.formDriverPlate, DOM.formDriverRoute].forEach(el => {
    if (el) el.classList.remove("input-error");
  });
}

// Iniciar al cargar el DOM
document.addEventListener("DOMContentLoaded", init);

