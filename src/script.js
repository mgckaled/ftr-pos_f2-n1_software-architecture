function mostrarDiagrama(index) {
  // Esconder todos os diagramas
  const diagramas = document.querySelectorAll(".diagram-section")
  diagramas.forEach(d => d.classList.remove("active"))

  // Remover active de todos os botões
  const botoes = document.querySelectorAll("button")
  botoes.forEach(b => b.classList.remove("active"))

  // Mostrar diagrama selecionado
  document.getElementById(`diagrama${index}`).classList.add("active")
  event.target.classList.add("active")
}
