/* ==========================================================================
   Datos centralizados del portafolio profesional de Angela María Lara Picón
   Archivo clásico (sin módulos ES) para compatibilidad directa con index.html
   ========================================================================== */

window.PORTFOLIO_DATA = {
  profile: {
    fullName: "Angela María Lara Picón",
    displayName: "Angela Lara",
    initials: "AL",
    role: "Desarrolladora Java Full Stack",
    location: "Bogotá, Colombia",
    summary:
    "Desarrollo proyectos web con HTML, CSS, JavaScript, Java, Spring Boot y MySQL durante mi formación en Generation. Aporto experiencia profesional en revisión de calidad, documentación y trabajo colaborativo, con especial interés en el desarrollo web responsivo.",
    languages: [
      { name: "Español", level: "Nativo" },
      { name: "Inglés", level: "B1" }
    ],
    // Fotografía desactivada temporalmente para mostrar la composición tipográfica AL en portada
    heroImage: ""
  },

  contact: {
    email: "angelamlarap16@gmail.com",
    phone: "+57 300 742 0213",
    location: "Bogotá, Colombia",
    github: "https://github.com/Angelamlarap16",
    linkedin: "https://www.linkedin.com/in/amlarap16/"
  },

  // Colecciones preparadas para poblar y renderizar en pasos posteriores
  projects: [],
  experience: [],
  skills: [],
  education: [],

  // El blog permanecerá oculto mientras no existan artículos aprobados
  articles: [],

  // Configuración del CV: enlace PDF pendiente y soporte para versión imprimible
  cv: {
    pdfUrl: "",
    printableAvailable: true,
    printLabel: "Versión imprimible"
  }
};
