import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Phone, Navigation, Globe, Send, Share2 } from 'lucide-react'

const sedes = [
  {
    id: 1,
    name: 'Sede Principal - Salomia',
    name: 'Unidad Administrativa - Salomia',
    address: 'Gestión Virtual 24/7',
    phone: '(602) 445 9000',
    schedule: 'Disponibilidad de Sistema: Continua',
    lat: 3.4831,
    lng: -76.5116,
    mapQuery: 'Secretaria+Mobildad+Cali+Salomia',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Centro Virtual Sur',
    address: 'Atención Digital Inmediata',
    phone: '(602) 886 0000 ext 102',
    schedule: 'Ventana de Gestión: 8:00 AM - 4:00 PM',
    lat: 3.3768,
    lng: -76.5332,
    mapQuery: 'Aventura+Plaza+Cali+Colombia',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Centro Virtual Norte',
    address: 'Soporte Transaccional Cloud',
    phone: '(602) 886 0000 ext 103',
    schedule: 'Disponibilidad: 7:00 AM - 3:00 PM',
    lat: 3.4912,
    lng: -76.5055,
    mapQuery: 'Sameco+Cali+Colombia',
    image: 'https://images.unsplash.com/photo-1416339442236-8ceb164046f8?q=80&w=2003&auto=format&fit=crop'
  }
]

export default function Sedes() {
  const [selectedSede, setSelectedSede] = useState(sedes[0])

  return (
    <section id="sedes" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gris-50 -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-verde-50 text-verde-600 border border-verde-200 text-xs font-black uppercase tracking-[0.2em] mb-6"
            >
               <MapPin size={14} /> Presencia Institucional
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-gris-900 tracking-tighter leading-none mb-6">
               Centros de <span className="text-verde-600">Gestión Virtual</span>
            </h2>
            <p className="text-xl text-gris-500 font-medium max-w-3xl mx-auto leading-relaxed">
               Nuestras unidades administrativas operan 100% en la nube para garantizar 
               tu proceso pedagógico sin filas, sin citas físicas y desde cualquier lugar.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Sede List */}
            <div className="lg:col-span-5 space-y-4">
               {sedes.map((sede) => (
                 <motion.button
                   key={sede.id}
                   whileHover={{ x: 10 }}
                   onClick={() => setSelectedSede(sede)}
                   className={`w-full text-left p-6 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden group ${
                     selectedSede.id === sede.id 
                       ? 'border-verde-500 bg-white shadow-2xl shadow-verde-500/10' 
                       : 'border-transparent bg-white/50 hover:bg-white hover:border-gris-200'
                   }`}
                 >
                   {selectedSede.id === sede.id && (
                      <motion.div 
                        layoutId="active-bg"
                        className="absolute inset-0 bg-verde-50 opacity-10"
                      />
                   )}
                   <div className="flex items-start gap-5 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                         selectedSede.id === sede.id ? 'bg-verde-500 text-white shadow-lg' : 'bg-gris-100 text-gris-400'
                      }`}>
                         <Navigation size={24} className={selectedSede.id === sede.id ? 'animate-pulse' : ''} />
                      </div>
                      <div className="flex-1">
                         <h3 className={`text-lg font-black tracking-tight mb-1 transition-colors ${
                            selectedSede.id === sede.id ? 'text-gris-900' : 'text-gris-600'
                         }`}>
                            {sede.name}
                         </h3>
                         <p className="text-sm text-gris-400 font-medium leading-tight">{sede.address}</p>
                         
                         <AnimatePresence>
                            {selectedSede.id === sede.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                 <div className="pt-4 grid grid-cols-1 gap-2 border-t border-gris-100 mt-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gris-500">
                                       <Clock size={14} className="text-verde-500" /> {sede.schedule}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gris-500">
                                       <Phone size={14} className="text-gris-400" /> {sede.phone}
                                    </div>
                                 </div>
                              </motion.div>
                            )}
                         </AnimatePresence>
                      </div>
                   </div>
                 </motion.button>
               ))}
            </div>

            {/* Brutal Map View */}
            <div className="lg:col-span-7 sticky top-32">
               <motion.div 
                 key={selectedSede.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="relative w-full aspect-[4/3] md:aspect-video rounded-[3.5rem] overflow-hidden shadow-4xl border-8 border-white group"
               >
                  {/* Google Maps Iframe Simulation / Embed */}
                  <iframe
                    title="Cali Map"
                    src={`https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_REAL_KEY&q=${encodeURIComponent(selectedSede.address + ' Cali Colombia')}&center=${selectedSede.lat},${selectedSede.lng}&zoom=16`}
                    className="w-full h-full border-0 grayscale-[0.2] contrast-[1.1]"
                    // Since I don't have a real key, I'll use a public search embed which works for basic viewing
                  />
                  {/* Real public embed fallback for demo */}
                  <div className="absolute inset-0 pointer-events-none border-[20px] border-white/10 rounded-[3.5rem] z-10" />
                  <iframe
                    title="Cali Map Public"
                    src={`https://maps.google.com/maps?q=${selectedSede.lat},${selectedSede.lng}&z=15&output=embed&iwloc=near`}
                    className="absolute inset-0 w-full h-full border-0 grayscale-[0.1] contrast-[1.05]"
                    allowFullScreen
                  />

                  {/* Floating Controls Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
                     <div className="bg-gris-900/90 backdrop-blur-xl text-white p-6 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-xs">
                        <p className="text-[10px] font-black uppercase tracking-widest text-verde-400 mb-2">Sede Seleccionada</p>
                        <h4 className="text-lg font-black leading-none mb-3">{selectedSede.name}</h4>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-2xl flex items-center justify-center transition-colors">
                               <Globe size={18} />
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-2xl flex items-center justify-center transition-colors">
                               <Share2 size={18} />
                            </button>
                             <button className="flex-[3] bg-verde-500 hover:bg-verde-600 text-white p-3 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase transition-all">
                                <Send size={14} /> Iniciar Trámite Virtual
                             </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
        </div>

      </div>
    </section>
  )
}
