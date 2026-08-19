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
  initModal()
  initLightbox()
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
    { titulo: "Feira de Ciências reúne famílias e projetos inovadores", data: "2026-08-02", categoria: "Eventos", resumo: "Mais de 80 projetos apresentados por estudantes do Fundamental II e dos cursos técnicos.", link: "" },
    { titulo: "Campanha do agasalho entrega 400 peças a instituições", data: "2026-07-20", categoria: "Comunidade", resumo: "Alunos do grêmio estudantil lideraram a arrecadação solidária deste ano.", link: "" }
  ],
  depoimentos: [
    { nome: "Mariana Alves", descricao: "Mãe de alunos do Fundamental", texto: "Meus dois filhos estudam aqui e a diferença no cuidado com cada aluno é visível. A equipe conhece as crianças pelo nome e a família participa de tudo.", iniciais: "MA", cor: "#7c3aed" },
    { nome: "Rafael Gomes", descricao: "Ex-aluno, turma de 2024", texto: "Fiz o Curso Técnico aqui e a formação foi decisiva para eu entrar no mercado de trabalho.", iniciais: "RG", cor: "#0ea5e9" },
    { nome: "Patrícia Costa", descricao: "Mãe de aluna do 3º ano", texto: "O programa bilíngue e as aulas de robótica foram o que me conquistaram. Minha filha aprende brincando e adora ir para a escola.", iniciais: "PC", cor: "#10b981" }
  ],
  aviso: {
    ativo: true,
    texto: "Matrículas abertas para 2026 — turmas limitadas!",
    link: "#contato",
    linkTexto: "Agendar visita"
  },
  resultados: {
    aprovacao: "98%",
    notaEnem: "720",
    medalhas: "45",
    formados: "3.500",
    faculdades: ["USP", "UFMG", "Unicamp", "PUC Minas", "UFV", "UFLA", "UFSJ", "UFOP"]
  },
  faq: [
    { pergunta: "Quando abrem as matrículas para 2026?", resposta: "As matrículas abrem em outubro. Acompanhe nosso site e redes sociais para não perder as datas." },
    { pergunta: "Quais documentos são necessários?", resposta: "Certidão de nascimento, histórico escolar, comprovante de residência e documento do responsável." },
    { pergunta: "Quais são as formas de pagamento?", resposta: "À vista com desconto ou parcelado. Consulte as condições na secretaria." },
    { pergunta: "Há transporte escolar?", resposta: "Sim, trabalhamos com parceiros de transporte escolar. Consulte as rotas disponíveis." },
    { pergunta: "A escola oferece bolsas?", resposta: "Sim, há bolsas por critérios socioeconômicos e de desempenho. Consulte a secretaria." }
  ],
  galeria: { fotos: [] }
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
  const [noticias, depoimentos, aviso, resultados, faq, galeria] = await Promise.all([
    fetchJSON("content/noticias.json"),
    fetchJSON("content/depoimentos.json"),
    fetchJSON("content/aviso.json"),
    fetchJSON("content/resultados.json"),
    fetchJSON("content/faq.json"),
    fetchJSON("content/galeria.json")
  ])

  renderNoticias((noticias && noticias.noticias) || FALLBACK.noticias)
  renderDepoimentos((depoimentos && depoimentos.depoimentos) || FALLBACK.depoimentos)
  renderAviso(aviso || FALLBACK.aviso)
  renderResultados(resultados || FALLBACK.resultados)
  renderFaq((faq && faq.faq) || FALLBACK.faq)
  renderGaleria((galeria && galeria.fotos) || FALLBACK.galeria.fotos)
}

// URL base do conteúdo no GitHub (raw).
// O raw tem cache curto (~5 min), então as edições do CMS aparecem
// publicadas quase na hora, sem depender de purge manual.
const CDN_BASE = "https://raw.githubusercontent.com/rilkcesar/instituto-santa-maria/main"

async function fetchJSON(path) {
  // 1. CDN do GitHub (conteúdo atualizado via CMS)
  const remoto = await tryFetchJSON(`${CDN_BASE}/${path}`)
  if (remoto) return remoto

  // 2. Arquivo local (fallback, caso esteja no mesmo servidor)
  const local = await tryFetchJSON(path)
  if (local) return local

  return null
}

async function tryFetchJSON(url) {
  try {
    const res = await fetch(url, { cache: "no-cache" })
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

let noticiasAtuais = []

function renderNoticias(lista) {
  noticiasAtuais = lista
  const grid = document.getElementById("newsGrid")
  if (!grid) return

  grid.innerHTML = lista.map((n, i) => {
    const resumo = (n.resumo || "").trim()
    const conteudo = (n.conteudo || "").trim()
    const temLeiaMais = Boolean(conteudo) || resumo.length > 180

    const link = n.link
      ? `<a href="${escapeHtml(n.link)}" class="link" target="_blank" rel="noopener">Ler notícia ${LINK_ARROW_SVG}</a>`
      : ""

    const leiaMais = temLeiaMais
      ? `<button type="button" class="link news__more" data-noticia-index="${i}">Leia mais ${LINK_ARROW_SVG}</button>`
      : ""

    return `
      <article class="news__card reveal is-visible">
        <div class="news__thumb news__thumb--${(i % 3) + 1}">
          <span class="news__cat">${escapeHtml(n.categoria)}</span>
        </div>
        <div class="news__body">
          <span class="news__date">${formatDataPT(n.data)}</span>
          <h3>${escapeHtml(n.titulo)}</h3>
          <p class="news__resumo">${escapeHtml(resumo)}</p>
          ${leiaMais || link}
        </div>
      </article>`
  }).join("")

  grid.onclick = (e) => {
    const btn = e.target.closest("[data-noticia-index]")
    if (!btn) return
    abrirNoticia(noticiasAtuais[Number(btn.dataset.noticiaIndex)])
  }
}

function initModal() {
  const modal = document.getElementById("noticiaModal")
  if (!modal) return
  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", fecharNoticia)
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) fecharNoticia()
  })
}

function abrirNoticia(n) {
  const modal = document.getElementById("noticiaModal")
  const body = document.getElementById("noticiaModalBody")
  if (!modal || !body || !n) return

  const conteudo = (n.conteudo || n.resumo || "").trim()
  const link = n.link
    ? `<a class="btn btn--primary" href="${escapeHtml(n.link)}" target="_blank" rel="noopener">Abrir link original</a>`
    : ""

  body.innerHTML = `
    <span class="modal__cat">${escapeHtml(n.categoria || "")}</span>
    <h3 class="modal__titulo">${escapeHtml(n.titulo || "")}</h3>
    <span class="modal__data">${formatDataPT(n.data)}</span>
    <div class="modal__texto">${escapeHtml(conteudo)}</div>
    ${link}`
  modal.hidden = false
  document.body.style.overflow = "hidden"
}

function fecharNoticia() {
  const modal = document.getElementById("noticiaModal")
  if (!modal) return
  modal.hidden = true
  document.body.style.overflow = ""
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

function renderResultados(r) {
  const el = document.getElementById("resultsGrid")
  if (!el || !r) return

  const numeros = [
    { valor: r.aprovacao, label: "de aprovação nos vestibulares" },
    { valor: r.notaEnem, label: "nota média no ENEM" },
    { valor: r.medalhas, label: "medalhas em olimpíadas" },
    { valor: r.formados, label: "alunos formados" }
  ].filter((n) => n.valor)

  const faculdades = (r.faculdades || []).map((f) => String(f).trim()).filter(Boolean)

  el.innerHTML = `
    <div class="results__stats">
      ${numeros.map((n) => `
        <div class="results__stat">
          <span class="results__valor">${escapeHtml(n.valor)}</span>
          <span class="results__label">${escapeHtml(n.label)}</span>
        </div>`).join("")}
    </div>
    ${faculdades.length ? `
    <div class="results__facs">
      <p class="results__facs-titulo">Aprovações em destaque</p>
      <div class="results__facs-list">
        ${faculdades.map((f) => `<span class="results__fac">${escapeHtml(f)}</span>`).join("")}
      </div>
    </div>` : ""}`
}

function renderFaq(lista) {
  const el = document.getElementById("faqList")
  if (!el) return

  if (!lista || !lista.length) {
    el.innerHTML = `<p class="faq__vazio">Em breve, as perguntas frequentes.</p>`
    return
  }

  el.innerHTML = lista.map((item, i) => `
    <div class="faq__item">
      <button type="button" class="faq__q" data-faq-index="${i}" aria-expanded="false">
        <span>${escapeHtml(item.pergunta)}</span>
        <svg class="faq__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="faq__a" hidden>${escapeHtml(item.resposta)}</div>
    </div>`).join("")

  el.querySelectorAll(".faq__q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const resposta = btn.parentElement.querySelector(".faq__a")
      const aberto = !resposta.hidden
      el.querySelectorAll(".faq__a").forEach((a) => { a.hidden = true })
      el.querySelectorAll(".faq__q").forEach((b) => {
        b.setAttribute("aria-expanded", "false")
        b.classList.remove("is-open")
      })
      if (!aberto) {
        resposta.hidden = false
        btn.setAttribute("aria-expanded", "true")
        btn.classList.add("is-open")
      }
    })
  })
}

function renderGaleria(fotos) {
  const el = document.getElementById("galeriaGrid")
  if (!el) return

  if (!fotos || !fotos.length) {
    el.innerHTML = `
      <div class="galeria__vazio">
        <p>Fotos em breve. Acompanhe nosso Instagram
          <a href="https://instagram.com/institutodeeducacaosantamaria" target="_blank" rel="noopener">@institutodeeducacaosantamaria</a>.
        </p>
      </div>`
    return
  }

  el.innerHTML = fotos.map((f) => `
    <button type="button" class="galeria__item" data-foto="${escapeHtml(f.imagem)}" data-legenda="${escapeHtml(f.legenda || "")}">
      <img src="${escapeHtml(f.imagem)}" alt="${escapeHtml(f.legenda || "Foto da escola")}" loading="lazy" />
      ${f.legenda ? `<span class="galeria__legenda">${escapeHtml(f.legenda)}</span>` : ""}
    </button>`).join("")

  el.onclick = (e) => {
    const btn = e.target.closest("[data-foto]")
    if (!btn) return
    abrirLightbox(btn.dataset.foto, btn.dataset.legenda)
  }
}

function initLightbox() {
  const box = document.getElementById("galeriaLightbox")
  if (!box) return
  box.querySelector(".lightbox__close").addEventListener("click", fecharLightbox)
  box.addEventListener("click", (e) => {
    if (e.target === box) fecharLightbox()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !box.hidden) fecharLightbox()
  })
}

function abrirLightbox(src, legenda) {
  const box = document.getElementById("galeriaLightbox")
  const img = document.getElementById("galeriaLightboxImg")
  const cap = document.getElementById("galeriaLightboxCaption")
  if (!box || !img) return
  img.src = src
  img.alt = legenda || "Foto da escola"
  cap.textContent = legenda || ""
  box.hidden = false
  document.body.style.overflow = "hidden"
}

function fecharLightbox() {
  const box = document.getElementById("galeriaLightbox")
  if (!box) return
  box.hidden = true
  document.body.style.overflow = ""
}
