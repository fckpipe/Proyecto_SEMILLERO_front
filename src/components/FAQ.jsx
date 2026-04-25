import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, MessageCircleQuestion, Search, Sparkles, ArrowUpRight } from 'lucide-react'

const faqs = [
  {
    category: 'Normativa',
    q: '¿Quiénes deben realizar el curso pedagógico?',
    a: 'Todo infractor sancionado en Cali que busque descuentos de ley. Nuestra plataforma virtual permite realizarlo al 100% de forma asíncrona y certificada.',
  },
  {
    category: 'Metodología',
    q: '¿Cómo es la dinámica del curso virtual?',
    a: 'El curso es 100% digital. Incluye módulos multimedia, validación de identidad interactiva y evaluaciones guiadas por nuestra IA. Puedes avanzar a tu propio ritmo.',
  },
  {
    category: 'Pagos',
    q: '¿Dónde y cómo se realiza el pago del curso?',
    a: 'El pago se realiza exclusivamente vía PSE en nuestro portal oficial al iniciar tu trámite. Es inmediato y seguro, sin necesidad de ir a bancos físicos.',
  },
  {
    category: 'Acceso',
    q: '¿Cuándo puedo iniciar mi capacitación?',
    a: 'Inmediatamente después de validar tu comparendo y realizar el pago digital. No hay horarios fijos, la plataforma está abierta los 365 días del año.',
  },
  {
    category: 'SIMIT / RUNT',
    q: '¿Cuándo se refleja mi asistencia en el sistema nacional?',
    a: 'Nuestro sistema se sincroniza con RUNT y SIMIT en tiempo real. Al aprobar el curso virtual, tu certificado se carga automáticamente sin intervención humana.',
  },
  {
    category: 'Requisitos',
    q: '¿Qué herramientas necesito para tomar el curso?',
    a: 'Solo necesitas un dispositivo con conexión a internet y una cámara web activa para la validación biométrica requerida por ley.',
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const [search, setSearch] = useState('')

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section id="faq" className="py-24 bg-gris-50 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-verde-500/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-20 items-start">
            
            {/* Left Content: Intro & Search */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 w-full lg:max-w-md">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-verde-600 mb-8 border border-gris-100">
                       <MessageCircleQuestion size={32} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-gris-900 leading-[1.1] mb-6 tracking-tighter">
                       Respuestas a tus <span className="text-verde-600">inquietudes.</span>
                    </h2>
                    <p className="text-lg text-gris-500 font-medium mb-10 leading-relaxed">
                       Todo lo que necesitas saber sobre el proceso de capacitación vial en un solo lugar.
                    </p>

                    <div className="relative group">
                       <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gris-300 group-focus-within:text-verde-600 transition-colors" size={20} />
                       <input 
                         type="text"
                         placeholder="Buscar por tema o pregunta..."
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                         className="w-full bg-white border-2 border-gris-100 rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-gris-900 focus:border-verde-500 transition-all outline-none shadow-sm"
                       />
                       <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-gris-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-gris-400">
                          {filteredFaqs.length} Resultados
                       </div>
                    </div>

                    <div className="mt-12 p-8 rounded-[2.5rem] bg-gris-900 text-white relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-verde-500/20 rounded-full blur-3xl" />
                       <div className="relative z-10">
                          <Sparkles className="text-verde-400 mb-4" size={24} />
                          <h4 className="text-xl font-black mb-2 tracking-tight">¿Aún tienes dudas?</h4>
                          <p className="text-sm text-white/60 mb-6 leading-relaxed">Nuestra IA está disponible 24/7 vía WhatsApp para ayudarte.</p>
                          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-verde-400 hover:text-white transition-colors group">
                             Ir al asistente bot <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </button>
                       </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Content: Accordion */}
            <div className="lg:col-span-8 flex-1 w-full space-y-4">
               <AnimatePresence mode="popLayout">
                  {filteredFaqs.map((faq, i) => (
                    <motion.div
                      key={faq.q}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                        openIndex === i 
                          ? 'border-verde-500 bg-white shadow-2xl shadow-verde-500/10' 
                          : 'border-white bg-white/50 hover:bg-white hover:border-gris-200 shadow-sm'
                      }`}
                    >
                       <button
                         onClick={() => setOpenIndex(openIndex === i ? null : i)}
                         className="w-full text-left p-8 flex items-center justify-between gap-6"
                       >
                          <div className="flex-1">
                             <span className={`text-[10px] font-black uppercase tracking-widest mb-2 block transition-colors ${
                               openIndex === i ? 'text-verde-600' : 'text-gris-400'
                             }`}>
                                {faq.category}
                             </span>
                             <h3 className={`text-xl font-black tracking-tight leading-tight transition-colors ${
                               openIndex === i ? 'text-gris-900' : 'text-gris-700'
                             }`}>
                                {faq.q}
                             </h3>
                          </div>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                             openIndex === i ? 'bg-verde-500 text-white shadow-lg rotate-180' : 'bg-gris-100 text-gris-400'
                          }`}>
                             {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                          </div>
                       </button>

                       <AnimatePresence>
                          {openIndex === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                               <div className="px-8 pb-8 pt-2">
                                  <div className="h-px w-full bg-gris-100 mb-6" />
                                  <p className="text-lg text-gris-500 font-medium leading-relaxed italic">
                                     "{faq.a}"
                                  </p>
                               </div>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </motion.div>
                  ))}
               </AnimatePresence>

               {filteredFaqs.length === 0 && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="py-20 text-center space-y-4"
                 >
                   <div className="w-20 h-20 bg-gris-100 rounded-full flex items-center justify-center text-gris-300 mx-auto">
                      <Search size={40} />
                   </div>
                   <h4 className="text-xl font-bold text-gris-900">No encontramos resultados</h4>
                   <p className="text-gris-500">Prueba con palabras como "Pagos", "Citas" o "Requisitos".</p>
                 </motion.div>
               )}
            </div>

        </div>

      </div>
    </section>
  )
}
