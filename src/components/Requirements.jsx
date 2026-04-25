import { CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react'

const requirements = [
  {
    title: 'Identificación Oficial',
    desc: 'Documento original (CC, CE, Pasaporte) en estado de vigencia.',
  },
  {
    title: 'Licencia de Conducción',
    desc: 'Documento físico original, sin importar si está vencido o suspendido.',
  },
  {
    title: 'Copia del Comparendo',
    desc: 'Recibo físico o pantallazo del sistema SIMIT notificando la infracción.',
  },
  {
    title: 'Ticket de Pago (Derechos de Curso)',
    desc: 'Comprobante bancario sellado o comprobante PSE digital.',
  },
  {
    title: 'Inscripción Previa',
    desc: 'Agendamiento generado a través de este portal, impreso o digital.',
  }
]

export default function Requirements() {
  return (
    <section id="requisitos" className="py-24 relative bg-white">
      {/* Top Divider */}
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-gris-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
          <h2 className="section-title text-4xl lg:text-5xl border-b-4 border-dorado-400 inline-block pb-2 mb-6">
            Documentación Requerida
          </h2>
          <p className="text-xl text-gris-600 font-sans font-light">
            Recuerda que para el ingreso a nuestra **Aula Virtual con IA** y toma del curso es 
            <strong> estrictamente necesario y obligatorio</strong> contar con los siguientes soportes digitales.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Timeline / List */}
          <div className="lg:col-span-7 space-y-6">
            {requirements.map((req, i) => (
              <div 
                key={i} 
                className="group flex gap-6 p-6 rounded-2xl border border-gris-100 bg-white hover:bg-gris-50 transition-all duration-300 hover:shadow-lg hover:border-verde-100 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-verde-50 to-verde-100 flex items-center justify-center border border-verde-200 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <span className="text-2xl font-display font-bold text-verde-600">0{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-gris-900 mb-2 flex items-center gap-2">
                    {req.title}
                    <CheckCircle2 size={18} className="text-verde-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-gris-600 font-sans leading-relaxed">
                    {req.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Guidelines Card */}
          <div className="lg:col-span-5 animate-slide-in-right">
            <div className="bg-gris-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
              {/* Deco bg */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-dorado-400/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-verde-500/20 rounded-full blur-[80px]" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-dorado-400/20 backdrop-blur-md rounded-2xl border border-dorado-400/30 flex items-center justify-center mb-8">
                  <AlertCircle size={32} className="text-dorado-400" />
                </div>
                
                <h3 className="text-3xl font-display font-bold mb-6">Lineamientos de Ingreso</h3>
                
                <ul className="space-y-5 mb-10">
                  {[
                    'Dispositivo con cámara web activa para validación biométrica por IA.',
                    'Conexión a internet estable (mínimo 5 Mbps) para reproducción multimedia.',
                    'Entorno con iluminación adecuada para el reconocimiento facial de seguridad.',
                    'El curso es 100% Virtual y Asíncrono. Puedes realizarlo a tu ritmo 24/7.'
                  ].map((rule, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-dorado-400" />
                      <span className="text-white/80 font-sans leading-relaxed text-sm">
                        {rule}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className="w-full btn-secondary text-base py-4">
                  <Download size={20} />
                  Descargar Checklist en PDF
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
