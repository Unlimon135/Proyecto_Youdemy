// auth.js - Sistema de autenticación para Youdemy

// Función para registrar un nuevo usuario
function registrarUsuario(nombre, correo, contrasena) {
  try {
    // Validaciones básicas
    if (!nombre.trim() || !correo.trim() || !contrasena.trim()) {
      alert('Todos los campos son obligatorios');
      return false;
    }
    
    if (contrasena.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    // Obtener usuarios existentes
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Verificar si el correo ya existe
    const usuarioExistente = usuarios.find(user => user.correo === correo.toLowerCase().trim());
    if (usuarioExistente) {
      alert('Ya existe un usuario con este correo electrónico');
      return false;
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
      id: Date.now(),
      nombre: nombre.trim(),
      correo: correo.toLowerCase().trim(),
      contrasena: contrasena, // En producción, esto debería estar encriptado
      fechaRegistro: new Date().toISOString()
    };
    
    // Agregar usuario al array
    usuarios.push(nuevoUsuario);
    
    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    return true;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    alert('Error al registrar usuario. Inténtalo de nuevo.');
    return false;
  }
}

// Función para iniciar sesión
function iniciarSesion(correo, contrasena) {
  try {
    // Validaciones básicas
    if (!correo.trim() || !contrasena.trim()) {
      alert('Por favor completa todos los campos');
      return false;
    }
    
    // Obtener usuarios registrados
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Buscar usuario por correo y contraseña
    const usuario = usuarios.find(user => 
      user.correo === correo.toLowerCase().trim() && 
      user.contrasena === contrasena
    );
    
    if (usuario) {
      // Guardar sesión activa
      localStorage.setItem('usuario', usuario.correo);
      localStorage.setItem('usuarioNombre', usuario.nombre);
      localStorage.setItem('usuarioId', usuario.id.toString());
      
      return true;
    } else {
      alert('Correo o contraseña incorrectos');
      return false;
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión. Inténtalo de nuevo.');
    return false;
  }
}

// Función para cerrar sesión
function logout() {
  try {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // Limpiar datos de sesión
      localStorage.removeItem('usuario');
      localStorage.removeItem('usuarioNombre');
      localStorage.removeItem('usuarioId');
      
      // Redirigir a login
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

// Función para verificar si el usuario está autenticado
function estaAutenticado() {
  return localStorage.getItem('usuario') !== null;
}

// Función para obtener datos del usuario actual
function obtenerUsuarioActual() {
  if (estaAutenticado()) {
    return {
      correo: localStorage.getItem('usuario'),
      nombre: localStorage.getItem('usuarioNombre'),
      id: parseInt(localStorage.getItem('usuarioId'))
    };
  }
  return null;
}

// Función para proteger páginas que requieren autenticación
function protegerPagina() {
  if (!estaAutenticado()) {
    alert('Debes iniciar sesión para acceder a esta página');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Función para redirigir usuarios ya autenticados
function redirigirSiAutenticado() {
  if (estaAutenticado()) {
    window.location.href = 'index.html';
  }
}

// Función para mostrar información del usuario en el header
function mostrarUsuarioEnHeader() {
  const usuario = obtenerUsuarioActual();
  
  if (usuario) {
    // Buscar si ya existe el elemento de usuario info
    let usuarioInfo = document.querySelector('.usuario-info');
    
    // Si no existe, crearlo
    if (!usuarioInfo) {
      usuarioInfo = document.createElement('div');
      usuarioInfo.className = 'usuario-info';
      
      // Agregar al header
      const header = document.querySelector('header');
      if (header) {
        header.appendChild(usuarioInfo);
      }
    }
    
    // Actualizar contenido
    usuarioInfo.textContent = usuario.nombre;
    usuarioInfo.title = `Logueado como: ${usuario.correo}`;
  }
}

// Función para actualizar la interfaz con información del usuario
function actualizarInterfazUsuario() {
  const usuario = obtenerUsuarioActual();
  
  if (usuario) {
    // Mostrar nombre del usuario en el header
    mostrarUsuarioEnHeader();
    
    // Buscar elementos que muestren el nombre del usuario
    const elementosNombre = document.querySelectorAll('.nombre-usuario');
    elementosNombre.forEach(elemento => {
      elemento.textContent = usuario.nombre;
    });
    
    // Mostrar/ocultar botones según el estado de autenticación
    const botonesLogin = document.querySelectorAll('.btn-login');
    const botonesLogout = document.querySelectorAll('.btn-logout');
    
    botonesLogin.forEach(btn => btn.style.display = 'none');
    botonesLogout.forEach(btn => btn.style.display = 'inline-block');
  }
}

// Función para limpiar todos los datos (útil para desarrollo/testing)
function limpiarDatos() {
  if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
    localStorage.clear();
    alert('Todos los datos han sido eliminados');
    window.location.href = 'login.html';
  }
}

// Inicialización automática cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
  // Verificar en qué página estamos
  const paginaActual = window.location.pathname.split('/').pop();
  
  // Páginas que NO requieren autenticación
  const paginasPublicas = ['login.html', 'register.html', ''];
  
  // Si estamos en login o register y ya estamos autenticados, redirigir
  if (paginaActual === 'login.html' || paginaActual === 'register.html') {
    redirigirSiAutenticado();
  }
  
  // Si estamos en una página protegida, verificar autenticación
  else if (!paginasPublicas.includes(paginaActual)) {
    if (protegerPagina()) {
      // Solo actualizar interfaz si la protección fue exitosa
      actualizarInterfazUsuario();
    }
  }
});

// Exportar funciones para uso global
window.registrarUsuario = registrarUsuario;
window.iniciarSesion = iniciarSesion;
window.logout = logout;
window.estaAutenticado = estaAutenticado;
window.obtenerUsuarioActual = obtenerUsuarioActual;
window.protegerPagina = protegerPagina;
window.limpiarDatos = limpiarDatos;