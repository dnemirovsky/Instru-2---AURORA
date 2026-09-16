/**
 * AURORA — Panel de administración
 * Conectado a Supabase. Sin datos simulados.
 *
 * Todo lo que se muestra sale de cuatro tablas: empresas, usuarios, viajes y eventos.
 * Las reglas de la base (RLS) ya filtran por empresa: un admin solo recibe lo suyo.
 */

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// 1. ESTADO
// ============================================================================
const state = {
  perfil: null,
  choferes: [],
  usuarios: [],
  viajes: [],
  eventos: [],

  currentAppView: "inicio",
  activeFilter: "all",
  searchQuery: "",
  activeView: "grid",
  clockInterval: null,

  modalChoferId: null,
  modalInterval: null,

  chartTab: "dia",
  chartTripId: null,

  historyDriverFilter: "all",
  historySeverityFilter: "all",
  historySearchQuery: "",

  empresas: [],
  admins: [],
  adminEnEdicion: null,
  choferEnEdicion: null,
  pendingAdmins: []
};

// ============================================================================
// 2. REFERENCIAS AL DOM
// ============================================================================
const $ = (id) => document.getElementById(id);

const DOM = {
  loginScreen: $("loginScreen"),
  loginForm: $("loginForm"),
  loginUser: $("loginUser"),
  loginPass: $("loginPass"),
  loginError: $("loginError"),
  loginBtn: $("loginBtn"),
  linkOlvide: $("linkOlvide"),
  recuperarForm: $("recuperarForm"),
  recuperarUser: $("recuperarUser"),
  recuperarMail: $("recuperarMail"),
  recuperarError: $("recuperarError"),
  recuperarOk: $("recuperarOk"),
  recuperarBtn: $("recuperarBtn"),
  linkVolverLogin: $("linkVolverLogin"),
  appRoot: $("appRoot"),
  sessionInfo: $("sessionInfo"),
  logoutBtn: $("logoutBtn"),

  navMenuBtn: $("navMenuBtn"),
  navDropdownMenu: $("navDropdownMenu"),
  currentViewLabel: $("currentViewLabel"),
  dropdownItems: document.querySelectorAll(".dropdown-item"),
  views: {
    inicio: $("viewInicio"),
    historial: $("viewHistorial"),
    alta: $("viewAlta"),
    "superadmin-add": $("viewSuperadminAdd"),
    "superadmin-edit": $("viewSuperadminEdit"),
    "admin-edit": $("viewAdminChoferesEdit"),
    cuenta: $("viewCuenta")
  },

  countTotal: $("countTotal"),
  countEnRuta: $("countEnRuta"),
  countNormal: $("countNormal"),
  countWarning: $("countWarning"),
  countDanger: $("countDanger"),
  pctNormal: $("pctNormal"),
  pctWarning: $("pctWarning"),
  pctDanger: $("pctDanger"),
  kpiCards: {
    all: $("kpiTotalCard"),
    normal: $("kpiNormalCard"),
    precaucion: $("kpiWarningCard"),
    alerta: $("kpiDangerCard")
  },

  searchInput: $("searchInput"),
  clearSearchBtn: $("clearSearchBtn"),
  filterButtons: document.querySelectorAll(".filter-btn"),
  btnGridView: $("btnGridView"),
  btnTableView: $("btnTableView"),
  driversGrid: $("driversGrid"),
  driversTableWrapper: $("driversTableWrapper"),
  driversTableBody: $("driversTableBody"),
  emptyState: $("emptyState"),
  resetFiltersBtn: $("resetFiltersBtn"),
  eventsList: $("eventsList"),
  eventsCount: $("eventsCount"),

  historyDriverSelect: $("historyDriverSelect"),
  historySeveritySelect: $("historySeveritySelect"),
  historySearchInput: $("historySearchInput"),
  historyTableBody: $("historyTableBody"),
  historyEmptyState: $("historyEmptyState"),
  hkpiTotal: $("hkpiTotal"),
  hkpiNivel1: $("hkpiNivel1"),
  hkpiNivel2: $("hkpiNivel2"),
  hkpiViajes: $("hkpiViajes"),
  hkpiHoras: $("hkpiHoras"),
  chartTabs: document.querySelectorAll("[data-chart]"),
  chartCardDia: $("chartCardDia"),
  chartCardViaje: $("chartCardViaje"),
  chartTripSelect: $("chartTripSelect"),
  chartTripMeta: $("chartTripMeta"),
  tripChart: $("tripChart"),
  eventsChart: $("eventsChart"),

  newDriverForm: $("newDriverForm"),
  formNombre: $("formNombre"),
  formApellido: $("formApellido"),
  formDni: $("formDni"),
  formMail: $("formMail"),
  usuarioPreview: $("usuarioPreview"),
  btnSubmitAlta: $("btnSubmitAlta"),
  btnCancelAlta: $("btnCancelAlta"),
  altaResultado: $("altaResultado"),

  driverModal: $("driverModal"),
  closeModalBtn: $("closeModalBtn"),
  modalEnCurso: $("modalEnCurso"),
  modalMetrics: $("modalMetrics"),
  modalAvatar: $("modalAvatar"),
  modalDriverName: $("modalDriverName"),
  modalDriverMeta: $("modalDriverMeta"),
  modalStatusBanner: $("modalStatusBanner"),
  modalStatusDot: $("modalStatusDot"),
  modalStatusText: $("modalStatusText"),
  modalStatusDesc: $("modalStatusDesc"),
  modalNivel1: $("modalNivel1"),
  modalNivel2: $("modalNivel2"),
  modalEventsList: $("modalEventsList"),

  currentTime: $("currentTime"),
  toastContainer: $("toastContainer"),

  adminForm: $("adminForm"),
  adminFormTitle: $("adminFormTitle"),
  adminNombre: $("adminNombre"),
  adminApellido: $("adminApellido"),
  adminDni: $("adminDni"),
  adminMail: $("adminMail"),
  adminEmpresa: $("adminEmpresa"),
  adminCuit: $("adminCuit"),
  listaEmpresas: $("listaEmpresas"),
  adminUsuarioPreview: $("adminUsuarioPreview"),
  btnAddAnotherAdmin: $("btnAddAnotherAdmin"),
  btnSubmitAdmin: $("btnSubmitAdmin"),
  pendingAdminsContainer: $("pendingAdminsContainer"),
  pendingAdminsTableBody: $("pendingAdminsTableBody"),
  adminResultado: $("adminResultado"),

  editAdminFormContainer: $("editAdminFormContainer"),
  editAdminForm: $("editAdminForm"),
  editAdminNombre: $("editAdminNombre"),
  editAdminApellido: $("editAdminApellido"),
  editAdminDni: $("editAdminDni"),
  editAdminMail: $("editAdminMail"),
  editAdminEmpresa: $("editAdminEmpresa"),
  editAdminCuit: $("editAdminCuit"),
  listaEmpresasEdit: $("listaEmpresasEdit"),
  btnSubmitEditAdmin: $("btnSubmitEditAdmin"),
  btnCancelEditAdmin: $("btnCancelEditAdmin"),

  adminsTableBody: $("adminsTableBody"),
  adminsEmptyState: $("adminsEmptyState"),

  editChoferFormContainer: $("editChoferFormContainer"),
  editChoferForm: $("editChoferForm"),
  editChoferNombre: $("editChoferNombre"),
  editChoferApellido: $("editChoferApellido"),
  editChoferDni: $("editChoferDni"),
  editChoferMail: $("editChoferMail"),
  btnSubmitEditChofer: $("btnSubmitEditChofer"),
  btnCancelEditChofer: $("btnCancelEditChofer"),
  choferesEditTableBody: $("choferesEditTableBody"),
  choferesEditEmptyState: $("choferesEditEmptyState"),

  cuentaForm: $("cuentaForm"),
  cuentaAviso: $("cuentaAviso"),
  cuentaNombre: $("cuentaNombre"),
  cuentaApellido: $("cuentaApellido"),
  cuentaUsuario: $("cuentaUsuario"),
  cuentaMail: $("cuentaMail"),
  cuentaNuevaPass: $("cuentaNuevaPass"),
  cuentaConfirmarPass: $("cuentaConfirmarPass"),
  btnSubmitCuenta: $("btnSubmitCuenta")
};

// ============================================================================
// 2.a VER / OCULTAR CONTRASEÑA (el "ojito")
// ============================================================================
// Recorre todos los campos de contraseña de la página y le agrega a cada uno
// un botón para mostrar u ocultar lo que se escribió. Se hace desde acá y no
// en el HTML para que valga para todos los campos de una sola vez, incluidos
// los que se agreguen más adelante.

const SVG_OJO = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor"
  stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
  <circle cx="12" cy="12" r="3"></circle></svg>`;

const SVG_OJO_TACHADO = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor"
  stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
  <line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

function activarOjosDePassword(raiz = document) {
  raiz.querySelectorAll('input[type="password"]').forEach(input => {
    if (input.dataset.conOjo) return;          // no duplicar si ya lo tiene
    input.dataset.conOjo = "1";

    // Envolvemos el campo para poder apoyar el botón encima, a la derecha.
    const contenedor = document.createElement("div");
    contenedor.className = "password-wrap";
    input.parentNode.insertBefore(contenedor, input);
    contenedor.appendChild(input);

    const boton = document.createElement("button");
    boton.type = "button";                     // nunca envía el formulario
    boton.className = "password-toggle";
    boton.innerHTML = SVG_OJO;
    boton.setAttribute("aria-label", "Mostrar contraseña");
    boton.title = "Mostrar contraseña";

    boton.addEventListener("click", () => {
      const mostrar = input.type === "password";
      input.type = mostrar ? "text" : "password";
      boton.innerHTML = mostrar ? SVG_OJO_TACHADO : SVG_OJO;
      const etiqueta = mostrar ? "Ocultar contraseña" : "Mostrar contraseña";
      boton.setAttribute("aria-label", etiqueta);
      boton.title = etiqueta;
      input.focus();
    });

    contenedor.appendChild(boton);
  });
}

// ============================================================================
// 3. LOGIN Y SESIÓN
// ============================================================================

/** Convierte el usuario escrito en el mail interno que usa Supabase Auth. */
function mailDeLogin(usuario) {
  const u = usuario.trim().toLowerCase();
  return u.includes("@") ? u : `${u}@${DOMINIO_LOGIN}`;
}

async function iniciarSesion(e) {
  e.preventDefault();
  DOM.loginError.style.display = "none";

  // Aviso temprano si config.js quedó sin completar
  if (SUPABASE_URL.includes("XXXX") || SUPABASE_ANON_KEY.includes("PEGA-ACA")) {
    mostrarErrorLogin("Faltan completar la URL y la clave en config.js");
    return;
  }

  DOM.loginBtn.disabled = true;
  DOM.loginBtn.textContent = "Ingresando...";

  const mail = mailDeLogin(DOM.loginUser.value);
  console.log("Intentando entrar con:", mail);

  const { data, error } = await db.auth.signInWithPassword({
    email: mail,
    password: DOM.loginPass.value
  });

  DOM.loginBtn.disabled = false;
  DOM.loginBtn.textContent = "Ingresar";

  if (error) {
    console.error("Error de login:", error);
    mostrarErrorLogin(`Usuario o contraseña incorrecta`);
    return;
  }

  console.log("Sesión iniciada:", data.user.email);
  await entrarAlPanel();
}

function mostrarErrorLogin(texto) {
  DOM.loginError.textContent = texto;
  DOM.loginError.style.display = "block";
}

/** Se ejecuta al cargar la página y después de un login exitoso. */
async function entrarAlPanel() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) return mostrarLogin();

  // Traemos la ficha del usuario para saber si es admin.
  const { data: perfil, error } = await db
    .from("usuarios")
    .select("id, rol, nombre, apellido, usuario, mail, empresa_id, debe_cambiar_password, empresas(nombre)")
    .eq("id", session.user.id)
    .single();

  if (error || !perfil) {
    await db.auth.signOut();
    mostrarLogin();
    mostrarErrorLogin("El usuario no tiene ficha cargada en el sistema.");
    return;
  }

  if (perfil.rol === "chofer") {
    await db.auth.signOut();
    mostrarLogin();
    mostrarErrorLogin("Este panel es solo para administradores. Los conductores usan la app.");
    return;
  }

  state.perfil = perfil;
  DOM.loginScreen.style.display = "none";
  DOM.appRoot.style.display = "block";
  DOM.sessionInfo.textContent = perfil.rol === "superadmin"
    ? `${perfil.nombre} ${perfil.apellido} · Superadmin`
    : `${perfil.nombre} ${perfil.apellido} · ${perfil.empresas?.nombre || ""}`;

  // Cada rol ve solo los ítems de menú que le corresponden.
  DOM.dropdownItems.forEach(item => {
    const roles = (item.dataset.roles || "").split(",");
    item.style.display = roles.includes(perfil.rol) ? "" : "none";
  });

  arrancarReloj();

  if (perfil.rol === "superadmin") {
    cambiarVista("superadmin-add");
    await cargarDatosSuperadmin();
  } else {
    cambiarVista("inicio");
    await cargarDatos();
    escucharCambios();
  }

  // Si entró con una contraseña temporal, no puede usar el panel hasta cambiarla.
  if (perfil.debe_cambiar_password) forzarCambioPassword();
}

/** Vista inicial de cada rol. */
function vistaInicial() {
  return state.perfil?.rol === "superadmin" ? "superadmin-add" : "inicio";
}

/** Deja a la persona en "Mi cuenta", sin menú, hasta que cambie la contraseña. */
function forzarCambioPassword() {
  cambiarVista("cuenta");
  DOM.navMenuBtn.style.display = "none";
  DOM.cuentaAviso.style.display = "block";
}

function liberarNavegacion() {
  DOM.navMenuBtn.style.display = "";
  DOM.cuentaAviso.style.display = "none";
}

function mostrarLogin() {
  DOM.appRoot.style.display = "none";
  DOM.loginScreen.style.display = "flex";
  mostrarRecuperar(false);
}

// ============================================================================
// 3.a OLVIDÉ MI CONTRASEÑA
// ============================================================================
// La persona pone su usuario y su mail de contacto. La Edge Function
// "recuperar-password" controla que coincidan y, si es así, le manda una
// contraseña temporal nueva. Se llama sin sesión, solo con la clave pública.

/** Alterna entre el formulario de login y el de recuperar contraseña. */
function mostrarRecuperar(mostrar) {
  DOM.loginForm.style.display = mostrar ? "none" : "block";
  DOM.recuperarForm.style.display = mostrar ? "block" : "none";
  DOM.loginError.style.display = "none";
  DOM.recuperarError.style.display = "none";
  DOM.recuperarOk.style.display = "none";
  if (mostrar) {
    // Volvemos a dejar el formulario usable (si antes se había enviado, el
    // botón quedaba oculto y los campos bloqueados).
    DOM.recuperarBtn.style.display = "";
    DOM.recuperarBtn.disabled = false;
    DOM.recuperarBtn.textContent = "Enviar contraseña nueva";
    DOM.recuperarUser.disabled = false;
    DOM.recuperarMail.disabled = false;

    // Si ya había escrito el usuario en el login, se lo dejamos puesto.
    DOM.recuperarUser.value = DOM.loginUser.value.trim();
    DOM.recuperarMail.value = "";
    (DOM.recuperarUser.value ? DOM.recuperarMail : DOM.recuperarUser).focus();
  }
}

async function pedirPasswordNueva(e) {
  e.preventDefault();
  DOM.recuperarError.style.display = "none";
  DOM.recuperarOk.style.display = "none";

  const usuario = DOM.recuperarUser.value.trim().toLowerCase();
  const mail = DOM.recuperarMail.value.trim().toLowerCase();

  if (!usuario || !mail) {
    DOM.recuperarError.textContent = "Completá tu usuario y tu mail.";
    DOM.recuperarError.style.display = "block";
    return;
  }

  DOM.recuperarBtn.disabled = true;
  DOM.recuperarBtn.textContent = "Enviando...";

  let texto, ok;
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/recuperar-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ usuario, mail })
    });
    const data = await res.json().catch(() => ({}));
    ok = res.ok && !data.error;
    texto = ok ? data.mensaje : (data.error || `No se pudo enviar el pedido (código ${res.status}).`);
  } catch (err) {
    console.error("Error al pedir contraseña nueva:", err);
    ok = false;
    texto = "No hay conexión. Probá de nuevo en un rato.";
  }

  if (ok) {
    // Pedido enviado: sacamos el botón para que no lo puedan apretar de nuevo
    // y pedir varias contraseñas seguidas (cada pedido invalida el anterior).
    DOM.recuperarBtn.style.display = "none";
    DOM.recuperarUser.disabled = true;
    DOM.recuperarMail.disabled = true;
  } else {
    // Falló: lo dejamos intentar otra vez.
    DOM.recuperarBtn.disabled = false;
    DOM.recuperarBtn.textContent = "Enviar contraseña nueva";
  }

  const caja = ok ? DOM.recuperarOk : DOM.recuperarError;
  caja.textContent = texto;
  caja.style.display = "block";
}

async function cerrarSesion() {
  dejarDeEscuchar();
  await db.auth.signOut();
  location.reload();
}

// ============================================================================
// 3.b TIEMPO REAL
// ============================================================================
// Supabase avisa por un websocket cada vez que cambia una fila de viajes o
// eventos. Cuando llega un aviso se recarga todo y se redibuja (incluida la
// ficha del chofer, si esta abierta).
//
// Dos cuidados: no se recarga en cada aviso sino una vez por segundo como
// mucho, y si el websocket no engancha arranca un respaldo cada 20 segundos.

let canalVivo = null;
let recargaPendiente = null;
let respaldo = null;

function recargarPronto() {
  if (recargaPendiente) return;
  recargaPendiente = setTimeout(async () => {
    recargaPendiente = null;
    if (document.visibilityState === "hidden") return;
    await cargarDatos();
  }, 1000);
}

function escucharCambios() {
  if (canalVivo) return;

  canalVivo = db
    .channel("panel-admin")
    .on("postgres_changes", { event: "*", schema: "public", table: "eventos" }, recargarPronto)
    .on("postgres_changes", { event: "*", schema: "public", table: "viajes" }, recargarPronto)
    .subscribe((estado) => {
      if (estado === "SUBSCRIBED") {
        detenerRespaldo();
      } else if (estado === "CHANNEL_ERROR" || estado === "TIMED_OUT" || estado === "CLOSED") {
        arrancarRespaldo();
      }
    });

  setTimeout(() => {
    if (!canalVivo || canalVivo.state !== "joined") arrancarRespaldo();
  }, 8000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && state.perfil) cargarDatos();
  });
}

function arrancarRespaldo() {
  if (respaldo) return;
  respaldo = setInterval(() => {
    if (document.visibilityState === "visible" && state.perfil) cargarDatos();
  }, 20000);
}

function detenerRespaldo() {
  if (respaldo) {
    clearInterval(respaldo);
    respaldo = null;
  }
}

function dejarDeEscuchar() {
  detenerRespaldo();
  if (canalVivo) {
    db.removeChannel(canalVivo);
    canalVivo = null;
  }
}

// ============================================================================
// 4. CARGA DE DATOS
// ============================================================================
async function cargarDatos() {
  const [usuariosRes, viajesRes, eventosRes] = await Promise.all([
    db.from("usuarios")
      .select("id, rol, nombre, apellido, usuario, dni, mail, activo, empresa_id")
      .eq("rol", "chofer")
      .order("apellido"),
    db.from("viajes")
      .select("id, chofer_id, inicio, fin, estado, origen, destino")
      .order("inicio", { ascending: false })
      .limit(500),
    db.from("eventos")
      .select("id, viaje_id, tipo, nivel, ocurrido_en, valor")
      .order("ocurrido_en", { ascending: false })
      .limit(1000)
  ]);

  if (usuariosRes.error || viajesRes.error || eventosRes.error) {
    showToast("No se pudieron cargar los datos", "toast-error");
    console.error(usuariosRes.error || viajesRes.error || eventosRes.error);
    return;
  }

  state.usuarios = usuariosRes.data || [];
  state.viajes = viajesRes.data || [];
  state.eventos = eventosRes.data || [];

  armarChoferes();
  renderAll();
}

/**
 * Combina usuarios + viajes + eventos y calcula el estado actual de cada chofer.
 * El estado no está guardado en la base: se deduce de los eventos del viaje en curso.
 */
function armarChoferes() {
  const eventosPorViaje = {};
  state.eventos.forEach(ev => {
    (eventosPorViaje[ev.viaje_id] = eventosPorViaje[ev.viaje_id] || []).push(ev);
  });

  state.choferes = state.usuarios.map(u => {
    const viajes = state.viajes.filter(v => v.chofer_id === u.id);
    const viajeActual = viajes.find(v => v.estado === "en_curso") || null;
    const viajeRef = viajeActual || viajes[0] || null;
    const eventosRef = viajeRef ? (eventosPorViaje[viajeRef.id] || []) : [];

    let status = "normal";
    if (viajeActual) {
      const evs = eventosPorViaje[viajeActual.id] || [];
      if (evs.some(e => e.nivel === 2)) status = "alerta";
      else if (evs.some(e => e.nivel === 1)) status = "precaucion";
    }

    const todosLosEventos = viajes.flatMap(v => eventosPorViaje[v.id] || []);

    return {
      ...u,
      nombreCompleto: `${u.nombre} ${u.apellido}`,
      viajes,
      viajeActual,
      viajeRef,
      eventosRef,
      eventosTotales: todosLosEventos,
      nivel1: todosLosEventos.filter(e => e.nivel === 1).length,
      nivel2: todosLosEventos.filter(e => e.nivel === 2).length,
      horasTotales: viajes.reduce((acc, v) => acc + duracionHoras(v), 0),
      status
    };
  });
}

// ============================================================================
// 5. UTILIDADES
// ============================================================================
function duracionHoras(viaje) {
  const fin = viaje.fin ? new Date(viaje.fin) : new Date();
  return Math.max(0, (fin - new Date(viaje.inicio)) / 3600000);
}

function formatoDuracion(horas) {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function formatoFechaHora(iso) {
  const d = new Date(iso);
  return d.toLocaleString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function formatoHora(iso) {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function nombreTipo(tipo) {
  return { parpadeo_lento: "Parpadeo lento", cabeceo: "Cabeceo", otro: "Otro" }[tipo] || tipo;
}

function tramo(viaje) {
  if (!viaje) return "—";
  if (viaje.origen || viaje.destino) return `${viaje.origen || "?"} → ${viaje.destino || "?"}`;
  return formatoFechaHora(viaje.inicio);
}

function iniciales(nombre, apellido) {
  return `${(nombre || "")[0] || ""}${(apellido || "")[0] || ""}`.toUpperCase();
}

function getStatusConfig(status) {
  return {
    normal:     { label: "Normal",     badgeClass: "badge-normal",  colorClass: "normal"  },
    precaucion: { label: "Precaución", badgeClass: "badge-warning", colorClass: "warning" },
    alerta:     { label: "Alerta",     badgeClass: "badge-danger",  colorClass: "danger"  }
  }[status] || { label: status, badgeClass: "badge-normal", colorClass: "normal" };
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** Misma regla que el trigger de la base, para mostrar el usuario sugerido. */
function sugerirUsuario(nombre, apellido) {
  const texto = ((nombre || "").charAt(0) + (apellido || ""))
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z]/g, "");
  return texto || "—";
}

// ============================================================================
// 6. RENDER
// ============================================================================
function renderAll() {
  renderKPIs();
  renderDrivers();
  renderFeed();
  renderHistorial();
  // Si la ficha de un chofer esta abierta, se redibuja con los datos nuevos.
  if (state.modalChoferId) pintarModal();
}

function renderKPIs() {
  // El panel principal mira solo la flota que esta manejando ahora.
  const enViaje = state.choferes.filter(c => c.viajeActual);
  const total = enViaje.length;
  const n = enViaje.filter(c => c.status === "normal").length;
  const p = enViaje.filter(c => c.status === "precaucion").length;
  const a = enViaje.filter(c => c.status === "alerta").length;
  const pct = (x) => total ? Math.round((x / total) * 100) + "%" : "0%";

  DOM.countTotal.textContent = total;
  DOM.countEnRuta.textContent = "en viaje ahora";
  DOM.countNormal.textContent = n;
  DOM.countWarning.textContent = p;
  DOM.countDanger.textContent = a;
  DOM.pctNormal.textContent = pct(n);
  DOM.pctWarning.textContent = pct(p);
  DOM.pctDanger.textContent = pct(a);

  Object.entries(DOM.kpiCards).forEach(([k, el]) => {
    if (el) el.classList.toggle("kpi-active", state.activeFilter === k);
  });
}

function choferesFiltrados() {
  const q = state.searchQuery.toLowerCase();
  return state.choferes.filter(c => {
    // Solo conductores manejando ahora: el panel es para seguir la flota
    // en vivo, el resto se mira en el historial.
    if (!c.viajeActual) return false;
    const coincideEstado = state.activeFilter === "all" || c.status === state.activeFilter;
    const coincideTexto = !q ||
      c.nombreCompleto.toLowerCase().includes(q) ||
      (c.usuario || "").toLowerCase().includes(q) ||
      (c.dni || "").includes(q);
    return coincideEstado && coincideTexto;
  });
}

function renderDrivers() {
  const lista = choferesFiltrados();
  const vacio = lista.length === 0;

  DOM.emptyState.style.display = vacio ? "block" : "none";
  DOM.driversGrid.style.display = (!vacio && state.activeView === "grid") ? "" : "none";
  DOM.driversTableWrapper.style.display = (!vacio && state.activeView === "table") ? "" : "none";

  if (vacio) return;
  if (state.activeView === "grid") renderGrid(lista);
  else renderTable(lista);
}

function renderGrid(lista) {
  DOM.driversGrid.innerHTML = "";
  lista.forEach(c => {
    const cfg = getStatusConfig(c.status);
    const card = document.createElement("article");
    card.className = `driver-card card-${c.status}`;
    card.innerHTML = `
      <div class="driver-card-header">
        <div class="driver-info-main">
          <div class="driver-avatar ${c.status === "alerta" ? "avatar-alerta" : ""}">
            ${escapeHtml(iniciales(c.nombre, c.apellido))}
          </div>
          <div class="driver-name-block">
            <h3>${escapeHtml(c.nombreCompleto)}</h3>
            <span class="driver-license">Usuario: ${escapeHtml(c.usuario)}</span>
          </div>
        </div>
        <span class="status-badge ${cfg.badgeClass}">
          <span class="status-bullet ${c.status === "alerta" ? "blink" : ""}"></span>
          ${cfg.label}
        </span>
      </div>

      <div class="driver-vehicle-meta">
        <div class="meta-row">
          <span class="meta-key">Estado:</span>
          <span class="meta-val">${c.viajeActual ? "Viaje en curso" : "Sin viaje activo"}</span>
        </div>
        <div class="meta-row">
          <span class="meta-key">${c.viajeActual ? "Recorrido:" : "Último viaje:"}</span>
          <span class="meta-val">${escapeHtml(tramo(c.viajeRef))}</span>
        </div>
        <div class="meta-row">
          <span class="meta-key">Duración:</span>
          <span class="meta-val">${c.viajeRef ? formatoDuracion(duracionHoras(c.viajeRef)) : "—"}</span>
        </div>
      </div>

      <div class="fatigue-section">
        <div class="fatigue-header">
          <span class="fatigue-label">Eventos en ${c.viajeActual ? "este viaje" : "el último viaje"}:</span>
          <span class="fatigue-score text-${cfg.colorClass}">${c.eventosRef.length}</span>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-card-detail" data-id="${c.id}">Más información</button>
      </div>`;
    card.querySelector(".btn-card-detail").addEventListener("click", () => abrirModal(c.id));
    DOM.driversGrid.appendChild(card);
  });
}

function renderTable(lista) {
  DOM.driversTableBody.innerHTML = "";
  lista.forEach(c => {
    const cfg = getStatusConfig(c.status);
    const tr = document.createElement("tr");
    if (c.status === "alerta") tr.className = "row-danger";
    tr.innerHTML = `
      <td>
        <div class="table-driver-col">
          <div class="mini-avatar">${escapeHtml(iniciales(c.nombre, c.apellido))}</div>
          <div>
            <strong>${escapeHtml(c.nombreCompleto)}</strong>
            <div style="font-size:.72rem;color:var(--text-muted);">DNI ${escapeHtml(c.dni)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(c.usuario)}</td>
      <td>${escapeHtml(tramo(c.viajeRef))}</td>
      <td><strong>${c.viajeRef ? formatoDuracion(duracionHoras(c.viajeRef)) : "—"}</strong></td>
      <td>${c.eventosRef.length}</td>
      <td>
        <span class="status-badge ${cfg.badgeClass}">
          <span class="status-bullet ${c.status === "alerta" ? "blink" : ""}"></span>${cfg.label}
        </span>
      </td>
      <td class="text-right"><button class="btn-table-action" data-id="${c.id}">Detalles</button></td>`;
    tr.querySelector(".btn-table-action").addEventListener("click", () => abrirModal(c.id));
    DOM.driversTableBody.appendChild(tr);
  });
}

/** Feed lateral: los últimos 15 eventos de toda la empresa. */
function renderFeed() {
  const porViaje = {};
  state.viajes.forEach(v => porViaje[v.id] = v);
  const nombrePorChofer = {};
  state.usuarios.forEach(u => nombrePorChofer[u.id] = `${u.nombre} ${u.apellido}`);

  // Solo eventos de viajes abiertos: cuando el chofer finaliza el viaje,
  // sus alertas salen de esta lista y quedan en el historial.
  const ultimos = state.eventos
    .filter(ev => {
      const viaje = porViaje[ev.viaje_id];
      return viaje && viaje.estado === "en_curso";
    })
    .slice(0, 15);

  DOM.eventsCount.textContent = ultimos.length;
  DOM.eventsList.innerHTML = "";

  if (!ultimos.length) {
    DOM.eventsList.innerHTML =
      `<p class="feed-empty">No hay alertas en los viajes en curso.</p>`;
    return;
  }

  ultimos.forEach(ev => {
    const viaje = porViaje[ev.viaje_id];
    const chofer = viaje ? nombrePorChofer[viaje.chofer_id] : "—";
    const item = document.createElement("div");
    item.className = `event-item ${ev.nivel === 2 ? "event-item-danger" : "event-item-warning"}`;
    item.innerHTML = `
      <span class="event-time">${formatoHora(ev.ocurrido_en)}</span>
      <div class="event-content">
        <strong>${escapeHtml(chofer)}</strong>
        <p>${nombreTipo(ev.tipo)} · nivel ${ev.nivel}${ev.valor ? ` · ${ev.valor} ms` : ""}</p>
      </div>`;
    if (viaje) {
      item.style.cursor = "pointer";
      item.addEventListener("click", () => abrirModal(viaje.chofer_id));
    }
    DOM.eventsList.appendChild(item);
  });
}

// ============================================================================
// 7. HISTORIAL
// ============================================================================
function renderHistorial() {
  // Selector de conductores
  if (DOM.historyDriverSelect.options.length <= 1) {
    state.choferes.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nombreCompleto;
      DOM.historyDriverSelect.appendChild(opt);
    });
  }

  const porViaje = {};
  state.viajes.forEach(v => porViaje[v.id] = v);
  const nombrePorChofer = {};
  state.usuarios.forEach(u => nombrePorChofer[u.id] = `${u.nombre} ${u.apellido}`);

  const q = state.historySearchQuery.toLowerCase();
  const filas = state.eventos
    .map(ev => {
      const viaje = porViaje[ev.viaje_id];
      return {
        ...ev,
        viaje,
        choferId: viaje ? viaje.chofer_id : null,
        chofer: viaje ? nombrePorChofer[viaje.chofer_id] : "—"
      };
    })
    .filter(f => {
      const okChofer = state.historyDriverFilter === "all" || f.choferId === state.historyDriverFilter;
      const okNivel = state.historySeverityFilter === "all" || String(f.nivel) === state.historySeverityFilter;
      const okTexto = !q ||
        (f.chofer || "").toLowerCase().includes(q) ||
        nombreTipo(f.tipo).toLowerCase().includes(q) ||
        tramo(f.viaje).toLowerCase().includes(q);
      return okChofer && okNivel && okTexto;
    });

  DOM.hkpiTotal.textContent = filas.length;
  DOM.hkpiNivel1.textContent = filas.filter(f => f.nivel === 1).length;
  DOM.hkpiNivel2.textContent = filas.filter(f => f.nivel === 2).length;
  // Si hay un conductor elegido, estos dos numeros son de el; si no, de toda
  // la flota.
  const choferElegido = state.historyDriverFilter === "all"
    ? null
    : state.choferes.find(c => c.id === state.historyDriverFilter);

  DOM.hkpiViajes.textContent = choferElegido
    ? choferElegido.viajes.length
    : state.viajes.length;

  DOM.hkpiHoras.textContent = formatoDuracion(
    choferElegido
      ? choferElegido.horasTotales
      : state.viajes.reduce((acc, v) => acc + duracionHoras(v), 0)
  );

  DOM.historyEmptyState.style.display = filas.length ? "none" : "block";
  DOM.historyTableBody.innerHTML = "";

  filas.slice(0, 200).forEach(f => {
    const tr = document.createElement("tr");
    if (f.nivel === 2) tr.className = "row-danger";
    tr.innerHTML = `
      <td>${formatoFechaHora(f.ocurrido_en)}</td>
      <td><strong>${escapeHtml(f.chofer)}</strong></td>
      <td>${escapeHtml(tramo(f.viaje))}</td>
      <td>${nombreTipo(f.tipo)}</td>
      <td><span class="status-badge ${f.nivel === 2 ? "badge-danger" : "badge-warning"}">Nivel ${f.nivel}</span></td>
      <td>${f.valor != null ? f.valor : "—"}</td>`;
    DOM.historyTableBody.appendChild(tr);
  });

  dibujarGrafico(filas);
  armarSelectorDeViajes();
  dibujarGraficoViaje();
}

/**
 * Llena el desplegable de viajes de la solapa "Eventos por viaje".
 * Respeta el conductor elegido arriba y conserva el viaje que estaba elegido.
 */
/**
 * Grafico de la solapa derecha: cada evento del viaje elegido, ubicado en el
 * momento en que ocurrio. El eje horizontal es el tiempo del viaje; la altura
 * y el color indican el nivel.
 */
function dibujarGraficoViaje() {
  const canvas = DOM.tripChart;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const ancho = canvas.parentElement.clientWidth || 800;
  const alto = 240;

  canvas.width = ancho * ratio;
  canvas.height = alto * ratio;
  canvas.style.width = ancho + "px";
  canvas.style.height = alto + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, ancho, alto);

  const estilo = getComputedStyle(document.body);
  const colorTexto = estilo.getPropertyValue("--text-muted") || "#888";
  const colorLinea = "rgba(128,128,128,0.25)";
  ctx.font = "11px Inter, sans-serif";

  const viaje = state.viajes.find(v => v.id === state.chartTripId);
  if (!viaje) {
    if (DOM.chartTripMeta) DOM.chartTripMeta.textContent = "";
    ctx.fillStyle = colorTexto;
    ctx.textAlign = "center";
    ctx.fillText("No hay viajes para mostrar.", ancho / 2, alto / 2);
    return;
  }

  const eventos = state.eventos
    .filter(ev => ev.viaje_id === viaje.id)
    .sort((a, b) => new Date(a.ocurrido_en) - new Date(b.ocurrido_en));

  const t0 = new Date(viaje.inicio).getTime();
  const t1 = viaje.fin ? new Date(viaje.fin).getTime() : Date.now();
  // Piso de un minuto para que un viaje recien arrancado no quede aplastado.
  const duracion = Math.max(60000, t1 - t0);

  if (DOM.chartTripMeta) {
    DOM.chartTripMeta.textContent =
      `${eventos.length} eventos · ${formatoDuracion(duracionHoras(viaje))}` +
      (viaje.estado === "en_curso" ? " · en curso" : "");
  }

  const margenIzq = 44, margenDer = 14, margenAbajo = 28, margenArriba = 18;
  const areaAncho = ancho - margenIzq - margenDer;
  const areaAlto = alto - margenAbajo - margenArriba;
  const base = margenArriba + areaAlto;

  const xDe = (ms) => margenIzq + ((ms - t0) / duracion) * areaAncho;
  const yDe = (nivel) => base - (nivel === 2 ? areaAlto * 0.85 : areaAlto * 0.45);

  // Lineas guia de los dos niveles
  ctx.strokeStyle = colorLinea;
  ctx.lineWidth = 1;
  ctx.fillStyle = colorTexto;
  [1, 2].forEach(nivel => {
    const y = yDe(nivel);
    ctx.beginPath();
    ctx.moveTo(margenIzq, y);
    ctx.lineTo(ancho - margenDer, y);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(`N${nivel}`, margenIzq - 8, y + 4);
  });

  // Linea del piso (el recorrido del viaje)
  ctx.beginPath();
  ctx.moveTo(margenIzq, base);
  ctx.lineTo(ancho - margenDer, base);
  ctx.stroke();

  // Marcas de tiempo
  ctx.textAlign = "center";
  for (let i = 0; i <= 4; i++) {
    const ms = t0 + (duracion * i) / 4;
    ctx.fillText(formatoHora(new Date(ms).toISOString()), xDe(ms), alto - 10);
  }

  if (!eventos.length) {
    ctx.fillStyle = colorTexto;
    ctx.fillText("Sin eventos en este viaje.", ancho / 2, margenArriba + areaAlto / 2);
    return;
  }

  // Un palito con su punto por cada evento
  eventos.forEach(ev => {
    const x = xDe(new Date(ev.ocurrido_en).getTime());
    const y = yDe(ev.nivel);
    const color = ev.nivel === 2 ? "#ef4444" : "#f59e0b";

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, base);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function armarSelectorDeViajes() {
  if (!DOM.chartTripSelect) return;

  const nombrePorChofer = {};
  state.usuarios.forEach(u => nombrePorChofer[u.id] = `${u.nombre} ${u.apellido}`);

  const viajes = state.viajes.filter(v =>
    state.historyDriverFilter === "all" || v.chofer_id === state.historyDriverFilter
  );

  // Si el viaje elegido ya no esta en la lista, se toma el mas reciente.
  if (!viajes.some(v => v.id === state.chartTripId)) {
    state.chartTripId = viajes.length ? viajes[0].id : null;
  }

  DOM.chartTripSelect.innerHTML = viajes.length
    ? viajes.map(v => {
        const etiqueta = `${formatoFechaHora(v.inicio)} · ${tramo(v)}` +
          (state.historyDriverFilter === "all"
            ? ` · ${nombrePorChofer[v.chofer_id] || ""}`
            : "") +
          (v.estado === "en_curso" ? " · en curso" : "");
        return `<option value="${v.id}">${escapeHtml(etiqueta)}</option>`;
      }).join("")
    : `<option value="">Sin viajes para mostrar</option>`;

  if (state.chartTripId) DOM.chartTripSelect.value = state.chartTripId;
}

/** Gráfico de barras: eventos por día de los últimos 14 días. */
function dibujarGrafico(filas) {
  const canvas = DOM.eventsChart;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const ancho = canvas.parentElement.clientWidth || 800;
  const alto = 240;

  canvas.width = ancho * ratio;
  canvas.height = alto * ratio;
  canvas.style.width = ancho + "px";
  canvas.style.height = alto + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, ancho, alto);

  // Armado de los 14 días
  const dias = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    dias.push({ fecha: d, n1: 0, n2: 0 });
  }
  filas.forEach(f => {
    const d = new Date(f.ocurrido_en);
    d.setHours(0, 0, 0, 0);
    const dia = dias.find(x => x.fecha.getTime() === d.getTime());
    if (dia) f.nivel === 2 ? dia.n2++ : dia.n1++;
  });

  const maxVal = Math.max(1, ...dias.map(d => d.n1 + d.n2));
  const margenIzq = 34, margenAbajo = 28, margenArriba = 12;
  const areaAlto = alto - margenAbajo - margenArriba;
  const areaAncho = ancho - margenIzq - 10;
  const paso = areaAncho / dias.length;
  const barra = Math.min(28, paso * 0.6);

  const estilo = getComputedStyle(document.body);
  const colorTexto = estilo.getPropertyValue("--text-muted") || "#888";
  const colorLinea = "rgba(128,128,128,0.25)";

  // Grilla horizontal
  ctx.font = "11px Inter, sans-serif";
  ctx.fillStyle = colorTexto;
  ctx.strokeStyle = colorLinea;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((maxVal / 4) * i);
    const y = margenArriba + areaAlto - (areaAlto * i / 4);
    ctx.beginPath();
    ctx.moveTo(margenIzq, y);
    ctx.lineTo(ancho - 10, y);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(val, margenIzq - 8, y + 4);
  }

  // Barras apiladas
  dias.forEach((d, i) => {
    const x = margenIzq + paso * i + (paso - barra) / 2;
    const h1 = (d.n1 / maxVal) * areaAlto;
    const h2 = (d.n2 / maxVal) * areaAlto;
    const base = margenArriba + areaAlto;

    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(x, base - h1, barra, h1);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x, base - h1 - h2, barra, h2);

    ctx.fillStyle = colorTexto;
    ctx.textAlign = "center";
    ctx.fillText(`${d.fecha.getDate()}/${d.fecha.getMonth() + 1}`, x + barra / 2, alto - 10);
  });
}

// ============================================================================
// 8. MODAL DE DETALLE
// ============================================================================
function abrirModal(choferId) {
  state.modalChoferId = choferId;
  if (!pintarModal()) return;

  DOM.driverModal.style.display = "flex";
  DOM.driverModal.setAttribute("aria-hidden", "false");

  // Mientras la ficha este abierta se repinta sola cada 30 segundos, asi la
  // duracion del viaje en curso no se queda congelada. Los eventos nuevos
  // llegan antes, por el aviso de tiempo real.
  clearInterval(state.modalInterval);
  state.modalInterval = setInterval(pintarModal, 30000);
}

/**
 * Llena la ficha del chofer con lo que hay ahora en state.
 * Se usa al abrirla y cada vez que llegan datos nuevos.
 */
function pintarModal() {
  const c = state.choferes.find(x => x.id === state.modalChoferId);
  if (!c) return false;

  const cfg = getStatusConfig(c.status);
  DOM.modalAvatar.textContent = iniciales(c.nombre, c.apellido);
  DOM.modalDriverName.textContent = c.nombreCompleto;
  DOM.modalDriverMeta.textContent = `Usuario: ${c.usuario} · DNI ${c.dni} · ${c.mail}`;
  DOM.modalStatusText.textContent = cfg.label.toUpperCase();
  DOM.modalStatusDesc.textContent = c.viajeActual
    ? `Viaje en curso desde ${formatoFechaHora(c.viajeActual.inicio)}`
    : "Sin viaje activo en este momento";
  DOM.modalStatusDot.className = `status-indicator-dot dot-${c.status}`;
  DOM.modalStatusBanner.className = `modal-status-banner banner-${c.status}`;

  const v = c.viajeActual;

  // Eventos SOLO del viaje en curso: nada de sumar viajes anteriores.
  const eventos = v
    ? c.eventosTotales
        .filter(ev => ev.viaje_id === v.id)
        .sort((a, b) => new Date(b.ocurrido_en) - new Date(a.ocurrido_en))
    : [];

  DOM.modalMetrics.style.display = v ? "" : "none";
  DOM.modalNivel1.textContent = eventos.filter(e => e.nivel === 1).length;
  DOM.modalNivel2.textContent = eventos.filter(e => e.nivel === 2).length;

  DOM.modalEnCurso.innerHTML = v ? `
    <h4 class="section-subtitle">Viaje en curso</h4>
    <div class="modal-trip-info">
      <div class="trip-item">
        <span class="trip-key">Recorrido</span>
        <span class="trip-val">${escapeHtml(tramo(v))}</span>
      </div>
      <div class="trip-item">
        <span class="trip-key">Arranco</span>
        <span class="trip-val">${formatoFechaHora(v.inicio)}</span>
      </div>
      <div class="trip-item">
        <span class="trip-key">Lleva manejando</span>
        <span class="trip-val">${formatoDuracion(duracionHoras(v))}</span>
      </div>
    </div>` : `<p class="feed-empty">Este conductor no tiene un viaje en curso.</p>`;

  DOM.modalEventsList.innerHTML = eventos.length
    ? eventos.slice(0, 20).map(itemEvento).join("")
    : `<p class="feed-empty">Todavia no hubo eventos en este viaje.</p>`;

  return true;
}

function itemEvento(ev) {
  return `
    <div class="event-item ${ev.nivel === 2 ? "event-item-danger" : "event-item-warning"}">
      <span class="event-time">${formatoHora(ev.ocurrido_en)}</span>
      <div class="event-content">
        <strong>${nombreTipo(ev.tipo)}</strong>
        <p>Nivel ${ev.nivel}${ev.valor ? ` · ${ev.valor} ms` : ""} · ${formatoFechaHora(ev.ocurrido_en)}</p>
      </div>
    </div>`;
}

function cerrarModal() {
  state.modalChoferId = null;
  clearInterval(state.modalInterval);
  state.modalInterval = null;
  DOM.driverModal.style.display = "none";
  DOM.driverModal.setAttribute("aria-hidden", "true");
}

// ============================================================================
// 9. ALTA DE CONDUCTOR
// ============================================================================
async function altaConductor(e) {
  e.preventDefault();

  const nombre = DOM.formNombre.value.trim();
  const apellido = DOM.formApellido.value.trim();
  const dni = DOM.formDni.value.trim();
  const mail = DOM.formMail.value.trim();

  if (!nombre || !apellido || !dni || !mail) {
    showToast("Completá todos los campos", "toast-error");
    return;
  }

  DOM.btnSubmitAlta.disabled = true;
  DOM.btnSubmitAlta.textContent = "Registrando...";

  // La creación del usuario necesita permisos privilegiados, así que corre
  // en una función del servidor (Edge Function), no acá en el navegador.
  const { data, error } = await db.functions.invoke("alta-usuario", {
    body: { nombre, apellido, dni, mail }
  });

  DOM.btnSubmitAlta.disabled = false;
  DOM.btnSubmitAlta.textContent = "Registrar conductor";

  if (error || data?.error) {
    showToast(data?.error || "No se pudo registrar el conductor", "toast-error");
    return;
  }

  DOM.altaResultado.style.display = "block";
  DOM.altaResultado.innerHTML = `
    <h4>Conductor registrado</h4>
    <p>${data.mail_enviado ? "Le mandamos estos datos por mail. Por las dudas, quedan acá:" : "No se pudo mandar el mail. Pasale estos datos a mano:"}</p>
    <div class="credencial"><span>Usuario</span><strong>${escapeHtml(data.usuario)}</strong></div>
    <div class="credencial"><span>Contraseña temporal</span><strong>${escapeHtml(data.password)}</strong></div>
    <p class="credencial-nota">Se le pedirá cambiarla en el primer ingreso.</p>`;

  DOM.newDriverForm.reset();
  DOM.usuarioPreview.textContent = "—";
  showToast("Conductor dado de alta", "toast-success");
  await cargarDatos();
}

// ============================================================================
// 9b. SUPERADMIN — gestión de administradores
// ============================================================================
async function cargarDatosSuperadmin() {
  const [empresasRes, adminsRes] = await Promise.all([
    db.from("empresas").select("id, nombre, cuit").eq("activa", true).order("nombre"),
    db.from("usuarios")
      .select("id, nombre, apellido, usuario, dni, mail, activo, empresa_id, empresas(nombre, cuit)")
      .eq("rol", "admin")
      .order("apellido")
  ]);

  if (empresasRes.error || adminsRes.error) {
    showToast("No se pudieron cargar los administradores", "toast-error");
    console.error(empresasRes.error || adminsRes.error);
    return;
  }

  state.empresas = empresasRes.data || [];
  state.admins = adminsRes.data || [];

  DOM.listaEmpresas.innerHTML = state.empresas
    .map(e => `<option value="${escapeHtml(e.nombre)}"></option>`).join("");
  DOM.listaEmpresasEdit.innerHTML = DOM.listaEmpresas.innerHTML;

  renderAdmins();
}

function renderAdmins() {
  DOM.adminsEmptyState.style.display = state.admins.length ? "none" : "block";
  DOM.adminsTableBody.innerHTML = "";

  state.admins.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="table-driver-col">
          <div class="mini-avatar">${escapeHtml(iniciales(a.nombre, a.apellido))}</div>
          <div>
            <strong>${escapeHtml(a.nombre)} ${escapeHtml(a.apellido)}</strong>
            <div style="font-size:.72rem;color:var(--text-muted);">${escapeHtml(a.mail)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(a.usuario)}</td>
      <td>${escapeHtml(a.empresas?.nombre || "—")}</td>
      <td>
        <span class="status-badge ${a.activo ? "badge-normal" : "badge-danger"}">
          ${a.activo ? "Activo" : "Dado de baja"}
        </span>
      </td>
      <td class="text-right">
        <button class="btn-table-action" data-action="editar" data-id="${a.id}">Editar</button>
        <button class="btn-table-action" data-action="baja" data-id="${a.id}">
          ${a.activo ? "Dar de baja" : "Reactivar"}
        </button>
      </td>`;
    tr.querySelector('[data-action="editar"]').addEventListener("click", () => editarAdmin(a.id));
    tr.querySelector('[data-action="baja"]').addEventListener("click", () => alternarBajaAdmin(a));
    DOM.adminsTableBody.appendChild(tr);
  });
}

function editarAdmin(id) {
  const a = state.admins.find(x => x.id === id);
  if (!a) return;

  state.adminEnEdicion = id;
  DOM.editAdminFormTitle = $("editAdminFormTitle");
  if (DOM.editAdminFormTitle) DOM.editAdminFormTitle.textContent = `Editando a ${a.nombre} ${a.apellido}`;
  DOM.editAdminNombre.value = a.nombre;
  DOM.editAdminApellido.value = a.apellido;
  DOM.editAdminDni.value = a.dni;
  DOM.editAdminMail.value = a.mail;
  DOM.editAdminEmpresa.value = a.empresas?.nombre || "";
  DOM.editAdminCuit.value = a.empresas?.cuit || "";
  DOM.editAdminFormContainer.style.display = "block";
  DOM.editAdminForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelarEdicionAdmin() {
  state.adminEnEdicion = null;
  DOM.editAdminForm.reset();
  DOM.editAdminFormContainer.style.display = "none";
}

async function alternarBajaAdmin(a) {
  const { error } = await db.from("usuarios").update({ activo: !a.activo }).eq("id", a.id);
  if (error) {
    showToast("No se pudo actualizar: " + error.message, "toast-error");
    return;
  }
  showToast(a.activo ? "Administrador dado de baja" : "Administrador reactivado");
  await cargarDatosSuperadmin();
}

async function resolverEmpresa(nombreEmpresa, cuit) {
  const limpio = nombreEmpresa.trim();
  if (!limpio) return { error: "Falta el nombre de la empresa." };

  const { data: encontradas, error: errBuscar } = await db
    .from("empresas")
    .select("id, nombre")
    .ilike("nombre", limpio)
    .limit(1);

  if (errBuscar) return { error: errBuscar.message };
  if (encontradas && encontradas.length) return { id: encontradas[0].id, creada: false };

  const { data: nueva, error: errCrear } = await db
    .from("empresas")
    .insert({ nombre: limpio, cuit: cuit || null })
    .select("id")
    .single();

  if (errCrear) return { error: "No se pudo crear la empresa: " + errCrear.message };
  return { id: nueva.id, creada: true };
}

function agregarAdminPendiente() {
  const nombre = DOM.adminNombre.value.trim();
  const apellido = DOM.adminApellido.value.trim();
  const dni = DOM.adminDni.value.trim();
  const mail = DOM.adminMail.value.trim();
  const empresa = DOM.adminEmpresa.value.trim();
  const cuit = DOM.adminCuit.value.trim();

  if (!nombre || !apellido || !dni || !mail || !empresa || !cuit) {
    showToast("Completá todos los campos", "toast-error");
    return;
  }

  state.pendingAdmins.push({ nombre, apellido, dni, mail, empresa, cuit, id: Date.now() });
  renderPendingAdmins();
  DOM.adminForm.reset();
  DOM.adminUsuarioPreview.textContent = "—";
}

function renderPendingAdmins() {
  DOM.pendingAdminsContainer.style.display = state.pendingAdmins.length ? "block" : "none";
  DOM.pendingAdminsTableBody.innerHTML = "";
  state.pendingAdmins.forEach((a) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(a.nombre)} ${escapeHtml(a.apellido)}</td>
      <td>${escapeHtml(a.dni)}</td>
      <td>${escapeHtml(a.mail)}</td>
      <td>${escapeHtml(a.empresa)}</td>
      <td>${escapeHtml(a.cuit)}</td>
      <td class="text-right">
        <button type="button" class="btn-table-action" onclick="eliminarAdminPendiente(${a.id})">Eliminar</button>
      </td>
    `;
    DOM.pendingAdminsTableBody.appendChild(tr);
  });
}

window.eliminarAdminPendiente = (id) => {
  state.pendingAdmins = state.pendingAdmins.filter(a => a.id !== id);
  renderPendingAdmins();
}

async function guardarAdmin(e) {
  e.preventDefault();

  const nombre = DOM.adminNombre.value.trim();
  if (nombre) {
     const apellido = DOM.adminApellido.value.trim();
     const dni = DOM.adminDni.value.trim();
     const mail = DOM.adminMail.value.trim();
     const empresa = DOM.adminEmpresa.value.trim();
     const cuit = DOM.adminCuit.value.trim();
     if (!apellido || !dni || !mail || !empresa || !cuit) {
        showToast("Completá todos los campos del admin actual", "toast-error");
        return;
     }
     state.pendingAdmins.push({ nombre, apellido, dni, mail, empresa, cuit, id: Date.now() });
     DOM.adminForm.reset();
     DOM.adminUsuarioPreview.textContent = "—";
     renderPendingAdmins();
  }

  if (state.pendingAdmins.length === 0) {
    showToast("No hay administradores para registrar", "toast-error");
    return;
  }

  DOM.btnSubmitAdmin.disabled = true;
  DOM.btnSubmitAdmin.textContent = "Registrando...";

  let htmlResult = "<h4>Administradores registrados</h4>";
  let errores = 0;

  for (const admin of state.pendingAdmins) {
    const empresa = await resolverEmpresa(admin.empresa, admin.cuit);
    if (empresa.error) {
      showToast(`Error empresa de ${admin.nombre}: ${empresa.error}`, "toast-error");
      errores++;
      continue;
    }
    const empresa_id = empresa.id;

    const { data, error } = await db.functions.invoke("alta-usuario", {
      body: { nombre: admin.nombre, apellido: admin.apellido, dni: admin.dni, mail: admin.mail, empresa_id }
    });

    if (error || data?.error) {
       showToast(`Error con ${admin.nombre}: ` + (data?.error || "No se pudo registrar"), "toast-error");
       errores++;
    } else {
       htmlResult += `
         <p>${escapeHtml(admin.nombre)} ${escapeHtml(admin.apellido)} ${data.mail_enviado ? "(mail enviado)" : "(no se pudo mandar el mail)"}:</p>
         <div class="credencial"><span>Usuario</span><strong>${escapeHtml(data.usuario)}</strong></div>
         <div class="credencial"><span>Contraseña temporal</span><strong>${escapeHtml(data.password)}</strong></div>`;
    }
  }

  DOM.btnSubmitAdmin.disabled = false;
  DOM.btnSubmitAdmin.textContent = "Registrar";

  if (errores < state.pendingAdmins.length) {
    DOM.adminResultado.style.display = "block";
    DOM.adminResultado.innerHTML = htmlResult + `<p class="credencial-nota">Se le pedirá cambiarla en el primer ingreso.</p>`;
    showToast("Proceso terminado", "toast-success");
  }

  state.pendingAdmins = [];
  renderPendingAdmins();
  await cargarDatosSuperadmin();
}

async function guardarEditAdmin(e) {
  e.preventDefault();

  const nombre = DOM.editAdminNombre.value.trim();
  const apellido = DOM.editAdminApellido.value.trim();
  const dni = DOM.editAdminDni.value.trim();
  const mail = DOM.editAdminMail.value.trim();
  const nombreEmpresa = DOM.editAdminEmpresa.value.trim();
  const cuit = DOM.editAdminCuit.value.trim();

  if (!nombre || !apellido || !dni || !mail || !nombreEmpresa || !cuit) {
    showToast("Completá todos los campos", "toast-error");
    return;
  }

  DOM.btnSubmitEditAdmin.disabled = true;

  const empresa = await resolverEmpresa(nombreEmpresa, cuit);
  if (empresa.error) {
    DOM.btnSubmitEditAdmin.disabled = false;
    showToast(empresa.error, "toast-error");
    return;
  }

  const { error } = await db.from("usuarios")
    .update({ nombre, apellido, dni, mail, empresa_id: empresa.id })
    .eq("id", state.adminEnEdicion);

  DOM.btnSubmitEditAdmin.disabled = false;

  if (error) {
    showToast("No se pudo guardar: " + error.message, "toast-error");
    return;
  }
  showToast("Administrador actualizado");
  cancelarEdicionAdmin();
  await cargarDatosSuperadmin();
}

// ============================================================================
// 9c. ADMIN — gestión de choferes
// ============================================================================
function renderChoferesEdit() {
  const lista = state.usuarios.filter(u => u.rol === "chofer");
  DOM.choferesEditEmptyState.style.display = lista.length ? "none" : "block";
  DOM.choferesEditTableBody.innerHTML = "";

  lista.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="table-driver-col">
          <div class="mini-avatar">${escapeHtml(iniciales(c.nombre, c.apellido))}</div>
          <div>
            <strong>${escapeHtml(c.nombre)} ${escapeHtml(c.apellido)}</strong>
            <div style="font-size:.72rem;color:var(--text-muted);">${escapeHtml(c.mail)}</div>
          </div>
        </div>
      </td>
      <td>${escapeHtml(c.usuario)}</td>
      <td>
        <span class="status-badge ${c.activo ? "badge-normal" : "badge-danger"}">
          ${c.activo ? "Activo" : "Dado de baja"}
        </span>
      </td>
      <td class="text-right">
        <button class="btn-table-action" data-action="editar-chofer" data-id="${c.id}">Editar</button>
        <button class="btn-table-action" data-action="baja-chofer" data-id="${c.id}">
          ${c.activo ? "Dar de baja" : "Reactivar"}
        </button>
      </td>`;
    tr.querySelector('[data-action="editar-chofer"]').addEventListener("click", () => editarChofer(c.id));
    tr.querySelector('[data-action="baja-chofer"]').addEventListener("click", () => alternarBajaChofer(c));
    DOM.choferesEditTableBody.appendChild(tr);
  });
}

function editarChofer(id) {
  const c = state.usuarios.find(x => x.id === id);
  if (!c) return;

  state.choferEnEdicion = id;
  const titulo = document.getElementById("editChoferFormTitle");
  if (titulo) titulo.textContent = `Editando a ${c.nombre} ${c.apellido}`;
  DOM.editChoferNombre.value = c.nombre;
  DOM.editChoferApellido.value = c.apellido;
  DOM.editChoferDni.value = c.dni;
  DOM.editChoferMail.value = c.mail;
  DOM.editChoferFormContainer.style.display = "block";
  DOM.editChoferForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelarEdicionChofer() {
  state.choferEnEdicion = null;
  DOM.editChoferForm.reset();
  DOM.editChoferFormContainer.style.display = "none";
}

async function alternarBajaChofer(c) {
  const { error } = await db.from("usuarios").update({ activo: !c.activo }).eq("id", c.id);
  if (error) {
    showToast("No se pudo actualizar: " + error.message, "toast-error");
    return;
  }
  showToast(c.activo ? "Conductor dado de baja" : "Conductor reactivado");
  await cargarDatos();
  if (state.currentAppView === "admin-edit") renderChoferesEdit();
}

async function guardarEditChofer(e) {
  e.preventDefault();

  const nombre = DOM.editChoferNombre.value.trim();
  const apellido = DOM.editChoferApellido.value.trim();
  const dni = DOM.editChoferDni.value.trim();
  const mail = DOM.editChoferMail.value.trim();

  if (!nombre || !apellido || !dni || !mail) {
    showToast("Completá todos los campos", "toast-error");
    return;
  }

  DOM.btnSubmitEditChofer.disabled = true;

  const { error } = await db.from("usuarios")
    .update({ nombre, apellido, dni, mail })
    .eq("id", state.choferEnEdicion);

  DOM.btnSubmitEditChofer.disabled = false;

  if (error) {
    showToast("No se pudo guardar: " + error.message, "toast-error");
    return;
  }
  showToast("Chofer actualizado");
  cancelarEdicionChofer();
  await cargarDatos();
  if (state.currentAppView === "admin-edit") renderChoferesEdit();
}

// ============================================================================
// 9d. MI CUENTA
// ============================================================================
function renderCuenta() {
  const p = state.perfil;
  DOM.cuentaNombre.value = p.nombre || "";
  DOM.cuentaApellido.value = p.apellido || "";
  DOM.cuentaUsuario.value = p.usuario || "";
  DOM.cuentaMail.value = p.mail || "";
  DOM.cuentaNuevaPass.value = "";
  DOM.cuentaConfirmarPass.value = "";
}

async function actualizarCuenta(e) {
  e.preventDefault();
  
  const p1 = DOM.cuentaNuevaPass.value;
  const p2 = DOM.cuentaConfirmarPass.value;
  
  if (!p1) {
    showToast("Ingresá una contraseña nueva", "toast-error");
    return;
  }
  if (p1 !== p2) {
    showToast("Las contraseñas no coinciden", "toast-error");
    return;
  }
  
  DOM.btnSubmitCuenta.disabled = true;
  DOM.btnSubmitCuenta.textContent = "Actualizando...";

  const { error } = await db.auth.updateUser({ password: p1 });

  DOM.btnSubmitCuenta.disabled = false;
  DOM.btnSubmitCuenta.textContent = "Actualizar Contraseña";

  if (error) {
    showToast("Error al actualizar: " + error.message, "toast-error");
    return;
  }

  // Marca en la ficha que ya no tiene una contraseña temporal. Se hace con
  // una función de la base porque nadie puede editar su propia fila.
  const { error: errMarca } = await db.rpc("marcar_password_cambiada");
  if (errMarca) console.error("No se pudo marcar la contraseña como cambiada:", errMarca);

  showToast("Contraseña actualizada con éxito");
  DOM.cuentaNuevaPass.value = "";
  DOM.cuentaConfirmarPass.value = "";

  if (state.perfil.debe_cambiar_password) {
    state.perfil.debe_cambiar_password = false;
    liberarNavegacion();
    cambiarVista(vistaInicial());
  }
}

// ============================================================================
// 10. VARIOS
// ============================================================================
function showToast(mensaje, clase = "toast-success") {
  const t = document.createElement("div");
  t.className = `toast ${clase}`;
  t.textContent = mensaje;
  DOM.toastContainer.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

function arrancarReloj() {
  const tick = () => DOM.currentTime.textContent = new Date().toLocaleTimeString("es-AR");
  tick();
  if (!state.clockInterval) state.clockInterval = setInterval(tick, 1000);
}

function cambiarVista(vista) {
  state.currentAppView = vista;
  Object.values(DOM.views).forEach(v => v.style.display = "none");
  DOM.views[vista].style.display = "block";
  DOM.currentViewLabel.textContent =
    { inicio: "Inicio", historial: "Ver historial", alta: "Registrar nuevo conductor",
      "superadmin-add": "Agregar Admin", "superadmin-edit": "Editar Admins",
      "admin-edit": "Editar Choferes", cuenta: "Mi Cuenta" }[vista];
  DOM.dropdownItems.forEach(i => i.classList.toggle("active", i.dataset.view === vista));
  DOM.navDropdownMenu.style.display = "none";
  if (vista === "historial") renderHistorial();
  if (vista === "admin-edit") renderChoferesEdit();
  if (vista === "cuenta") renderCuenta();
}

// ============================================================================
// 11. LISTENERS
// ============================================================================
function conectarEventos() {
  DOM.loginForm.addEventListener("submit", iniciarSesion);
  DOM.linkOlvide.addEventListener("click", () => mostrarRecuperar(true));
  DOM.linkVolverLogin.addEventListener("click", () => mostrarRecuperar(false));
  DOM.recuperarForm.addEventListener("submit", pedirPasswordNueva);
  DOM.logoutBtn.addEventListener("click", cerrarSesion);

  DOM.chartTabs.forEach(btn => btn.addEventListener("click", () => {
    state.chartTab = btn.dataset.chart;
    DOM.chartTabs.forEach(b => b.classList.toggle("active", b === btn));
    const porDia = state.chartTab === "dia";
    DOM.chartCardDia.style.display = porDia ? "" : "none";
    DOM.chartCardViaje.style.display = porDia ? "none" : "";
    // El canvas necesita redibujarse: mientras estaba oculto no tenia ancho.
    renderHistorial();
  }));

  DOM.chartTripSelect.addEventListener("change", (e) => {
    state.chartTripId = e.target.value || null;
    dibujarGraficoViaje();
  });

  DOM.navMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const abierto = DOM.navDropdownMenu.style.display === "block";
    DOM.navDropdownMenu.style.display = abierto ? "none" : "block";
  });
  document.addEventListener("click", () => DOM.navDropdownMenu.style.display = "none");
  DOM.dropdownItems.forEach(item =>
    item.addEventListener("click", () => cambiarVista(item.dataset.view)));

  DOM.filterButtons.forEach(btn => btn.addEventListener("click", () => {
    state.activeFilter = btn.dataset.status;
    DOM.filterButtons.forEach(b => b.classList.toggle("active", b === btn));
    renderKPIs();
    renderDrivers();
  }));

  Object.entries(DOM.kpiCards).forEach(([k, el]) => {
    if (!el) return;
    el.addEventListener("click", () => {
      state.activeFilter = k;
      DOM.filterButtons.forEach(b => b.classList.toggle("active", b.dataset.status === k));
      renderKPIs();
      renderDrivers();
    });
  });

  DOM.searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    DOM.clearSearchBtn.style.display = e.target.value ? "block" : "none";
    renderDrivers();
  });
  DOM.clearSearchBtn.addEventListener("click", () => {
    DOM.searchInput.value = "";
    state.searchQuery = "";
    DOM.clearSearchBtn.style.display = "none";
    renderDrivers();
  });
  DOM.resetFiltersBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.activeFilter = "all";
    DOM.searchInput.value = "";
    DOM.filterButtons.forEach(b => b.classList.toggle("active", b.dataset.status === "all"));
    renderKPIs();
    renderDrivers();
  });

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

  DOM.historyDriverSelect.addEventListener("change", (e) => {
    state.historyDriverFilter = e.target.value;
    renderHistorial();
  });
  DOM.historySeveritySelect.addEventListener("change", (e) => {
    state.historySeverityFilter = e.target.value;
    renderHistorial();
  });
  DOM.historySearchInput.addEventListener("input", (e) => {
    state.historySearchQuery = e.target.value;
    renderHistorial();
  });

  DOM.closeModalBtn.addEventListener("click", cerrarModal);
  DOM.driverModal.addEventListener("click", (e) => {
    if (e.target === DOM.driverModal) cerrarModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModal();
  });

  DOM.newDriverForm.addEventListener("submit", altaConductor);
  DOM.btnCancelAlta.addEventListener("click", () => {
    DOM.newDriverForm.reset();
    DOM.altaResultado.style.display = "none";
    DOM.usuarioPreview.textContent = "—";
  });
  [DOM.formNombre, DOM.formApellido].forEach(inp =>
    inp.addEventListener("input", () => {
      DOM.usuarioPreview.textContent =
        sugerirUsuario(DOM.formNombre.value, DOM.formApellido.value);
    }));

  DOM.adminForm.addEventListener("submit", guardarAdmin);
  DOM.btnAddAnotherAdmin.addEventListener("click", agregarAdminPendiente);
  [DOM.adminNombre, DOM.adminApellido].forEach(inp =>
    inp.addEventListener("input", () => {
      DOM.adminUsuarioPreview.textContent =
        sugerirUsuario(DOM.adminNombre.value, DOM.adminApellido.value);
    }));

  DOM.editAdminForm.addEventListener("submit", guardarEditAdmin);
  DOM.btnCancelEditAdmin.addEventListener("click", cancelarEdicionAdmin);
  DOM.editChoferForm.addEventListener("submit", guardarEditChofer);
  DOM.btnCancelEditChofer.addEventListener("click", cancelarEdicionChofer);

  DOM.cuentaForm.addEventListener("submit", actualizarCuenta);

  window.addEventListener("resize", () => {
    if (state.currentAppView === "historial") renderHistorial();
  });
}

// ============================================================================
// 12. ARRANQUE
// ============================================================================
conectarEventos();
activarOjosDePassword();
entrarAlPanel();