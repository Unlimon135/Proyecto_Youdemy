document.getElementById('cursoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const imagen = document.getElementById('imagen').value.trim();
  const contenido = document.getElementById('contenido').value.trim().split(',');

  if (!titulo || !descripcion || contenido.length === 0) {
    alert('Completa todos los campos obligatorios.');
    return;
  }

  const nuevoCurso = {
    id: Date.now(),
    titulo,
    descripcion,
    imagen: imagen || 'https://via.placeholder.com/300x150',
    contenido: contenido.map(item => item.trim()).filter(item => item.length > 0)
  };

  let cursos = JSON.parse(localStorage.getItem('cursos')) || [];
  cursos.push(nuevoCurso);
  localStorage.setItem('cursos', JSON.stringify(cursos));

  alert('Curso agregado con éxito.');
  this.reset();
  mostrarCursos();
});

function mostrarCursos() {
  const lista = document.getElementById('listaCursos');
  lista.innerHTML = '';
  const cursos = JSON.parse(localStorage.getItem('cursos')) || [];

  cursos.forEach(curso => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${curso.titulo}</strong> - ${curso.descripcion}
      <button onclick="eliminarCurso(${curso.id})" style="margin-left: 10px; background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Eliminar</button>
    `;
    lista.appendChild(li);
  });
}

function eliminarCurso(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
    let cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    cursos = cursos.filter(curso => curso.id !== id);
    localStorage.setItem('cursos', JSON.stringify(cursos));
    mostrarCursos();
  }
}

function logout() {
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', mostrarCursos);