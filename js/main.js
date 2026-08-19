// ============================================================
// Instituto de Educação Santa Maria — scripts
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initHeader()
  initNav()
  initSmoothScroll()
  initReveal()
  initCounters()
  initBackToTop()
  initContactForm()
  initActiveNav()
  initContent()
  document.getElementById("year").textContent = new Date().getFullYear()
})

// Header com sombra ao rolar
function initHeader() {
  const header = document.getElementById("header")
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8)
  }
  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
}

// Menu mobile
function initNav() {
  const toggle = document.getElementById("navToggle")
  const nav = document.getElementById("nav")

  const close = () => {
    toggle.classList.remove("is-open")
    nav.classList.remove("is-open")
    toggle.setAttribute("aria-expanded", "false")
    document.body.style.overflow = ""
  }

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open")
    toggle.classList.toggle("is-open", open)
    toggle.setAttribute("aria-expanded", String(open))
    document.body.style.overflow = open ? "hidden" : ""
  })

  // Fecha ao clicar em um link
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close))
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close()
  })
}

// Scroll suave (fallback para navegadores antigos)
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href")
      if (!id || id === "#") return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  })
}

// Animação de entrada ao rolar
function initReveal() {
  const elements = document.querySelectorAll(".reveal")
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"))
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  )
  elements.forEach((el) => observer.observe(el))
}

// Contadores animados das estatísticas
function initCounters() {
  const nums = document.querySelectorAll(".stat__num[data-count]")
  if (!("IntersectionObserver" in window)) {
    nums.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")))
    return
  }

  const animate = (el) => {
    const target = Number(el.dataset.count)
    const suffix = el.dataset.suffix || ""
    const duration = 1600
    const start = performance.now()

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(target * eased)
      el.textContent = value.toLocaleString("pt-BR") + suffix
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.4 }
  )
  nums.forEach((el) => observer.observe(el))
}

// Botão voltar ao topo
function initBackToTop() {
  const btn = document.getElementById("backTop")
  const onScroll = () => {
    btn.classList.toggle("is-visible", window.scrollY > 600)
  }
  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
}

// Link ativo no menu conforme a seção visível
function initActiveNav() {
  const links = document.querySelectorAll(".nav__link")
  const sections = [...document.querySelectorAll("main section[id]")]
  const map = new Map()
  links.forEach((l) => {
    const id = l.getAttribute("href")
    if (id && id.startsWith("#")) map.set(id.slice(1), l)
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"))
          const link = map.get(entry.target.id)
          if (link) link.classList.add("is-active")
        }
      })
    },
    { rootMargin: "-40% 0px -55% 0px" }
  )
  sections.forEach((s) => observer.observe(s))
}

// Validação e envio simulado do formulário
function initContactForm() {
  const form = document.getElementById("contactForm")
  const msg = document.getElementById("formMsg")
  if (!form) return

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const nome = form.nome.value.trim()
    const email = form.email.value.trim()
    const mensagem = form.mensagem.value.trim()

    if (!nome || !email || !mensagem) {
      showFormMessage("Por favor, preencha nome, e-mail e mensagem.", true)
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormMessage("Digite um e-mail válido.", true)
      return
    }

    showFormMessage("Mensagem enviada com sucesso! Retornaremos em breve.", false)
    form.reset()
  })
}

function showFormMessage(text, isError) {
  const msg = document.getElementById("formMsg")
  msg.textContent = text
  msg.classList.toggle("is-error", isError)
  msg.classList.toggle("is-success", !isError)
  setTimeout(() => (msg.textContent = ""), 5000)
}

/* ============================================================
   Conteúdo dinâmico (Decap CMS)
   ============================================================ */

// Conteúdo de reserva (usado se os arquivos JSON não estiverem disponíveis,
// por exemplo ao abrir o site diretamente via file://)
const FALLBACK = {
  noticias: [
    { titulo: "Alunos conquistam 6 medalhas na OBMEP 2026", data: "2026-08-14", categoria: "Olimpíadas", resumo: "Nossa equipe de matemática brilhou mais uma vez com o melhor resultado da história do Instituto.", link: "" },
    { titulo: "Feira de Ciências reúne famílias e projetos inovadores", data: "2026-08-02", categoria: "Eventos", resumo: "Mais de 80 projetos apresentados por estudantes do Fundamental II e Ensino Médio.", link: "" },
    { titulo: "Campanha do agasalho entrega 400 peças a instituições", data: "2026-07-20", categoria: "Comunidade", resumo: "Alunos do grêmio estudantil lideraram a arrecadação solidária deste ano.", link: "" }
  ],
  depoimentos: [
    { nome: "Mariana Alves", descricao: "Mãe de alunos do Fundamental", texto: "Meus dois filhos estudam aqui e a diferença no cuidado com cada aluno é visível. A equipe conhece as crianças pelo nome e a família participa de tudo.", iniciais: "MA", cor: "#7c3aed" },
    { nome: "Rafael Gomes", descricao: "Ex-aluno, turma de 2024", texto: "Formei aqui no Ensino Médio e entrei em Engenharia na USP. O acompanhamento para o vestibular foi decisivo na minha trajetória.", iniciais: "RG", cor: "#0ea5e9" },
    { nome: "Patrícia Costa", descricao: "Mãe de aluna do 3º ano", texto: "O programa bilíngue e as aulas de robótica foram o que me conquistaram. Minha filha aprende brincando e adora ir para a escola.", iniciais: "PC", cor: "#10b981" }
  ],
  aviso: {
    ativo: true,
    texto: "Matrículas abertas para 2026 — turmas limitadas!",
    link: "#contato",
    linkTexto: "Agendar visita"
  }
}

const QUOTE_MARK_SVG =
  '<svg class="quote__mark" viewBox="0 0 24 24" fill="currentColor"><path d="M10 7H6a3 3 0 0 0-3 3v4h5V9H5.5A1.5 1.5 0 0 1 7 7.5V7Zm11 0h-4a3 3 0 0 0-3 3v4h5V9h-2.5A1.5 1.5 0 0 1 17 7.5V7Z"/></svg>'

const LINK_ARROW_SVG =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
]

async function initContent() {
  const [noticias, depoimentos, aviso] = await Promise.all([
    fetchJSON("content/noticias.json"),
    fetchJSON("content/depoimentos.json"),
    fetchJSON("content/aviso.json")
  ])

  renderNoticias((noticias && noticias.noticias) || FALLBACK.noticias)
  renderDepoimentos((depoimentos && depoimentos.depoimentos) || FALLBACK.depoimentos)
  renderAviso(aviso || FALLBACK.aviso)
}

async function fetchJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-cache" })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]))
}

function formatDataPT(iso) {
  if (!iso) return ""
  const [ano, mes, dia] = iso.split("-").map(Number)
  if (!ano || !mes || !dia) return iso
  return `${dia} de ${MESES[mes - 1]} de ${ano}`
}

function renderNoticias(lista) {
  const grid = document.getElementById("newsGrid")
  if (!grid) return

  grid.innerHTML = lista.map((n, i) => {
    const link = n.link
      ? `<a href="${escapeHtml(n.link)}" class="link">Ler notícia ${LINK_ARROW_SVG}</a>`
      : ""
    return `
      <article class="news__card reveal is-visible">
        <div class="news__thumb news__thumb--${(i % 3) + 1}">
          <span class="news__cat">${escapeHtml(n.categoria)}</span>
        </div>
        <div class="news__body">
          <span class="news__date">${formatDataPT(n.data)}</span>
          <h3>${escapeHtml(n.titulo)}</h3>
          <p>${escapeHtml(n.resumo)}</p>
          ${link}
        </div>
      </article>`
  }).join("")
}

function renderDepoimentos(lista) {
  const grid = document.getElementById("depoimentosGrid")
  if (!grid) return

  grid.innerHTML = lista.map((d) => `
    <figure class="quote reveal is-visible">
      ${QUOTE_MARK_SVG}
      <blockquote>${escapeHtml(d.texto)}</blockquote>
      <figcaption>
        <span class="quote__avatar" style="--i:${escapeHtml(d.cor)}">${escapeHtml(d.iniciais)}</span>
        <div><strong>${escapeHtml(d.nome)}</strong><small>${escapeHtml(d.descricao)}</small></div>
      </figcaption>
    </figure>`).join("")
}

function renderAviso(aviso) {
  const el = document.getElementById("avisoBanner")
  if (!el) return

  if (!aviso || !aviso.ativo) {
    el.hidden = true
    return
  }

  const link = aviso.link
    ? `<a class="aviso__link" href="${escapeHtml(aviso.link)}">${escapeHtml(aviso.linkTexto || "Saiba mais")}</a>`
    : ""

  el.innerHTML = `
    <div class="container aviso__inner">
      <p class="aviso__text">${escapeHtml(aviso.texto)}</p>
      ${link}
      <button class="aviso__close" aria-label="Fechar aviso">&times;</button>
    </div>`
  el.hidden = false

  el.querySelector(".aviso__close").addEventListener("click", () => {
    el.hidden = true
  })
}
