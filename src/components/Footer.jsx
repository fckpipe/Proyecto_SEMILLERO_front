import { MapPin, Phone, Mail, ExternalLink, ShieldCheck } from 'lucide-react'
import logo from '../logo_transito.png'

export default function Footer() {
  return (
    <footer className="bg-gris-900 relative mt-auto border-t border-verde-900/50">
      {/* Footer Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-cali-gradient w-full" />
      
      {/* Background Decos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-verde-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-dorado-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm mb-6 inline-block">
              <img
                src={logo}
                alt="Alcaldía de Santiago de Cali"
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gris-400 font-sans leading-relaxed mb-6">
              Plataforma tecnológica oficial desarrollada para optimizar la gestión de 
              cursos pedagógicos y trámites contravencionales en Santiago de Cali.
            </p>
            <div className="flex items-center gap-3 text-verde-400 font-sans text-sm font-semibold bg-verde-900/30 w-fit px-4 py-2 rounded-lg border border-verde-800">
              <ShieldCheck size={18} />
              Sitio seguro y oficial
            </div>
          </div>

          {/* Links 1 */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-display font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-dorado-400" />
              Navegación
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Página Inicial', href: '/#inicio' },
                { label: 'Plan de Estudios', href: '/#curso' },
                { label: 'Requisitos Legales', href: '/#requisitos' },
                { label: 'Directorio de Sedes', href: '/#sedes' },
                { label: 'Soporte y Preguntas', href: '/#faq' },
              ].map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-gris-400 hover:text-white font-sans text-sm transition-colors hover:pl-2 duration-300 block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div className="lg:col-span-3 lg:col-start-8">
            <h4 className="text-white font-display font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-verde-500" />
              Entidades Oficiales
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Portal Alcaldía de Cali', url: 'https://www.cali.gov.co' },
                { label: 'Secretaría de Movilidad', url: 'https://www.cali.gov.co/movilidad/' },
                { label: 'Consulta estado SIMIT', url: 'https://www.simit.org.co' },
                { label: 'Registro Nacional RUNT', url: 'https://www.runt.com.co/' },
              ].map(link => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" 
                     className="group flex items-center justify-between text-gris-400 hover:text-dorado-400 font-sans text-sm transition-colors pb-2 border-b border-gris-800 hover:border-dorado-400/30">
                    {link.label}
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="lg:col-span-2 lg:col-start-11">
            <h4 className="text-white font-display font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              Líneas de Atención
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-verde-500 transition-colors flex-shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <div className="text-gris-400 font-sans text-sm mt-0.5">
                  <strong className="text-white block mb-1">Centro Administrativo</strong>
                  Calle 20 Norte # 5AN-30, Cali
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-dorado-500 transition-colors flex-shrink-0">
                  <Phone size={18} className="text-white" />
                </div>
                <div className="text-gris-400 font-sans text-sm mt-0.5">
                  <strong className="text-white block mb-1">PBX Conmutador</strong>
                  (602) 886-0000
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gris-800 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gris-500 font-sans text-xs text-center md:text-left">
            © 2026 <strong>Alcaldía de Santiago de Cali</strong> — Secretaría de Movilidad.
            Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-sans text-gris-500">
            <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">Políticas de Privacidad</a>
            <span className="text-gris-700">|</span>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">Términos Legales</a>
            <span className="text-gris-700">|</span>
            <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">Habeas Data</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
