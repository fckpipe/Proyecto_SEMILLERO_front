// ─────────────────────────────────────────────────────────
// DATOS REALES DEL CURSO PEDAGÓGICO - LEY 769 (TRANSFORMACIÓN VIRTUAL)
// ─────────────────────────────────────────────────────────

export const MODULES = [
  {
    id: 1,
    title: 'Normas Básicas y Velocidades',
    description: 'Fundamentos del Código Nacional de Tránsito y nuevos límites de velocidad (Ley Julián Esteban).',
    icon: '⚖️',
    color: 'from-blue-600 to-blue-800',
    estimatedMinutes: 40,
    lessons: [
      { id: '1-1', title: 'Ley 769 de 2002 y sus reformas', duration: '15 min' },
      { id: '1-2', title: 'Nuevos Límites de Velocidad (Ley 2251)', duration: '15 min' },
      { id: '1-3', title: 'Documentación y Prelación Vial', duration: '10 min' },
    ],
  },
  {
    id: 2,
    title: 'Señalización y Demarcación',
    description: 'Clasificación y significado técnico de la señalética vial y marcas en el pavimento.',
    icon: '🚦',
    color: 'from-verde-500 to-verde-700',
    estimatedMinutes: 40,
    lessons: [
      { id: '2-1', title: 'Señales Reglamentarias y Preventivas', duration: '15 min' },
      { id: '2-2', title: 'Señales Informativas y Transitorias', duration: '15 min' },
      { id: '2-3', title: 'Demarcación Horizontal y Semáforos', duration: '10 min' },
    ],
  },
  {
    id: 3,
    title: 'Responsabilidad y Convivencia',
    description: 'La Pirámide de la Movilidad y el respeto por los actores vulnerables.',
    icon: '🤝',
    color: 'from-indigo-500 to-indigo-700',
    estimatedMinutes: 40,
    lessons: [
      { id: '3-1', title: 'Actor Vial y Vulnerabilidad', duration: '15 min' },
      { id: '3-2', title: 'Derechos del Ciclista y Peatón', duration: '15 min' },
      { id: '3-3', title: 'Inteligencia Emocional y Conflictos', duration: '10 min' },
    ],
  },
  {
    id: 4,
    title: 'Infracciones y Sanciones',
    description: 'Categorías de multas A-F y el proceso legal del comparendo en Colombia.',
    icon: '⚖️',
    color: 'from-red-600 to-red-800',
    estimatedMinutes: 40,
    lessons: [
      { id: '4-1', title: 'Gravedad de las Infracciones (A, B, C, D)', duration: '15 min' },
      { id: '4-2', title: 'Embriaguez y Suspensión de Licencia', duration: '15 min' },
      { id: '4-3', title: 'Proceso de Comparendo y SIMIT', duration: '10 min' },
    ],
  },
  {
    id: 5,
    title: 'Cultura Vial y Emergencias',
    description: 'Protocolo PAS y compromiso ético con la seguridad vial de Cali.',
    icon: '🎯',
    color: 'from-dorado-400 to-dorado-600',
    estimatedMinutes: 40,
    lessons: [
      { id: '5-1', title: 'Primeros Auxilios: Protocolo PAS', duration: '15 min' },
      { id: '5-2', title: 'Mantenimiento Preventivo y Equipo', duration: '15 min' },
      { id: '5-3', title: 'Compromiso Cali Segura', duration: '10 min' },
    ],
  },
]

export const LESSON_CONTENT = {
  1: {
    title: 'Normas Básicas y Velocidades',
    subtitle: 'El marco legal de la movilidad en Colombia',
    content: [
      { type: 'intro', text: 'La Ley 769 de 2002 constituye la base jurídica para el tránsito en todo el territorio nacional, regulando desde peatones hasta conductores profesionales.' },
      { type: 'highlight', icon: '⚡', title: 'Ley Julián Esteban (2251 de 2022)', text: 'Esta ley actualizó los límites de velocidad: 50 km/h en zonas urbanas y 30 km/h en zonas escolares y residenciales.' },
      { type: 'list', title: 'Puntos Clave del Módulo', items: [
        'Velocidad máxima urbana: 50 km/h',
        'Zonas escolares/residenciales: 30 km/h',
        'Cinturón de seguridad obligatorio en todas las plazas',
        'Prohibición total de sostener el celular al conducir',
        'Prelación en intersecciones (vehículo a la derecha)'
      ]},
      { type: 'stat', icon: '🎓', label: 'Ley de Tránsito', value: '769', sub: 'Año 2002' },
      { type: 'closing', text: 'Cumplir los límites de velocidad reduce en un 80% la probabilidad de accidentes fatales.' },
    ],
    aiQuestions: [
      {
        id: '1-q1',
        type: 'boolean',
        text: '¿El límite de velocidad en zonas escolares en Colombia es de 30 km/h?',
        correctOption: true,
        helpContent: 'Recuerda que los niños son el actor más protegido de la vía.',
        helpExample: 'Si pasas por un colegio a las 7 AM, tu velocímetro no debe pasar del número 30.',
        rephrasedText: '¿Es verdad que debemos bajar a 30 km/h cerca de instituciones educativas?',
        explanation: 'La Ley 2251 de 2022 establece 30 km/h como máximo absoluto en zonas escolares.',
        successMsg: '¡Excelente! La vida de los niños es prioridad.'
      },
      {
        id: '1-q2',
        type: 'multiple',
        text: '¿Cuál es la velocidad máxima urbana permitida para vehículos particulares?',
        options: ['30 km/h', '40 km/h', '50 km/h', '60 km/h'],
        correctOption: 2, 
        helpContent: 'Es un número redondo que se actualizó recientemente para todas las ciudades.',
        helpExample: 'En la Calle 5ta o la Autopista Sur, si no hay señales, este es tu límite.',
        rephrasedText: 'Según la nueva norma, ¿cuál es el tope de velocidad dentro de la ciudad?',
        explanation: 'El límite genérico urbano en Colombia se unificó a 50 km/h para mejorar la seguridad.',
        successMsg: '¡Muy bien! 50 km/h es el estándar urbano actual.'
      },
      {
        id: '1-q3',
        type: 'boolean',
        text: '¿Está permitido sostener el teléfono celular con la mano mientras se conduce si el vehículo está detenido en un semáforo?',
        correctOption: false,
        helpContent: 'Considera que la distracción visual sigue presente en cualquier punto de la vía.',
        helpExample: 'Aunque el carro esté quieto, si el motor está encendido, eres el conductor activo.',
        rephrasedText: '¿Se puede "chatear" en el semáforo rojo?',
        explanation: 'La ley prohíbe manipular dispositivos móviles en cualquier momento durante la conducción activa.',
        successMsg: '¡Así es! Nada de celulares al volante.'
      }
    ]
  },
  2: {
    title: 'Señalización y Demarcación',
    subtitle: 'El lenguaje visual de la infraestructura vial',
    content: [
      { type: 'intro', text: 'Las señales de tránsito no son sugerencias; son órdenes, advertencias o guías fundamentales para la convivencia.' },
      { type: 'highlight', icon: '🔴', title: 'Reglamentarias', text: 'Indican prohibiciones o restricciones. Desacatarlas es una infracción directa (Borde rojo).' },
      { type: 'highlight', icon: '🟡', title: 'Preventivas', text: 'Advierten sobre riesgos o condiciones de la vía (Fondo amarillo).' },
      { type: 'highlight', icon: '🔵', title: 'Informativas', text: 'Orientan sobre destinos o servicios (Fondo azul/verde).' },
      { type: 'list', title: 'Demarcación Horizontal', items: [
        'Doble línea amarilla: Prohibido adelantar en ambos sentidos',
        'Línea blanca discontinua: Permite cambio de carril con precaución',
        'Cebra peatonal: Territorio exclusivo del peatón',
        'Línea de PARE: Detención total obligatoria'
      ]},
    ],
    aiQuestions: [
      {
        id: '2-q1',
        type: 'boolean',
        text: '¿La señal de PARE es clasificada como una señal Preventiva?',
        correctOption: false,
        helpContent: 'Piensa si te está avisando algo o te está dando una orden obligatoria.',
        helpExample: 'Un "Pare" tiene borde rojo. Las rojas son órdenes, no avisos.',
        rephrasedText: '¿Es el PARE una señal de advertencia de peligro?',
        explanation: 'El PARE es una señal Reglamentaria, su cumplimiento es obligatorio bajo sanción.',
        successMsg: '¡Correcto! Es reglamentaria.'
      },
      {
        id: '2-q2',
        type: 'multiple',
        text: '¿Qué indica una doble línea amarilla continua en el centro de la calzada?',
        options: ['Permitido adelantar solo motos', 'Prohibido adelantar en ambos sentidos', 'Vía de un solo sentido', 'Solo buses pueden pasar'],
        correctOption: 1,
        helpContent: 'El color amarillo separa flujos opuestos, y la línea continua es un "muro invisible".',
        helpExample: 'Es la línea que ves en curvas peligrosas o puentes.',
        rephrasedText: 'Si ves dos líneas amarillas pegadas, ¿puedes sobrepasar al carro de adelante?',
        explanation: 'La doble línea amarilla continua es la máxima restricción de adelantamiento.',
        successMsg: '¡Exacto! Es un muro de seguridad que no se debe cruzar.'
      },
      {
        id: '2-q3',
        type: 'multiple',
        text: 'Las señales preventivas suelen tener una forma y color específicos. ¿Cuáles son?',
        options: ['Circulares rojas', 'Cuadradas azules', 'En forma de rombo amarillo', 'Triangulares verdes'],
        correctOption: 2,
        helpContent: 'Piensa en las señales de "Curva Peligrosa" o "Resalto".',
        helpExample: 'Son las que parecen un diamante amarillo.',
        rephrasedText: '¿Qué aspecto visual tienen las señales que avisan peligro?',
        explanation: 'Las señales preventivas en Colombia son en forma de rombo (diamante) con fondo amarillo y símbolos negros.',
        successMsg: '¡Muy bien! Rombo amarillo significa prevención.'
      }
    ]
  },
  3: {
    title: 'Responsabilidad y Convivencia',
    subtitle: 'Humanizando el espacio público',
    content: [
      { type: 'intro', text: 'La seguridad vial es un acto de empatía. El vehículo más fuerte debe proteger siempre al más débil.' },
      { type: 'highlight', icon: '🚶', title: 'Pirámide de Movilidad', text: 'Prioridad 1: Peatón, Prioridad 2: Ciclista, Prioridad 3: Transporte Público.' },
      { type: 'stat', icon: '🚴', label: 'Distancia lateral', value: '1.5 metros', sub: 'Al adelantar ciclistas' },
      { type: 'list', title: 'Deberes Éticos', items: [
        'Respetar el espacio del ciclista (ocupa un carril)',
        'Ceder el paso a personas con movilidad reducida',
        'Uso del pito solo para emergencias inminentes',
        'Cortesía: facilitar la incorporación de otros vehículos'
      ]},
    ],
    aiQuestions: [
      {
        id: '3-q1',
        type: 'multiple',
        text: '¿Quién tiene la máxima prelación en la jerarquía de movilidad colombiana?',
        options: ['El conductor de bus', 'El motociclista', 'El peatón', 'El conductor de ambulancia'],
        correctOption: 2,
        helpContent: 'Piensa en quién no tiene ninguna armadura metálica para protegerse.',
        helpExample: 'Si un peatón pone un pie en la calle, todos los motores deben respetarlo.',
        rephrasedText: '¿Cuál es el actor vial más importante según la ley?',
        explanation: 'El peatón encabeza la pirámide de movilidad por su vulnerabilidad extrema.',
        successMsg: '¡Correcto! El peatón es el rey de la vía.'
      },
      {
        id: '3-q2',
        type: 'boolean',
        text: '¿Los ciclistas tienen derecho a ocupar el centro de un carril completo a la derecha?',
        correctOption: true,
        helpContent: 'Obligarlos a transitar por la cuneta aumenta el riesgo de caídas.',
        helpExample: 'La ley los autoriza a usar el mismo espacio que usaría una motocicleta a la derecha.',
        rephrasedText: '¿Puede una bicicleta usar un carril para su seguridad?',
        explanation: 'La Ley PROBICI les garantiza el derecho a ocupar un carril a la derecha, para evitar encerramientos.',
        successMsg: '¡Excelente! Los ciclistas son parte legal de la vía.'
      },
      {
        id: '3-q3',
        type: 'multiple',
        text: '¿Cuál debe ser la distancia mímima al adelantar a un ciclista?',
        options: ['0.5 metros', '1 metro', '1.5 metros', '2 metros'],
        correctOption: 2,
        helpContent: 'Imagínate a ti mismo abriendo completamente una puerta de tu carro.',
        helpExample: 'Se requiere una distancia considerable para no desestabilizarlos con el viento.',
        rephrasedText: '¿Cuántos metros de separación lateral debemos dejar?',
        explanation: 'La ley manda un margen de 1.5 metros de separación obligatoria para garantizar la vida del ciclista.',
        successMsg: '¡Correcto! 1.5 metros salva vidas.'
      }
    ]
  },
  4: {
    title: 'Infracciones y Sanciones',
    subtitle: 'El costo de ignorar la normativa',
    content: [
      { type: 'intro', text: 'Las infracciones se miden en SMDLV (Salarios Mínimos Diarios Legales Vigentes).' },
      { type: 'list', title: 'Categorías de Multas', items: [
        'Categoría A: 4 SMDLV (Ej: No transitar por la derecha)',
        'Categoría B: 8 SMDLV (Ej: Conducir con licencia vencida)',
        'Categoría C: 15 SMDLV (Ej: Exceso de velocidad, semáforo rojo)',
        'Categoría D: 30 SMDLV + Patios (Ej: Contravía, sin SOAT)',
        'Categoría F: Embriaguez (Multas hasta 50 millones y cancelación)'
      ]},
      { type: 'highlight', icon: '⚖️', title: 'Reincidencia', text: 'Cometer dos infracciones en menos de 6 meses produce suspensión automática de licencia.' },
    ],
    aiQuestions: [
      {
        id: '4-q1',
        type: 'boolean',
        text: '¿Es verdad que negarse a la prueba de alcoholemia genera la sanción más alta de la ley?',
        correctOption: true,
        helpContent: 'La ley asume que el que nada debe, nada teme.',
        helpExample: 'Si te niegas, te pondrán la multa Grado 3, grúa y suspensión por 10 años.',
        rephrasedText: '¿Es mejor negarse a soplar el alcoholímetro para evitar la multa?',
        explanation: 'Negarse a la prueba conlleva automáticamente la sanción máxima de la categoría F.',
        successMsg: '¡Exacto! Nunca es opción negarse.'
      },
      {
        id: '4-q2',
        type: 'multiple',
        text: '¿A cuántos Salarios Mínimos Diarios equivale una infracción categoría C (como pasarse un rojo)?',
        options: ['8 SMDLV', '15 SMDLV', '30 SMDLV', '45 SMDLV'],
        correctOption: 1,
        helpContent: 'Revisa la tabla de categorías en el contenido superior.',
        helpExample: 'Es exactamente la mitad de los 30 salarios que cuesta conducir en contravía.',
        rephrasedText: '¿Cuánto vale la multa por incumplir un semáforo?',
        explanation: 'Las infracciones tipo C equivalen a 15 SMDLV en Colombia.',
        successMsg: '¡Correcto! Son 15 SMDLV.'
      },
      {
        id: '4-q3',
        type: 'boolean',
        text: '¿Cometer dos infracciones en un rango de 6 meses puede suspender tu licencia de conducción?',
        correctOption: true,
        helpContent: 'A esto se le conoce legalmente como reincidencia grave.',
        helpExample: 'Si te multan hoy, y vuelves a ser multado en dos meses, tendrás un problema mayor.',
        rephrasedText: '¿Perderé la licencia temporalmente si soy multado frecuentemente?',
        explanation: 'El artículo 124 del Código establece la suspensión por 6 meses frente a la reincidencia.',
        successMsg: '¡Así es! La reincidencia castiga el hábito infractor.'
      }
    ]
  },
  5: {
    title: 'Cultura Vial y Emergencias',
    subtitle: 'Actuar correctamente salva vidas',
    content: [
      { type: 'intro', text: 'Ante un siniestro vial, cada segundo cuenta. El protocolo PAS es el estándar internacional de actuación.' },
      { type: 'highlight', icon: '🆘', title: 'Protocolo PAS', text: 'PROTEGER el lugar, AVISAR a emergencias (123), SOCORRER a heridos leves.' },
      { type: 'list', title: 'Equipo Obligatorio', items: [
        'Extintor vigente y cargado',
        'Dos tacos para bloquear ruedas',
        'Botiquín de primeros auxilios',
        'Dos señales reflectivas (triángulos)',
        'Chaleco reflectivo y herramientas básicas'
      ]},
      { type: 'closing', text: 'Cali progresa cuando sus conductores se cuidan unos a otros.' },
    ],
    aiQuestions: [
      {
        id: '5-q1',
        type: 'multiple',
        text: '¿Qué significan las siglas del protocolo de emergencia **PAS**?',
        options: ['Parar, Ayudar, Salir', 'Proteger, Avisar, Socorrer', 'Prudencia, Apoyo, Seguridad', 'Policía, Ambulancia, Semáforo'],
        correctOption: 1,
        helpContent: 'Es un orden lógico: primero tu seguridad, luego pedir ayuda, luego actuar.',
        helpExample: 'Primero pongo conos, luego llamo al 123 y de último miro al herido.',
        rephrasedText: '¿Cuál es el orden correcto para atender un accidente vial?',
        explanation: 'PAS: Proteger (asegurar escena), Avisar (llamar 123), Socorrer (primeros auxilios).',
        successMsg: '¡Perfecto! Ese es el protocolo salvavidas.'
      },
      {
        id: '5-q2',
        type: 'boolean',
        text: '¿Frente a un choque sin lesionados y vehículos funcionales (daños menores), se deben dejar los vehículos en el sitio deteniendo el tráfico?',
        correctOption: false,
        helpContent: 'Los pequeños choques "de latas" causan inmensos bloqueos si nadie mueve el auto.',
        helpExample: 'La ley actual exige tomar fotos y despejar.',
        rephrasedText: '¿Se deben mover los carros en un choque donde nadie salió herido?',
        explanation: 'La Ley 2251 ordena retirar los vehículos inmediatamente después de recabar evidencia fotográfica para no obstaculizar.',
        successMsg: '¡Excelente validación de flujo vehicular!'
      },
      {
        id: '5-q3',
        type: 'multiple',
        text: '¿A cuál línea principal debes llamar inicialmente al "Avisar" sobre un accidente con lesionados graves?',
        options: ['Línea 123', 'A la aseguradora', 'A tránsito de su municipio', 'Al #767'],
        correctOption: 0,
        helpContent: 'Apunta a la línea nacional de emergencias.',
        helpExample: 'El número 1,2... 3',
        rephrasedText: '¿Cuál es el número de emergencias vitales?',
        explanation: 'La línea unificada 123 coordina ambulancias, bomberos y policía de forma simultánea.',
        successMsg: '¡Correcto! El 123 salva vidas.'
      }
    ]
  }
}

export const EXAM_QUESTIONS = [
  // Esta lista se usa solo como referencia, el backend genera el examen real de 30 preguntas.
]
