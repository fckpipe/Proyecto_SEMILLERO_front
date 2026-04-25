import { BookOpen, Clock, Award, Users, MonitorPlay, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Actualización Normativa',
    text: 'Aprende los últimos cambios en la Ley 1503 de 2011 y las regulaciones locales específicas para la ciudad de Cali.',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    icon: Clock,
    title: 'Intensidad Flexible',
    text: 'El curso estructurado de 6 horas virtuales te permite una inmersión total sin salir de casa y a tu propio ritmo.',
    color: 'from-verde-500 to-emerald-400'
  },
  {
    icon: Award,
    title: 'Aval Oficial',
    text: 'Certificación instantánea con firma digital válida y reportada en tiempo real al RUNT y SIMIT.',
    color: 'from-dorado-400 to-yellow-300'
  },
  {
    icon: Users,
    title: 'Expertos Certificados',
    text: 'Metodología virtual impartida por profesionales avalados por el Ministerio de Transporte mediante nuestra IA.',
    color: 'from-purple-500 to-pink-400'
  },
]

export default function CourseInfo() {
  return (
    <section id="curso" className="py-24 bg-[#f8fafc] relative overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-verde-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-dorado-200/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera y Banner principal (Split Grid) */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 text-verde-600 font-semibold text-sm tracking-widest uppercase mb-4 bg-verde-100 px-4 py-1.5 rounded-full">
              <BookOpen size={16} /> Sobre el Programa
            </span>
            <h2 className="section-title text-4xl lg:text-5xl">
              Fomentando una {' '}
              <span className="text-transparent bg-clip-text bg-cali-gradient">cultura vial responsable</span>
            </h2>
            <p className="mt-6 text-lg text-gris-600 leading-relaxed font-sans">
              El Curso Pedagógico de Seguridad Vial es ahora **100% Virtual**, 
              ofreciendo un espacio de <strong>profunda reflexión</strong> digital. 
              Diseñado meticulosamente para que puedas cumplir tu obligación legal 
              desde cualquier lugar de Colombia.
            </p>
            
            <ul className="mt-8 space-y-4">
              {[
                'Metodología 100% Virtual e Interactiva',
                'Casos de estudio reales procesados por IA',
                'Descuentos legales aplicables según ley'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-sans text-gris-700">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-verde-100 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-verde-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative bg-gris-900 border-4 border-white">
              {/* Video Placeholder / Stock Video */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/v9I9GZ0N-fE?autoplay=1&mute=1&controls=0&loop=1&playlist=v9I9GZ0N-fE"
                title="Educación Vial Cali"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-gris-900/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white pointer-events-none">
                <div className="inline-flex items-center gap-2 bg-verde-500/90 backdrop-blur-md rounded-lg px-3 py-1 text-sm font-bold mb-3 border border-white/20">
                  <MonitorPlay size={16} /> 100% Virtual
                </div>
                <h3 className="text-2xl font-display font-bold">Módulos Multimedia con IA</h3>
              </div>
            </div>
            
            {/* Decostyle block */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-cali-gradient rounded-[2rem] -z-10 blur-xl opacity-50" />
            <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-dorado-400 rounded-full -z-10 blur-xl opacity-60" />
          </div>
        </div>

        {/* Feature Grid Premium */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, text, color }, i) => (
            <div
              key={title}
              className="card-glass card-hover p-8 relative overflow-hidden group bg-white"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gris-50 border border-gris-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Icon size={26} className="text-gris-800" />
                </div>
                <h3 className="text-xl font-display font-bold text-gris-900 mb-3">{title}</h3>
                <p className="text-gris-600 text-sm leading-relaxed font-sans">{text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
