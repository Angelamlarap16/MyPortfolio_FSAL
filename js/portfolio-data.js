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
    // Frases rotativas del título profesional en portada (fáciles de editar)
    roles: [
      "Java Full Stack Developer",
      "Desarrollo Web & Diseño Responsivo",
      "Gestión de Bases de Datos y Backend"
    ],
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
    emailSubject: "Contacto profesional — Desarrollo Java Full Stack",
    phone: "+57 300 742 0213",
    location: "Bogotá, Colombia",
    github: "https://github.com/Angelamlarap16",
    githubHandle: "@Angelamlarap16",
    linkedin: "https://www.linkedin.com/in/amlarap16/",
    linkedinLabel: "Angela Lara"
  },

  // Proyectos reales ordenados con TMV y Pet Task Planner primero
  projects: [
    {
      id: "tmv",
      name: "TMV — Tu Mayorista Virtual",
      type: "Colaborativo",
      status: "Frontend desplegado",
      description:
        "Aplicación web de comercio mayorista orientada a facilitar la consulta de productos y la preparación de pedidos para pequeños negocios.",
      contributionTitle: "Mi aporte individual",
      contributions: [
        "Desarrollo de “Quiénes somos” y “Qué ofrecemos”.",
        "Lógica del resumen de compra, Validación de nombre en login.",
        "Integración entre frontend y backend.",
        "Hero en catálogo y lógica de ToolBar para filtrar por texto y ordenar productos.",
        "Organización y seguimiento del proyecto con Metodología Scrum."
      ],
      technologiesLabel: "Tecnologías del proyecto (equipo)",
      technologies: ["HTML5", "CSS3", "JavaScript", "Java", "Spring Boot", "MySQL"],
      codeUrl: "https://github.com/NightwingJP/TMV-Project",
      demoUrl: "https://nightwingjp.github.io/TMV-Project/frontend/index.html",
      image: "",
      imageAlt: "Vista previa de TMV — Tu Mayorista Virtual",
      conceptKey: "tmv"
    },
    {
      id: "pet-task-planner",
      name: "Pet Task Planner",
      type: "Personal",
      status: "En desarrollo y mejora",
      description:
        "Aplicación web para organizar actividades de cuidado de mascotas mediante un tablero con responsables, categorías, prioridades y fechas límite.",
      contributionTitle: "Mi aporte",
      contributions: [
        "Desarrollo del formulario, validaciones, gestión de tareas y persistencia local."
      ],
      featuresTitle: "Funciones implementadas",
      features: [
        "Crear tareas, cambiar estado, reasignar responsables, eliminar y conservar datos mediante localStorage."
      ],
      nextSteps: [
        "Implementación base de datos y conexión con backend (En proceso)."
      ],
      technologiesLabel: "Tecnologías",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      codeUrl: "https://github.com/Angelamlarap16/TaskPlanner_AL",
      demoUrl: "",
      image: "",
      imageAlt: "Vista previa de Pet Task Planner",
      conceptKey: "pet-task-planner"
    },
    {
      id: "agenda-telefonica-mvc",
      name: "Agenda Telefónica MVC",
      type: "Proyecto de hackathon",
      status: "Prototipo implementado, documentación en proceso",
      description:
        "Aplicación de escritorio para registrar, buscar, modificar y eliminar contactos telefónicos.",
      featuresTitle: "Características",
      features: [
        "Patrón Modelo-Vista-Controlador.",
        "Validaciones de nombres y teléfonos.",
        "Detección de duplicados.",
        "Control de capacidad.",
        "Listado alfabético.",
        "Selección desde una tabla."
      ],
      technologies: [],
      codeUrl: "https://github.com/Angelamlarap16/Hackathon2_Telephone",
      demoUrl: "",
      image: "",
      imageAlt: "Vista previa de Agenda Telefónica MVC",
      conceptKey: "agenda-telefonica-mvc"
    },
    /*OPCIONAL, EVALUAR OTRO PROYECTO*/
    {
      id: "qa-con-jest",
      name: "QA con Jest",
      type: "Práctica técnica",
      status: "Código y pruebas implementados",
      description:
        "Laboratorio de pruebas unitarias para verificar funciones en JavaScript y comprobar casos límite.",
      featuresTitle: "Contenido",
      features: [
        "Pruebas de operaciones matemáticas.",
        "Enteros y decimales.",
        "Manejo de división por cero mediante una excepción.",
        "Prueba de ese comportamiento."
      ],
      technologiesLabel: "Tecnologías",
      technologies: ["JavaScript", "Jest"],
      codeUrl: "https://github.com/Angelamlarap16/Testing-DebugginCode_AL",
      demoUrl: "",
      image: "",
      imageAlt: "Vista previa de QA con Jest",
      conceptKey: "qa-con-jest"
    }
  ],
  about: {
    paragraphs: [
      "Soy desarrolladora Java Full Stack, en formación y licenciada en Psicología y Pedagogía por la Universidad Pedagógica Nacional. Actualmente curso el bootcamp de Generation y desarrollo proyectos que me permiten aplicar programación, diseño responsivo, control de versiones y trabajo colaborativo.",
      "Mi experiencia profesional me ha permitido fortalecer el análisis de necesidades, la revisión de calidad y la documentación de procesos. Busco oportunidades junior o trainee para seguir creciendo en desarrollo web y contribuir a la construcción de aplicaciones claras y funcionales."
    ],
    highlights: [
      {
        title: "Desarrollo web",
        description: "HTML, CSS y JavaScript."
      },
      {
        title: "Formación Full Stack",
        description: "Java, Spring Boot y MySQL."
      },
      {
        title: "Calidad y colaboración",
        description: "Revisión funcional, documentación, Git y Scrum."
      }
    ]
  },

  experience: {
    work: [
      {
        organization: "UNIDEV",
        role: "EdTech Innovation & Learning Systems Analyst",
        modality: "Remota",
        period: "2026 – actualidad",
        contextTag: "Experiencia profesional",
        tasks: [
          "Implementación y adaptación de lecciones con HTML y CSS.",
          "Revisión funcional y validación de recursos y actividades en Moodle.",
          "Documentación y seguimiento de ajustes.",
          "Participación en ciclos ágiles."
        ]
      }
    ],
    trainingProjects: [
      {
        organization: "Generation",
        role: "Participante del bootcamp Java Full Stack",
        period: "2026, en formación",
        contextTag: "Proyectos formativos",
        highlights: [
          "Desarrollo de proyectos web en equipo e integración entre frontend y backend.",
          "Control de versiones con Git y trabajo colaborativo en repositorios compartidos.",
          "Organización de entregas y seguimiento mediante Scrum."
        ]
      }
    ]
  },

  skills: [
    {
      category: "Frontend",
      contextTag: "Aplicado en proyectos",
      items: ["HTML5", "CSS3", "JavaScript", "Diseño responsivo"]
    },
    {
      category: "Backend y datos",
      contextTag: "En formación",
      items: ["Java", "Spring Boot", "MySQL"]
    },
    {
      category: "Herramientas",
      contextTag: "Aplicado en proyectos",
      items: ["Git", "GitHub", "Visual Studio Code", "IntelliJ IDEA"]
    },
    {
      category: "Colaboración",
      contextTag: "Experiencia profesional",
      items: ["Scrum", "Comunicación", "Documentación"]
    },
    {
      category: "Calidad",
      contextTag: "Experiencia profesional",
      items: [
        "Revisión funcional",
        "Validación de interfaces",
        "Práctica de pruebas unitarias con Jest"
      ]
    },
    {
      category: "Habilidades de trabajo",
      contextTag: "",
      items: [
        "Pensamiento analítico",
        "Atención al detalle",
        "Aprendizaje continuo",
        "Trabajo en equipo"
      ]
    },
    {
      category: "Idiomas",
      contextTag: "",
      items: ["Español nativo", "Inglés B1"]
    }
  ],

  education: {
    primary: [
      {
        institution: "Generation",
        program: "Desarrollo Java Full Stack Jr.",
        period: "2026, en formación"
      },
      {
        institution: "Universidad Pedagógica Nacional",
        program: "Licenciatura en Psicología y Pedagogía",
        period: "Julio de 2022"
      }
    ],
    complementary: [
      {
        program: "Programación Web Básica con HTML, CSS y JavaScript",
        institution: "CVA del Tecnológico de Monterrey",
        period: ""
      },
      {
        program: "Aspectos básicos del Diseño de Experiencia del Usuario",
        institution: "Google / Coursera",
        period: "Abril de 2026"
      },
      {
        program: "Fundamentos de Inteligencia Artificial",
        institution: "MinTIC e IBM",
        period: "Julio de 2026"
      }
    ]
  },

  // El blog permanecerá oculto mientras no existan artículos aprobados
  articles: [],

  // Configuración del CV: enlace externo al PDF y soporte para versión imprimible
  cv: {
    pdfUrl: "https://drive.google.com/file/d/15HU25xqzLNr0SoEpWRJlTUCxcwPN7FQD/view?usp=sharing",
    printableAvailable: true,
    printLabel: "Imprimir / Guardar PDF",
    pdfLabel: "Abrir CV en PDF"
  }
};
