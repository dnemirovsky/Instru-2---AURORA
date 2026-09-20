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

  historyBusqueda: "",      // texto libre: nombre, apellido o usuario
  historyChoferId: null,    // si se eligió uno de los coincidentes, cuál

  empresas: [],
  admins: [],
  filtroEstadoAdmins: "todos",
  filtroEstadoChoferes: "todos",
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
  navDropdownWrapper: $("navDropdownWrapper"),
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
  countWarning: $("countWarning"),
  countDanger: $("countDanger"),
  pctWarning: $("pctWarning"),
  pctDanger: $("pctDanger"),
  kpiCards: {
    all: $("kpiTotalCard"),
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
  eventsList: $("eventsList"),
  eventsCount: $("eventsCount"),

  historySearchInput: $("historySearchInput"),
  historyClearBtn: $("historyClearBtn"),
  historyResultado: $("historyResultado"),
  historyCoincidencias: $("historyCoincidencias"),
  historyTableBody: $("historyTableBody"),
  historyEmptyState: $("historyEmptyState"),
  historyResultados: $("historyResultados"),
  historyEmptyTitulo: $("historyEmptyTitulo"),
  historyEmptyTexto: $("historyEmptyTexto"),
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

  // --- Carga masiva por CSV ---
  btnModoIndividual: $("btnModoIndividual"),
  btnModoCsv: $("btnModoCsv"),
  altaIndividual: $("altaIndividual"),
  altaCsv: $("altaCsv"),
  csvZonaCarga: $("csvZonaCarga"),
  csvDropzone: $("csvDropzone"),
  csvInput: $("csvInput"),
  csvArchivoInfo: $("csvArchivoInfo"),
  csvEditor: $("csvEditor"),
  csvThead: $("csvThead"),
  csvTbody: $("csvTbody"),
  btnAgregarColumna: $("btnAgregarColumna"),
  btnCsvAlta: $("btnCsvAlta"),
  btnCsvDescartar: $("btnCsvDescartar"),
  csvProgreso: $("csvProgreso"),
  csvBarraFill: $("csvBarraFill"),
  csvProgresoTexto: $("csvProgresoTexto"),
  csvResultado: $("csvResultado"),

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
  clockBtn: $("clockBtn"),
  brandHome: $("brandHome"),
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
  btnEstadoAdmins: $("btnEstadoAdmins"),
  menuEstadoAdmins: $("menuEstadoAdmins"),
  btnEstadoChoferes: $("btnEstadoChoferes"),
  menuEstadoChoferes: $("menuEstadoChoferes"),
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
  contadorChoferesTotal: $("contadorChoferesTotal"),
  contadorChoferesDetalle: $("contadorChoferesDetalle"),
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

  // ¿La cuenta sigue habilitada? Lo decide la base: el navegador no puede
  // ver si el administrador de la empresa fue dado de baja.
  const { data: estado } = await db.rpc("cuenta_habilitada");
  const motivos = {
    usuario_inactivo:  "Tu cuenta se encuentra desactivada. Comunicate con tu administrador.",
    empresa_inactiva:  "La cuenta de tu empresa se encuentra desactivada.",
    empresa_sin_admin: "La cuenta de tu empresa se encuentra desactivada.",
    sin_ficha:         "El usuario no tiene ficha cargada en el sistema."
  };
  if (estado && estado !== "activa") {
    await db.auth.signOut();
    mostrarLogin();
    mostrarErrorLogin(motivos[estado] || "No podés ingresar en este momento.");
    return;
  }

  if (perfil.rol === "chofer") {
    await db.auth.signOut();
    mostrarLogin();
    mostrarErrorLogin("Este panel es solo para administradores. Ingresá desde la app.");
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
      .select("id, rol, nombre, apellido, usuario, dni, mail, activo, empresa_id, estado_mail, debe_cambiar_password")
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
/**
 * Misma regla que el trigger de la base, para mostrar el usuario sugerido.
 * Ojo: acá se muestra la versión "ideal" (una letra del nombre + apellido).
 * Si ese usuario ya está ocupado, la base le va agregando letras del nombre
 * (jperez → juperez → julperez), así que el usuario final puede ser más
 * largo que el que se ve en la vista previa.
 */
/** Versión local: solo arma la forma básica, sin saber si está libre. */
function sugerirUsuario(nombre, apellido) {
  const texto = ((nombre || "").charAt(0) + (apellido || ""))
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z]/g, "");
  return texto || "—";
}

/**
 * Vista previa de verdad: le pregunta a la base cuál sería el usuario.
 * Hace falta porque desde el navegador no se pueden ver los usuarios de otras
 * empresas, así que antes sugería "mkatseye" aunque ya estuviera ocupado.
 * Se espera a que la persona deje de escribir para no consultar en cada tecla.
 */
const temporizadoresPreview = {};

function actualizarPreviewUsuario(destino, inputNombre, inputApellido) {
  const nombre = inputNombre.value.trim();
  const apellido = inputApellido.value.trim();

  if (!nombre || !apellido) {
    destino.textContent = nombre || apellido ? sugerirUsuario(nombre, apellido) : "—";
    destino.classList.remove("preview-confirmado");
    return;
  }

  // Mostramos la versión tentativa mientras llega la respuesta.
  destino.textContent = sugerirUsuario(nombre, apellido);
  destino.classList.remove("preview-confirmado");

  const clave = destino.id;
  clearTimeout(temporizadoresPreview[clave]);
  temporizadoresPreview[clave] = setTimeout(async () => {
    const { data, error } = await db.rpc("sugerir_usuario", {
      p_nombre: nombre, p_apellido: apellido
    });
    // Si la consulta falla, queda la versión tentativa: no rompe nada.
    if (error || !data) return;
    // Puede haber seguido escribiendo mientras tanto.
    if (inputNombre.value.trim() !== nombre || inputApellido.value.trim() !== apellido) return;

    destino.textContent = data;
    destino.classList.add("preview-confirmado");
  }, 350);
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
  DOM.countEnRuta.textContent = "En viaje";
  DOM.countWarning.textContent = p;
  DOM.countDanger.textContent = a;
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
/**
 * Devuelve los choferes que coinciden con lo que se escribió en el buscador,
 * o null si el campo está vacío (que significa "toda la flota").
 * Busca en nombre, apellido, nombre completo y nombre de usuario.
 */
function choferesBuscados() {
  const q = state.historyBusqueda.trim().toLowerCase();
  if (!q) return null;
  return state.choferes.filter(c =>
    (c.nombreCompleto || "").toLowerCase().includes(q) ||
    (c.nombre || "").toLowerCase().includes(q) ||
    (c.apellido || "").toLowerCase().includes(q) ||
    (c.usuario || "").toLowerCase().includes(q)
  );
}

function renderHistorial() {
  const coincidencias = choferesBuscados();
  const elegido = state.historyChoferId
    ? state.choferes.find(c => c.id === state.historyChoferId)
    : null;

  // A quién se le muestran los eventos:
  //   · sin búsqueda            -> toda la flota
  //   · una sola coincidencia   -> esa persona
  //   · uno elegido de la lista -> esa persona
  //   · varias sin elegir       -> nadie todavía: primero hay que elegir
  // El último caso es a propósito: un historial combinado de dos personas no
  // le sirve a nadie, y los totales de arriba sumarían a ambas.
  const hayQueElegir = !elegido && coincidencias && coincidencias.length > 1;

  const mostrados = elegido ? [elegido] : (hayQueElegir ? [] : coincidencias);
  const idsBuscados = mostrados ? new Set(mostrados.map(c => c.id)) : null;

  DOM.historyClearBtn.style.display = state.historyBusqueda ? "block" : "none";
  DOM.historyCoincidencias.innerHTML = "";
  DOM.historyResultado.className = "busqueda-resultado";

  if (!coincidencias) {
    DOM.historyResultado.textContent = "";
  } else if (coincidencias.length === 0) {
    DOM.historyResultado.textContent = "Ningún conductor coincide con esa búsqueda";
    DOM.historyResultado.className = "busqueda-resultado sin-resultados";
  } else if (elegido) {
    DOM.historyResultado.textContent = `Mostrando el historial de ${elegido.nombreCompleto}`;
  } else if (coincidencias.length === 1) {
    DOM.historyResultado.textContent = `Mostrando el historial de ${coincidencias[0].nombreCompleto}`;
  } else {
    DOM.historyResultado.textContent =
      `${coincidencias.length} conductores coinciden.`;
  }

  // Con más de una coincidencia se listan todas para poder elegir. La elegida
  // queda resaltada; tocando otra se cambia de persona, y tocando la misma se
  // deselecciona y vuelve a ocultarse el historial.
  if (coincidencias && coincidencias.length > 1) {
    coincidencias.forEach(c => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip-coincidencia" + (elegido && elegido.id === c.id ? " elegido" : "");
      chip.innerHTML = `${escapeHtml(c.nombreCompleto)} <span>${escapeHtml(c.usuario)}</span>`;
      chip.addEventListener("click", () => {
        // Tocar la pastilla ya elegida la deselecciona y vuelve a pedir elegir
        state.historyChoferId = (elegido && elegido.id === c.id) ? null : c.id;
        renderHistorial();
      });
      DOM.historyCoincidencias.appendChild(chip);
    });
  }

  const porViaje = {};
  state.viajes.forEach(v => porViaje[v.id] = v);
  const nombrePorChofer = {};
  state.usuarios.forEach(u => nombrePorChofer[u.id] = `${u.nombre} ${u.apellido}`);

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
    .filter(f => !idsBuscados || idsBuscados.has(f.choferId));

  DOM.hkpiTotal.textContent = filas.length;
  DOM.hkpiNivel1.textContent = filas.filter(f => f.nivel === 1).length;
  DOM.hkpiNivel2.textContent = filas.filter(f => f.nivel === 2).length;
  // Los viajes y las horas acompañan a lo que se buscó: si el campo está
  // vacío son de toda la flota, y si no, solo de los que coinciden.
  const viajesMostrados = idsBuscados
    ? state.viajes.filter(v => idsBuscados.has(v.chofer_id))
    : state.viajes;

  DOM.hkpiViajes.textContent = viajesMostrados.length;
  DOM.hkpiHoras.textContent = formatoDuracion(
    viajesMostrados.reduce((acc, v) => acc + duracionHoras(v), 0));

  // Mientras haya que elegir, no se muestra nada del historial: ni los
  // números, ni los gráficos, ni la tabla.
  DOM.historyResultados.style.display = hayQueElegir ? "none" : "";

  DOM.historyEmptyState.style.display = (hayQueElegir || !filas.length) ? "block" : "none";
  if (hayQueElegir) {
    DOM.historyEmptyTitulo.textContent = "Elegí un conductor";
    DOM.historyEmptyTexto.textContent =
      "Hay varios que coinciden con esa búsqueda. Tocá uno de la lista de arriba para ver su historial.";
  } else {
    DOM.historyEmptyTitulo.textContent = "No se encontraron registros";
    DOM.historyEmptyTexto.textContent = "No hay eventos que coincidan con la búsqueda.";
  }
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
  // El alto lo manda el contenedor: el CSS fuerza el canvas a ocupar el 100%,
  // así que si dibujamos con otro alto la imagen se estira y las letras salen
  // deformadas.
  const alto = canvas.parentElement.clientHeight || 260;

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

  const coincidencias = choferesBuscados();
  const elegido = state.historyChoferId
    ? state.choferes.find(c => c.id === state.historyChoferId)
    : null;
  const hayQueElegir = !elegido && coincidencias && coincidencias.length > 1;
  const mostrados = elegido ? [elegido] : (hayQueElegir ? [] : coincidencias);
  const idsBuscados = mostrados ? new Set(mostrados.map(c => c.id)) : null;
  const viajes = state.viajes.filter(v => !idsBuscados || idsBuscados.has(v.chofer_id));

  // Si el viaje elegido ya no esta en la lista, se toma el mas reciente.
  if (!viajes.some(v => v.id === state.chartTripId)) {
    state.chartTripId = viajes.length ? viajes[0].id : null;
  }

  DOM.chartTripSelect.innerHTML = viajes.length
    ? viajes.map(v => {
        const etiqueta = `${formatoFechaHora(v.inicio)} · ${tramo(v)}` +
          ` · ${nombrePorChofer[v.chofer_id] || ""}` +
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
  // El alto lo manda el contenedor: el CSS fuerza el canvas a ocupar el 100%,
  // así que si dibujamos con otro alto la imagen se estira y las letras salen
  // deformadas.
  const alto = canvas.parentElement.clientHeight || 260;

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

  const errorDni = validarDni(dni);
  if (errorDni) { showToast(errorDni, "toast-error"); return; }

  DOM.btnSubmitAlta.disabled = true;
  DOM.btnSubmitAlta.textContent = "Registrando...";

  // Aviso temprano: el DNI y el mail son únicos en todo el sistema, no solo
  // dentro de la empresa.
  const repetido = await buscarRepetido(dni, mail);
  if (repetido) {
    DOM.btnSubmitAlta.disabled = false;
    DOM.btnSubmitAlta.textContent = "Registrar conductor";
    showToast(repetido, "toast-error");
    return;
  }

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
// 9a-bis. CARGA MASIVA DE CONDUCTORES POR CSV
// ============================================================================
// La empresa sube la planilla que ya tiene. No exigimos ningún formato: se
// lee el archivo, se muestra tal cual vino, y el administrador indica qué
// columna es cada dato y corrige lo que haga falta antes de dar de alta.

const CAMPOS_CSV = [
  { clave: "nombre",   etiqueta: "Nombre" },
  { clave: "apellido", etiqueta: "Apellido" },
  { clave: "dni",      etiqueta: "DNI" },
  { clave: "mail",     etiqueta: "Mail" }
];

const csvState = {
  nombreArchivo: "",
  encabezados: [],   // los nombres originales de las columnas
  filas: [],         // matriz de strings
  roles: []          // qué campo representa cada columna ("nombre", "", ...)
};

/** Saca acentos y pasa a minúscula, para comparar encabezados. */
function normalizar(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim();
}

/** Lee el archivo probando UTF-8 y, si falla, la codificación de Excel viejo. */
async function leerArchivoTexto(archivo) {
  const buffer = await archivo.arrayBuffer();
  let texto;
  try {
    texto = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    texto = new TextDecoder("windows-1252").decode(buffer);
  }
  return texto.replace(/^\uFEFF/, "");   // saca la marca invisible que mete Excel
}

/** Excel exporta con coma o con punto y coma según el idioma del sistema. */
function detectarDelimitador(texto) {
  const primeraLinea = texto.split(/\r?\n/)[0] || "";
  let mejor = ",", maximo = -1;
  [",", ";", "\t", "|"].forEach(d => {
    const cuenta = primeraLinea.split(d).length - 1;
    if (cuenta > maximo) { maximo = cuenta; mejor = d; }
  });
  return mejor;
}

/** Parser de CSV: respeta comillas, comas adentro de comillas y saltos de línea. */
function parsearCsv(texto, delimitador) {
  const filas = [];
  let fila = [], campo = "", enComillas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (enComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') { campo += '"'; i++; }   // comilla escapada
        else enComillas = false;
      } else campo += c;
    } else if (c === '"') {
      enComillas = true;
    } else if (c === delimitador) {
      fila.push(campo); campo = "";
    } else if (c === "\n") {
      fila.push(campo); filas.push(fila); fila = []; campo = "";
    } else if (c !== "\r") {
      campo += c;
    }
  }
  if (campo !== "" || fila.length) { fila.push(campo); filas.push(fila); }

  return filas.filter(f => f.some(v => v.trim() !== ""));   // fuera las vacías
}

/**
 * Adivina qué columna es cada campo. Usa puntajes en vez de quedarse con la
 * primera coincidencia, porque planillas reales suelen traer columnas como
 * "Apellido y Nombre" junto a "Apellido" y "Nombre" por separado: gana la
 * que coincide mejor, no la que aparece antes.
 */
function adivinarRoles(encabezados) {
  const puntajes = {
    nombre: t => {
      if (t.includes("apellido")) return 0;               // "apellido y nombre"
      if (/^nombres?$/.test(t)) return 100;
      return t.includes("nombre") ? 60 : 0;
    },
    apellido: t => {
      if (t.includes("nombre")) return 0;
      if (/^apellidos?$/.test(t)) return 100;
      return t.includes("apellido") ? 60 : 0;
    },
    dni: t => {
      if (/^(dni|documento|doc)$/.test(t)) return 100;
      if (t.includes("dni") || t.includes("documento")) return 60;
      return 0;
    },
    mail: t => {
      if (/^(mail|email|e-mail|correo)$/.test(t)) return 100;
      if (t.includes("mail") || t.includes("correo")) return 60;
      return 0;
    }
  };

  const normalizados = encabezados.map(normalizar);
  const roles = new Array(encabezados.length).fill("");
  const columnasUsadas = new Set();

  // Para cada campo, la columna con mejor puntaje que todavía esté libre.
  CAMPOS_CSV.forEach(({ clave }) => {
    let mejorCol = -1, mejorPuntaje = 0;
    normalizados.forEach((t, j) => {
      if (columnasUsadas.has(j)) return;
      const p = puntajes[clave](t);
      if (p > mejorPuntaje) { mejorPuntaje = p; mejorCol = j; }
    });
    if (mejorCol >= 0) { roles[mejorCol] = clave; columnasUsadas.add(mejorCol); }
  });

  return roles;
}

async function cargarArchivoCsv(archivo) {
  if (!archivo) return;
  if (!/\.csv$|\.txt$/i.test(archivo.name)) {
    showToast("El archivo tiene que ser .csv", "toast-error");
    return;
  }

  const texto = await leerArchivoTexto(archivo);
  const filas = parsearCsv(texto, detectarDelimitador(texto));

  if (filas.length < 2) {
    showToast("El archivo no tiene filas de datos", "toast-error");
    return;
  }

  const encabezados = filas[0].map(h => h.trim());
  const ancho = encabezados.length;

  csvState.nombreArchivo = archivo.name;
  csvState.encabezados = encabezados;
  // Igualamos el ancho de todas las filas para que la tabla no se rompa.
  csvState.filas = filas.slice(1).map(f => {
    const copia = f.slice(0, ancho).map(v => v.trim());
    while (copia.length < ancho) copia.push("");
    return copia;
  });
  csvState.roles = adivinarRoles(encabezados);

  DOM.csvZonaCarga.style.display = "none";   // ya no hace falta ocupar pantalla
  DOM.csvArchivoInfo.innerHTML = `
    <strong>${escapeHtml(archivo.name)}</strong> ·
    ${csvState.filas.length} fila${csvState.filas.length === 1 ? "" : "s"} ·
    ${ancho} columna${ancho === 1 ? "" : "s"}`;

  DOM.csvResultado.style.display = "none";
  DOM.csvEditor.style.display = "block";
  renderCsvTabla();
  DOM.csvEditor.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCsvTabla() {
  // --- Encabezado: nombre original, qué dato es, y acciones sobre la columna ---
  DOM.csvThead.innerHTML = `<tr>${csvState.encabezados.map((h, j) => `
    <th>
      <div class="csv-col-top">
        <span class="csv-col-original" title="${escapeHtml(h)}">${escapeHtml(h) || "(sin nombre)"}</span>
        <span class="csv-col-botones">
          <button type="button" class="csv-col-btn csv-dividir" data-col="${j}"
                  title="Dividir esta columna en dos (por ejemplo, apellido y nombre)">
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none">
              <line x1="12" y1="3" x2="12" y2="21"></line>
              <polyline points="8 8 4 12 8 16"></polyline>
              <polyline points="16 8 20 12 16 16"></polyline>
            </svg>
          </button>
          <button type="button" class="csv-col-btn csv-quitar-col" data-col="${j}" title="Quitar esta columna">
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </span>
      </div>
      <select class="form-select csv-rol" data-col="${j}">
        <option value="">Ignorar</option>
        ${CAMPOS_CSV.map(c => `<option value="${c.clave}">${c.etiqueta}</option>`).join("")}
      </select>
    </th>`).join("")}<th class="csv-col-acciones"></th></tr>`;

  DOM.csvThead.querySelectorAll(".csv-rol").forEach(sel => {
    const j = Number(sel.dataset.col);
    sel.value = csvState.roles[j] || "";
    sel.addEventListener("change", () => {
      // Un mismo campo no puede estar en dos columnas: se libera la anterior.
      if (sel.value) {
        csvState.roles = csvState.roles.map(r => (r === sel.value ? "" : r));
      }
      csvState.roles[j] = sel.value;
      renderCsvTabla();
    });
  });

  DOM.csvThead.querySelectorAll(".csv-dividir").forEach(btn =>
    btn.addEventListener("click", () => dividirColumna(Number(btn.dataset.col))));

  DOM.csvThead.querySelectorAll(".csv-quitar-col").forEach(btn =>
    btn.addEventListener("click", () => quitarColumna(Number(btn.dataset.col))));

  // --- Filas editables ---
  DOM.csvTbody.innerHTML = csvState.filas.map((fila, i) => `
    <tr data-fila="${i}">
      ${fila.map((valor, j) => `
        <td><input class="csv-celda" data-fila="${i}" data-col="${j}"
                   value="${escapeHtml(valor)}" /></td>`).join("")}
      <td class="csv-col-acciones">
        <button type="button" class="csv-borrar-fila" data-fila="${i}" title="Quitar esta fila">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          </svg>
        </button>
      </td>
    </tr>`).join("");

  DOM.csvTbody.querySelectorAll(".csv-celda").forEach(input => {
    input.addEventListener("input", () => {
      csvState.filas[Number(input.dataset.fila)][Number(input.dataset.col)] = input.value;
      pintarValidacion();
    });
  });

  DOM.csvTbody.querySelectorAll(".csv-borrar-fila").forEach(btn => {
    btn.addEventListener("click", () => {
      csvState.filas.splice(Number(btn.dataset.fila), 1);
      if (!csvState.filas.length) { descartarCsv(); return; }
      renderCsvTabla();
    });
  });

  pintarValidacion();
}

/**
 * Parte una columna en dos. Sirve para las planillas que traen "Pérez, Juan"
 * o "Juan Pérez" en una sola celda. Corta por la coma si la hay; si no, por
 * el primer espacio.
 */
function dividirColumna(j) {
  const valores = csvState.filas.map(f => f[j] || "");
  const hayComas = valores.filter(v => v.includes(",")).length > valores.length / 2;

  const partes = valores.map(v => {
    const texto = v.trim();
    if (!texto) return ["", ""];
    const corte = hayComas ? texto.indexOf(",") : texto.indexOf(" ");
    if (corte < 0) return [texto, ""];
    return [texto.slice(0, corte).trim(), texto.slice(corte + 1).trim()];
  });

  const nombreOriginal = csvState.encabezados[j] || "columna";
  csvState.encabezados.splice(j, 2 - 1, `${nombreOriginal} (1)`, `${nombreOriginal} (2)`);
  csvState.roles.splice(j, 1, "", "");
  csvState.filas.forEach((f, i) => f.splice(j, 1, partes[i][0], partes[i][1]));

  // Reintentamos adivinar, ahora que las columnas nuevas pueden encajar.
  csvState.roles = adivinarRoles(csvState.encabezados);
  renderCsvTabla();
  showToast("Columna dividida en dos. Revisá cuál es cuál.");
}

/** Saca una columna entera de la tabla. */
function quitarColumna(j) {
  if (csvState.encabezados.length <= 1) return;
  csvState.encabezados.splice(j, 1);
  csvState.roles.splice(j, 1);
  csvState.filas.forEach(f => f.splice(j, 1));
  renderCsvTabla();
}

/** Agrega una columna vacía al final, para completar un dato que no vino. */
function agregarColumna() {
  csvState.encabezados.push("Columna nueva");
  csvState.roles.push("");
  csvState.filas.forEach(f => f.push(""));
  renderCsvTabla();
}

/** Devuelve, por fila, los datos ya mapeados a los cuatro campos. */
function filasMapeadas() {
  const indice = {};
  csvState.roles.forEach((rol, j) => { if (rol) indice[rol] = j; });

  return csvState.filas.map(fila => {
    const dato = {};
    CAMPOS_CSV.forEach(c => {
      dato[c.clave] = indice[c.clave] !== undefined ? (fila[indice[c.clave]] || "").trim() : "";
    });
    return dato;
  });
}

const MAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Revisa un DNI y devuelve el error a mostrar, o null si está bien.
 * Se usa en los cinco lugares donde se cargan o editan personas.
 */
/**
 * Estado que se muestra en las tablas. El orden importa:
 *   1. si está dado de baja, eso manda sobre todo lo demás;
 *   2. si alguna vez entró, está activo (aunque el mail haya rebotado);
 *   3. si el mail rebotó y todavía no entró, hay que avisarle al admin;
 *   4. si no, el mail salió y estamos esperando que ingrese.
 */
function estadoPersona(p) {
  if (!p.activo) {
    return { texto: "Dado de baja", clase: "badge-neutro", ayuda: "" };
  }
  if (!p.debe_cambiar_password) {
    return { texto: "Activo", clase: "badge-normal", ayuda: "" };
  }
  if (p.estado_mail === "rebotado") {
    return {
      texto: "Mail rechazado",
      clase: "badge-danger",
      ayuda: "El mail no llegó. Entrá a Editar y cambiá la dirección por una válida."
    };
  }
  return {
    texto: "Mail enviado",
    clase: "badge-warning",
    ayuda: "Ya se le mandaron las credenciales; todavía no ingresó por primera vez."
  };
}

/**
 * Deja el encabezado mostrando si la columna tiene un filtro puesto, y marca
 * la opción elegida dentro del menú. El triángulo es siempre el mismo: solo
 * cambia de color cuando hay un filtro.
 */
function pintarEncabezado(boton, menu, filtro) {
  if (!boton || !menu) return;
  boton.classList.toggle("con-filtro", filtro !== "todos");
  menu.querySelectorAll("[data-filtro]").forEach(b =>
    b.classList.toggle("elegido", b.dataset.filtro === filtro));
}

/** Deja solo las personas cuyo estado coincide con el filtro elegido. */
function filtrarPorEstado(lista, filtro) {
  if (!filtro || filtro === "todos") return lista;
  return lista.filter(p => estadoPersona(p).texto === filtro);
}

function validarDni(dni) {
  const valor = (dni || "").trim();
  if (!valor) return "Ingresá el DNI";
  if (/[.,\s]/.test(valor)) return "Ingresá el DNI sin puntos ni espacios";
  if (!/^\d+$/.test(valor)) return "El DNI debe ser numérico";
  if (valor.length < 7 || valor.length > 9) return "El DNI debe tener entre 7 y 9 dígitos";
  return null;
}

/**
 * Marca en rojo las celdas con problemas y ajusta el botón de alta.
 * No bloquea por duplicados: esas filas se saltean al cargar y se informan
 * al final. Solo exige que estén asignadas las cuatro columnas.
 */
function pintarValidacion() {
  const asignados = csvState.roles.filter(Boolean);
  const faltantes = CAMPOS_CSV.filter(c => !asignados.includes(c.clave));
  const datos = filasMapeadas();

  const indice = {};
  csvState.roles.forEach((rol, j) => { if (rol) indice[rol] = j; });

  let filasCargables = 0;

  csvState.filas.forEach((fila, i) => {
    const d = datos[i];
    let filaMal = false;

    CAMPOS_CSV.forEach(c => {
      if (indice[c.clave] === undefined) return;
      const vacio = !d[c.clave];
      const malMail = c.clave === "mail" && d.mail && !MAIL_VALIDO.test(d.mail);
      const malDni  = c.clave === "dni"  && d.dni  && validarDni(d.dni) !== null;
      const mal = vacio || malMail || malDni;

      const celda = DOM.csvTbody.querySelector(
        `.csv-celda[data-fila="${i}"][data-col="${indice[c.clave]}"]`);
      if (celda) celda.classList.toggle("celda-error", mal);
      if (mal) filaMal = true;
    });

    const tr = DOM.csvTbody.querySelector(`tr[data-fila="${i}"]`);
    if (tr) tr.classList.toggle("fila-con-error", filaMal);
    if (!filaMal) filasCargables++;
  });

  // Toda la información va en el botón, sin carteles aparte.
  if (faltantes.length) {
    DOM.btnCsvAlta.disabled = true;
    DOM.btnCsvAlta.textContent = `Falta indicar: ${faltantes.map(c => c.etiqueta).join(", ")}`;
  } else if (!filasCargables) {
    DOM.btnCsvAlta.disabled = true;
    DOM.btnCsvAlta.textContent = "No hay filas completas";
  } else {
    DOM.btnCsvAlta.disabled = false;
    DOM.btnCsvAlta.textContent = `Dar de alta ${filasCargables} conductor${filasCargables === 1 ? "" : "es"}`;
  }
}

function descartarCsv() {
  csvState.nombreArchivo = "";
  csvState.encabezados = [];
  csvState.filas = [];
  csvState.roles = [];
  DOM.csvInput.value = "";
  DOM.csvEditor.style.display = "none";
  DOM.csvZonaCarga.style.display = "";
  DOM.csvProgreso.style.display = "none";
}

/** Traduce los errores de la base a algo que se entienda. */
/**
 * Traduce los errores de la base a un texto para mostrar en pantalla.
 *
 * Importante: NUNCA devuelve el mensaje crudo de Postgres. Esos mensajes
 * traen adentro el valor duplicado ("Key (mail)=(juan@x.com) already exists")
 * y, con él, datos de usuarios de otras empresas que quien está mirando la
 * pantalla no tiene por qué ver. Lo desconocido se muestra genérico y el
 * detalle técnico queda en la consola, para quien esté depurando.
 */
function explicarError(mensaje) {
  const t = (mensaje || "").toLowerCase();

  if (t.includes("mail_unico") || (t.includes("duplicate") && t.includes("mail")))
    return "ya existe un usuario con ese mail";
  if (t.includes("dni_unico") || (t.includes("duplicate") && t.includes("dni")))
    return "ya existe un usuario con ese DNI";
  if (t.includes("usuario_key") || (t.includes("duplicate") && t.includes("usuario")))
    return "ya existe un usuario con ese nombre de usuario";
  if (t.includes("cuit"))
    return "ya existe una empresa con ese CUIT";
  if (t.includes("duplicate") || t.includes("already") || t.includes("unique"))
    return "ese dato ya está registrado";

  if (t.includes("permission") || t.includes("policy") || t.includes("row-level"))
    return "no tenés permiso para hacer esa operación";
  if (t.includes("network") || t.includes("fetch") || t.includes("timeout"))
    return "no se pudo conectar con el servidor";
  if (t.includes("no hay sesión") || t.includes("jwt") || t.includes("401"))
    return "la sesión expiró, volvé a entrar";

  if (mensaje) console.error("Error sin traducir:", mensaje);
  return "no se pudo completar la operación";
}

/**
 * Da de alta de a uno, en orden, mostrando el avance.
 * Las filas incompletas y las que ya existen se saltean: el resto se carga
 * igual, y al final se informa qué pasó con cada una.
 */
async function altaMasivaCsv() {
  const datos = filasMapeadas();
  if (!datos.length) return;

  // Lo que ya está en la base, para no ni siquiera intentarlo.
  const mailsEnBase = new Set((state.usuarios || []).map(u => (u.mail || "").toLowerCase()));
  const dnisEnBase  = new Set((state.usuarios || []).map(u => u.dni));
  // Y lo que se repite dentro del mismo archivo.
  const vistosMail = new Set(), vistosDni = new Set();

  DOM.btnCsvAlta.disabled = true;
  DOM.btnCsvDescartar.disabled = true;
  DOM.csvProgreso.style.display = "flex";

  const creados = [], repetidos = [], fallados = [];

  for (let i = 0; i < datos.length; i++) {
    const d = datos[i];
    const mail = d.mail.toLowerCase();

    DOM.csvProgresoTexto.textContent = `${i + 1} de ${datos.length}`;
    DOM.csvBarraFill.style.width = `${Math.round((i / datos.length) * 100)}%`;

    // --- Filas que no se pueden cargar: se saltean sin frenar el resto ---
    if (!d.nombre || !d.apellido || !d.dni || !d.mail || !MAIL_VALIDO.test(d.mail)) {
      fallados.push({ ...d, detalle: "faltan datos o el mail es inválido" });
      continue;
    }
    const errorDniFila = validarDni(d.dni);
    if (errorDniFila) { fallados.push({ ...d, detalle: errorDniFila.toLowerCase() }); continue; }
    if (mailsEnBase.has(mail) || dnisEnBase.has(d.dni)) {
      repetidos.push({ ...d, detalle: "ya estaba cargado" });
      continue;
    }
    // También puede existir en otra empresa, que desde acá no se ve.
    const [chequeoDni, chequeoMail] = await Promise.all([
      db.rpc("existe_dni",  { p_dni: d.dni }),
      db.rpc("existe_mail", { p_mail: d.mail })
    ]);
    if (chequeoDni.data || chequeoMail.data) {
      repetidos.push({ ...d, detalle: "ya estaba cargado" });
      continue;
    }
    if (vistosMail.has(mail) || vistosDni.has(d.dni)) {
      repetidos.push({ ...d, detalle: "repetido dentro del archivo" });
      continue;
    }

    try {
      const { data, error } = await db.functions.invoke("alta-usuario", {
        body: { nombre: d.nombre, apellido: d.apellido, dni: d.dni, mail: d.mail }
      });
      if (error || data?.error) {
        const detalle = explicarError(data?.error || error.message);
        // Si la base lo rechazó por duplicado, va como repetido, no como error.
        (detalle.startsWith("ya ") ? repetidos : fallados).push({ ...d, detalle });
      } else {
        creados.push({ ...d, usuario: data.usuario, password: data.password,
                       mailEnviado: !!data.mail_enviado });
        vistosMail.add(mail);
        vistosDni.add(d.dni);
      }
    } catch (err) {
      fallados.push({ ...d, detalle: explicarError(err.message) });
    }
  }

  DOM.csvBarraFill.style.width = "100%";
  DOM.csvProgresoTexto.textContent = "Listo";
  DOM.btnCsvDescartar.disabled = false;

  mostrarResultadoCsv(creados, repetidos, fallados);
  descartarCsv();
  await cargarDatos();
}

function mostrarResultadoCsv(creados, repetidos, fallados) {
  const nombreDe = r => `${escapeHtml(r.nombre)} ${escapeHtml(r.apellido)}`;

  let encabezado;
  if (creados.length && !repetidos.length && !fallados.length) {
    encabezado = `<div class="csv-aviso csv-aviso-ok">
      Se cargaron <strong>${creados.length}</strong> conductor${creados.length === 1 ? "" : "es"} sin problemas.</div>`;
  } else if (creados.length) {
    encabezado = `<div class="csv-aviso csv-aviso-warning">
      Se cargaron <strong>${creados.length}</strong> de ${creados.length + repetidos.length + fallados.length}.
      ${repetidos.length ? `<strong>${repetidos.length}</strong> ya existía${repetidos.length === 1 ? "" : "n"}.` : ""}
      ${fallados.length ? `<strong>${fallados.length}</strong> con error.` : ""}</div>`;
  } else {
    encabezado = `<div class="csv-aviso csv-aviso-error">
      No se cargó ningún conductor.</div>`;
  }

  DOM.csvResultado.style.display = "block";
  DOM.csvResultado.innerHTML = `
    <div class="form-section-title">Resultado de la carga</div>
    ${encabezado}

    ${creados.length ? `
      <div class="csv-tabla-wrap">
        <table class="drivers-table">
          <thead><tr><th>Conductor</th><th>Usuario</th><th>Contraseña temporal</th><th>Mail</th></tr></thead>
          <tbody>${creados.map(r => `
            <tr>
              <td><strong>${nombreDe(r)}</strong></td>
              <td>${escapeHtml(r.usuario)}</td>
              <td><code>${escapeHtml(r.password)}</code></td>
              <td>${r.mailEnviado ? "Enviado" : "No se pudo enviar"}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="form-actions-row">
        <button type="button" id="btnDescargarCredenciales" class="btn btn-outline-action">
          Descargar credenciales (CSV)
        </button>
      </div>` : ""}

    ${repetidos.length ? `
      <p class="csv-nota"><strong>Ya estaban en el sistema</strong> (no se volvieron a cargar):</p>
      <ul class="csv-problemas">${repetidos.map(r =>
        `<li>${nombreDe(r)} — ${escapeHtml(r.detalle)}</li>`).join("")}</ul>` : ""}

    ${fallados.length ? `
      <p class="csv-nota"><strong>No se pudieron cargar:</strong></p>
      <ul class="csv-problemas">${fallados.map(r =>
        `<li>${nombreDe(r)} — ${escapeHtml(r.detalle)}</li>`).join("")}</ul>` : ""}`;

  const btnDescarga = document.getElementById("btnDescargarCredenciales");
  if (btnDescarga) btnDescarga.addEventListener("click", () => descargarCredenciales(creados));

  DOM.csvResultado.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Genera un CSV con las credenciales para guardarlo o imprimirlo. */
function descargarCredenciales(filas) {
  const escapar = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const contenido = "\uFEFF" + [
    ["Nombre", "Apellido", "DNI", "Mail", "Usuario", "Contraseña temporal"].join(","),
    ...filas.map(r => [r.nombre, r.apellido, r.dni, r.mail, r.usuario, r.password].map(escapar).join(","))
  ].join("\r\n");

  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `credenciales-aurora-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Alterna entre el alta individual y la carga por CSV. */
function cambiarModoAlta(modo) {
  const esCsv = modo === "csv";
  DOM.altaIndividual.style.display = esCsv ? "none" : "block";
  DOM.altaCsv.style.display = esCsv ? "block" : "none";
  DOM.btnModoIndividual.classList.toggle("active", !esCsv);
  DOM.btnModoCsv.classList.toggle("active", esCsv);
}

function conectarEventosCsv() {
  DOM.btnModoIndividual.addEventListener("click", () => cambiarModoAlta("individual"));
  DOM.btnModoCsv.addEventListener("click", () => cambiarModoAlta("csv"));

  // Clic en el recuadro o en el botón: abre el explorador de archivos.
  DOM.csvDropzone.addEventListener("click", () => DOM.csvInput.click());
  DOM.csvDropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); DOM.csvInput.click(); }
  });
  DOM.csvInput.addEventListener("change", (e) => cargarArchivoCsv(e.target.files[0]));

  // Arrastrar y soltar.
  ["dragenter", "dragover"].forEach(evt =>
    DOM.csvDropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      DOM.csvDropzone.classList.add("csv-dropzone-activa");
    }));
  ["dragleave", "drop"].forEach(evt =>
    DOM.csvDropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      DOM.csvDropzone.classList.remove("csv-dropzone-activa");
    }));
  DOM.csvDropzone.addEventListener("drop", (e) => {
    const archivo = e.dataTransfer?.files?.[0];
    if (archivo) cargarArchivoCsv(archivo);
  });
  // Si sueltan el archivo fuera del recuadro, que el navegador no lo abra.
  window.addEventListener("dragover", (e) => e.preventDefault());
  window.addEventListener("drop", (e) => e.preventDefault());

  DOM.btnAgregarColumna.addEventListener("click", agregarColumna);
  DOM.btnCsvAlta.addEventListener("click", altaMasivaCsv);
  DOM.btnCsvDescartar.addEventListener("click", () => {
    descartarCsv();
    DOM.csvResultado.style.display = "none";
  });
}

// ============================================================================
// 9b. SUPERADMIN — gestión de administradores
// ============================================================================
async function cargarDatosSuperadmin() {
  const [empresasRes, adminsRes] = await Promise.all([
    db.from("empresas").select("id, nombre, cuit").eq("activa", true).order("nombre"),
    db.from("usuarios")
      .select("id, nombre, apellido, usuario, dni, mail, activo, empresa_id, estado_mail, debe_cambiar_password, empresas(nombre, cuit)")
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
  const lista = filtrarPorEstado(state.admins, state.filtroEstadoAdmins);
  pintarEncabezado(DOM.btnEstadoAdmins, DOM.menuEstadoAdmins, state.filtroEstadoAdmins);

  DOM.adminsEmptyState.style.display = lista.length ? "none" : "block";
  DOM.adminsTableBody.innerHTML = "";

  lista.forEach(a => {
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
        <span class="status-badge ${estadoPersona(a).clase}"
              ${estadoPersona(a).ayuda ? `title="${estadoPersona(a).ayuda}"` : ""}>
          ${estadoPersona(a).texto}
        </span>
      </td>
      <td class="text-right">
        <div class="acciones-fila">
          <button class="btn-accion btn-accion-editar" data-action="editar" data-id="${a.id}">
            Editar
          </button>
          <button class="btn-accion btn-accion-baja"
                  data-action="baja" data-id="${a.id}">
            ${a.activo ? "Dar de baja" : "Reactivar"}
          </button>
        </div>
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
    showToast("No se pudo actualizar: " + explicarError(error.message), "toast-error");
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

  if (errBuscar) return { error: explicarError(errBuscar.message) };
  if (encontradas && encontradas.length) return { id: encontradas[0].id, creada: false };

  const { data: nueva, error: errCrear } = await db
    .from("empresas")
    .insert({ nombre: limpio, cuit: cuit || null })
    .select("id")
    .single();

  if (errCrear) return { error: "No se pudo crear la empresa: " + explicarError(errCrear.message) };
  return { id: nueva.id, creada: true };
}

/**
 * Avisa antes de intentar, si ese DNI o mail ya lo tiene alguien.
 * El nombre de usuario repetido NO es problema: la base le agrega una letra
 * más del nombre (mkatseye -> mikatseye). Lo que no puede repetirse es el
 * mail o el DNI.
 */
async function buscarRepetido(dni, mail) {
  const mailBajo = mail.toLowerCase();

  // Primero lo que ya está en pantalla, sin consultar nada.
  if (state.pendingAdmins.some(a => a.dni === dni))
    return "Ese DNI ya está en la lista de abajo";
  if (state.pendingAdmins.some(a => a.mail.toLowerCase() === mailBajo))
    return "Ese mail ya está en la lista de abajo";

  // Y después la base entera. Hace falta preguntarle a ella porque desde el
  // navegador no se ven los usuarios de otras empresas: mirando solo la lista
  // local, un DNI ya cargado como chofer en otra empresa pasaba inadvertido.
  // Las funciones responden sí o no, sin decir de quién es el dato.
  const [resDni, resMail] = await Promise.all([
    db.rpc("existe_dni",  { p_dni: dni }),
    db.rpc("existe_mail", { p_mail: mail })
  ]);

  if (resDni.data)  return "Ya existe un usuario con ese DNI";
  if (resMail.data) return "Ya existe un usuario con ese mail";

  return null;
}

async function agregarAdminPendiente() {
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

  const errorDni = validarDni(dni);
  if (errorDni) { showToast(errorDni, "toast-error"); return; }

  const repetido = await buscarRepetido(dni, mail);
  if (repetido) { showToast(repetido, "toast-error"); return; }

  state.pendingAdmins.push({ nombre, apellido, dni, mail, empresa, cuit, id: Date.now() });
  renderPendingAdmins();
  DOM.adminForm.reset();
  DOM.adminUsuarioPreview.textContent = "—";
}

function renderPendingAdmins() {
  const cuantos = state.pendingAdmins.length;
  DOM.btnSubmitAdmin.textContent = cuantos
    ? `Registrar ${cuantos} administrador${cuantos === 1 ? "" : "es"}`
    : "Registrar";

  DOM.pendingAdminsContainer.style.display = cuantos ? "block" : "none";
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
     const errorDniAdmin = validarDni(dni);
     if (errorDniAdmin) { showToast(errorDniAdmin, "toast-error"); return; }

     const repetido = await buscarRepetido(dni, mail);
     if (repetido) { showToast(repetido, "toast-error"); return; }
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

  const creados = [], fallados = [];

  for (const admin of state.pendingAdmins) {
    const empresa = await resolverEmpresa(admin.empresa, admin.cuit);
    if (empresa.error) {
      fallados.push({ admin, detalle: empresa.error });
      continue;
    }

    const { data, error } = await db.functions.invoke("alta-usuario", {
      body: { nombre: admin.nombre, apellido: admin.apellido, dni: admin.dni,
              mail: admin.mail, empresa_id: empresa.id }
    });

    if (error || data?.error) {
      fallados.push({ admin, detalle: explicarError(data?.error || error?.message) });
    } else {
      creados.push({ admin, data });
    }
  }

  DOM.btnSubmitAdmin.disabled = false;

  // Los que fallaron quedan en la lista para corregirlos y reintentar;
  // los que salieron bien se van.
  state.pendingAdmins = fallados.map(f => f.admin);

  // El resultado siempre se muestra, aunque hayan fallado todos: antes en ese
  // caso no aparecía nada y parecía que el botón no había hecho nada.
  let html = "";

  if (creados.length) {
    html += `<h4>${creados.length} administrador${creados.length === 1 ? "" : "es"} registrado${creados.length === 1 ? "" : "s"}</h4>`;
    creados.forEach(({ admin, data }) => {
      html += `
        <p>${escapeHtml(admin.nombre)} ${escapeHtml(admin.apellido)} ${data.mail_enviado ? "(mail enviado)" : "(no se pudo mandar el mail)"}:</p>
        <div class="credencial"><span>Usuario</span><strong>${escapeHtml(data.usuario)}</strong></div>
        <div class="credencial"><span>Contraseña temporal</span><strong>${escapeHtml(data.password)}</strong></div>`;
    });
    html += `<p class="credencial-nota">Se le pedirá cambiarla en el primer ingreso.</p>`;
  }

  if (fallados.length) {
    html += `<h4>${fallados.length} no se pudo${fallados.length === 1 ? "" : "s"} registrar</h4>
      <p class="credencial-nota">Siguen en la lista de abajo: corregí el dato y volvé a apretar Registrar.</p>
      <ul class="csv-problemas">${fallados.map(f =>
        `<li><strong>${escapeHtml(f.admin.nombre)} ${escapeHtml(f.admin.apellido)}</strong> — ${escapeHtml(f.detalle)}</li>`
      ).join("")}</ul>`;
  }

  DOM.adminResultado.style.display = "block";
  DOM.adminResultado.className = fallados.length && !creados.length
    ? "alta-resultado alta-resultado-error" : "alta-resultado";
  DOM.adminResultado.innerHTML = html;
  DOM.adminResultado.scrollIntoView({ behavior: "smooth", block: "nearest" });

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

  const errorDniEdit = validarDni(dni);
  if (errorDniEdit) { showToast(errorDniEdit, "toast-error"); return; }

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
    showToast("No se pudo guardar: " + explicarError(error.message), "toast-error");
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

  // Contador del encabezado: total y, si hay bajas, cuántos siguen activos.
  const activos = lista.filter(c => c.activo).length;
  DOM.contadorChoferesTotal.textContent = lista.length;
  DOM.contadorChoferesDetalle.textContent =
    (lista.length === 1 ? "conductor" : "conductores") +
    (activos < lista.length ? ` · ${activos} activo${activos === 1 ? "" : "s"}` : "");

  const visibles = filtrarPorEstado(lista, state.filtroEstadoChoferes);
  pintarEncabezado(DOM.btnEstadoChoferes, DOM.menuEstadoChoferes, state.filtroEstadoChoferes);

  DOM.choferesEditEmptyState.style.display = visibles.length ? "none" : "block";
  DOM.choferesEditTableBody.innerHTML = "";

  visibles.forEach(c => {
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
        <span class="status-badge ${estadoPersona(c).clase}"
              ${estadoPersona(c).ayuda ? `title="${estadoPersona(c).ayuda}"` : ""}>
          ${estadoPersona(c).texto}
        </span>
      </td>
      <td class="text-right">
        <div class="acciones-fila">
          <button class="btn-accion btn-accion-editar" data-action="editar-chofer" data-id="${c.id}">
            Editar
          </button>
          <button class="btn-accion btn-accion-baja"
                  data-action="baja-chofer" data-id="${c.id}">
            ${c.activo ? "Dar de baja" : "Reactivar"}
          </button>
        </div>
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
    showToast("No se pudo actualizar: " + explicarError(error.message), "toast-error");
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

  const errorDniChofer = validarDni(dni);
  if (errorDniChofer) { showToast(errorDniChofer, "toast-error"); return; }

  DOM.btnSubmitEditChofer.disabled = true;

  const { error } = await db.from("usuarios")
    .update({ nombre, apellido, dni, mail })
    .eq("id", state.choferEnEdicion);

  DOM.btnSubmitEditChofer.disabled = false;

  if (error) {
    showToast("No se pudo guardar: " + explicarError(error.message), "toast-error");
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
    showToast("Error al actualizar: " + explicarError(error.message), "toast-error");
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

/**
 * Reloj del header. Arranca en 24 horas (20:23) y al tocarlo pasa a 12 horas
 * (8:23 pm). Sin segundos: es un reloj, no un cronómetro.
 */
let reloj12h = false;

function textoHora(fecha) {
  if (!reloj12h) {
    return fecha.toLocaleTimeString("es-AR", {
      hour: "2-digit", minute: "2-digit", hour12: false
    });
  }
  // El español rioplatense devuelve "8:23 p. m."; lo dejamos como "8:23 pm".
  return fecha.toLocaleTimeString("es-AR", {
    hour: "numeric", minute: "2-digit", hour12: true
  }).replace(/\s*a\.\s*m\.?/i, " am").replace(/\s*p\.\s*m\.?/i, " pm");
}

function arrancarReloj() {
  const tick = () => DOM.currentTime.textContent = textoHora(new Date());
  tick();
  if (!state.clockInterval) state.clockInterval = setInterval(tick, 1000);

  if (!DOM.clockBtn.dataset.conClic) {
    DOM.clockBtn.dataset.conClic = "1";

    // El texto gira sobre su eje horizontal, como una hoja que se da vuelta.
    // El formato se cambia a mitad de camino, cuando está de canto y no se ve.
    const alternar = () => {
      if (DOM.currentTime.classList.contains("girando")) return;   // un giro por vez
      DOM.currentTime.classList.add("girando");
      setTimeout(() => { reloj12h = !reloj12h; tick(); }, 160);
      DOM.currentTime.addEventListener("animationend",
        () => DOM.currentTime.classList.remove("girando"), { once: true });
    };

    DOM.clockBtn.addEventListener("click", alternar);
    DOM.clockBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); alternar(); }
    });
  }
}

function cambiarVista(vista) {
  state.currentAppView = vista;
  Object.values(DOM.views).forEach(v => v.style.display = "none");
  DOM.views[vista].style.display = "block";
  DOM.currentViewLabel.textContent =
    { inicio: "Inicio", historial: "Ver historial", alta: "Registrar nuevo conductor",
      "superadmin-add": "Agregar administradores", "superadmin-edit": "Editar administradores",
      "admin-edit": "Editar choferes", cuenta: "Mi cuenta" }[vista];
  DOM.dropdownItems.forEach(i => i.classList.toggle("active", i.dataset.view === vista));
  DOM.navDropdownMenu.style.display = "none";
  DOM.navDropdownWrapper.classList.remove("open");
  DOM.navMenuBtn.classList.remove("active-dropdown");
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

  // Al pasar el mouse por el logo se encienden las nubecitas del header.
  // Se hace con una clase y no solo con :hover en CSS porque la capa de las
  // nubes es hermana del header-container, no descendiente del logo.
  const header = document.querySelector(".top-header");
  DOM.brandHome.addEventListener("mouseenter", () => header.classList.add("nubes-visibles"));
  DOM.brandHome.addEventListener("mouseleave", () => header.classList.remove("nubes-visibles"));
  DOM.brandHome.addEventListener("focus", () => header.classList.add("nubes-visibles"));
  DOM.brandHome.addEventListener("blur", () => header.classList.remove("nubes-visibles"));

  // El logo del header devuelve a la pantalla principal del rol.
  DOM.brandHome.addEventListener("click", () => cambiarVista(vistaInicial()));
  DOM.brandHome.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cambiarVista(vistaInicial()); }
  });

  // ---- Menú desplegable ----
  // Se abre al acercar el mouse, y también con clic o teclado.

  /** Cuánto tarda en aparecer cada ítem respecto del anterior. */
  const ESCALON_MS = 45;

  let cierreMenu = null;

  function abrirMenu() {
    clearTimeout(cierreMenu);
    DOM.navDropdownMenu.style.display = "block";
    DOM.navDropdownWrapper.classList.add("open");
    DOM.navMenuBtn.classList.add("active-dropdown");
    DOM.navMenuBtn.setAttribute("aria-expanded", "true");

    // El escalonado cuenta solo los ítems visibles para este rol: si contara
    // los ocultos quedarían huecos en la secuencia.
    const visibles = [...DOM.dropdownItems].filter(i => i.style.display !== "none");
    visibles.forEach((item, i) => {
      item.style.animation = "none";
      void item.offsetWidth;                    // reinicia la animación
      item.style.animation = "";
      item.style.animationDelay = `${i * ESCALON_MS}ms`;
    });
  }

  function cerrarMenu() {
    DOM.navDropdownMenu.style.display = "none";
    DOM.navDropdownWrapper.classList.remove("open");
    DOM.navMenuBtn.classList.remove("active-dropdown");
    DOM.navMenuBtn.setAttribute("aria-expanded", "false");
  }

  DOM.navDropdownWrapper.addEventListener("mouseenter", abrirMenu);
  DOM.navDropdownWrapper.addEventListener("mouseleave", () => {
    // Un respiro antes de cerrar, por si el mouse se sale un instante.
    cierreMenu = setTimeout(cerrarMenu, 220);
  });

  DOM.navMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    DOM.navDropdownMenu.style.display === "block" ? cerrarMenu() : abrirMenu();
  });

  document.addEventListener("click", cerrarMenu);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });
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

  DOM.historyClearBtn.addEventListener("click", () => {
    DOM.historySearchInput.value = "";
    state.historyBusqueda = "";
    state.historyChoferId = null;
    renderHistorial();
  });
  DOM.historySearchInput.addEventListener("input", (e) => {
    state.historyBusqueda = e.target.value;
    state.historyChoferId = null;   // cambió la búsqueda: se deshace la elección
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
  conectarEventosCsv();
  DOM.btnCancelAlta.addEventListener("click", () => {
    DOM.newDriverForm.reset();
    DOM.altaResultado.style.display = "none";
    DOM.usuarioPreview.textContent = "—";
  });
  [DOM.formNombre, DOM.formApellido].forEach(inp =>
    inp.addEventListener("input", () =>
      actualizarPreviewUsuario(DOM.usuarioPreview, DOM.formNombre, DOM.formApellido)));

  DOM.adminForm.addEventListener("submit", guardarAdmin);
  DOM.btnAddAnotherAdmin.addEventListener("click", agregarAdminPendiente);
  [DOM.adminNombre, DOM.adminApellido].forEach(inp =>
    inp.addEventListener("input", () =>
      actualizarPreviewUsuario(DOM.adminUsuarioPreview, DOM.adminNombre, DOM.adminApellido)));

  DOM.editAdminForm.addEventListener("submit", guardarEditAdmin);
  DOM.btnCancelEditAdmin.addEventListener("click", cancelarEdicionAdmin);
  DOM.editChoferForm.addEventListener("submit", guardarEditChofer);
  DOM.btnCancelEditChofer.addEventListener("click", cancelarEdicionChofer);

  DOM.cuentaForm.addEventListener("submit", actualizarCuenta);

  // --- El menú de la columna "Estado", en las dos tablas ---
  const cerrarMenusColumna = () =>
    document.querySelectorAll(".menu-columna").forEach(m => m.style.display = "none");

  // Se abre desde el propio encabezado, como en una planilla.
  function conectarMenuColumna(boton, menu, claveFiltro, render) {
    boton.addEventListener("click", (e) => {
      e.stopPropagation();
      const abierto = menu.style.display === "block";
      cerrarMenusColumna();
      if (abierto) return;

      // El menú se ubica a mano respecto de la pantalla, no de la tabla: si
      // dependiera de la tabla, el contenedor lo recortaría por abajo.
      const r = boton.getBoundingClientRect();
      menu.style.display = "block";
      const alto = menu.offsetHeight;
      const ancho = menu.offsetWidth;

      // Si no entra abajo, se abre hacia arriba
      const abreArriba = r.bottom + alto + 8 > window.innerHeight;
      menu.style.top = abreArriba ? `${r.top - alto - 6}px` : `${r.bottom + 6}px`;
      // Y si se pasa del borde derecho, se corre para adentro
      menu.style.left = `${Math.min(r.left, window.innerWidth - ancho - 12)}px`;
    });

    menu.addEventListener("click", (e) => {
      const opcion = e.target.closest("button");
      if (!opcion) return;
      e.stopPropagation();

      if (opcion.dataset.filtro !== undefined) {
        state[claveFiltro] = opcion.dataset.filtro;
      }
      cerrarMenusColumna();
      render();
    });
  }

  conectarMenuColumna(DOM.btnEstadoAdmins, DOM.menuEstadoAdmins,
                      "filtroEstadoAdmins", renderAdmins);
  conectarMenuColumna(DOM.btnEstadoChoferes, DOM.menuEstadoChoferes,
                      "filtroEstadoChoferes", renderChoferesEdit);

  // Un clic afuera, Escape, o mover la pantalla cierran el menú abierto.
  // Lo último hace falta porque ahora el menú está anclado a la pantalla: si
  // se desplaza la página, quedaría flotando lejos de su encabezado.
  document.addEventListener("click", cerrarMenusColumna);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenusColumna(); });
  window.addEventListener("scroll", cerrarMenusColumna, true);
  window.addEventListener("resize", cerrarMenusColumna);

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