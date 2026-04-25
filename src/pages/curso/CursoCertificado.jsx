import CourseLayout from '../../layouts/CourseLayout'
import { jsPDF } from 'jspdf'

// Generate a verification code based on user data
function genVerificationCode(cedula, date) {
  const base = (cedula || '0000') + date.replace(/-/g, '')
  let hash = 0
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) >>> 0
  }
  return `MOV-${hash.toString(16).toUpperCase().slice(0, 4)}-${((hash >> 4) & 0xFFFF).toString(16).toUpperCase().slice(0, 4)}`
}

export default function CursoCertificado() {
  const navigate = useNavigate()
  const { examResult, certificateUnlocked } = useCourse()
  const { user } = useAuth()
  const certRef = useRef(null)

  const today = new Date().toISOString().split('T')[0]
  const issueDate = examResult?.submittedAt
    ? new Date(examResult.submittedAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })

  const verificationCode = genVerificationCode(user?.cedula || '000000000', today)
  const comparendoNum = user?.comparendo || 'CNT-2025-000847'
  const fullName = user?.nombre || 'Ciudadano Inscrito'
  const cedula = user?.cedula || '000.000.000'

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // --- PÁGINA 1: CERTIFICADO ---
    // Fondo y Bordes
    doc.setFillColor(10, 13, 20); // Gris 900
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(201, 150, 60); // Dorado
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 277, 190);

    // Texto Encabezado
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.text('CERTIFICADO DE APROBACIÓN', 148.5, 50, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(201, 150, 60);
    doc.text('CURSO PEDAGÓGICO DE SEGURIDAD VIAL VIRTUAL', 148.5, 60, { align: 'center' });

    // Cuerpo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('Se certifica que el ciudadano:', 148.5, 85, { align: 'center' });
    
    doc.setFontSize(24);
    doc.text(fullName.toUpperCase(), 148.5, 100, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Identificado con C.C. N° ${cedula}`, 148.5, 110, { align: 'center' });

    doc.setFontSize(11);
    const bodyText = 'Ha completado satisfactoriamente los 5 módulos educativos de la Ley 769 de 2002 y aprobado el examen de conocimiento vial con soporte de Inteligencia Artificial.';
    doc.text(doc.splitTextToSize(bodyText, 200), 148.5, 125, { align: 'center' });

    // Detalles
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Fecha: ${issueDate}`, 50, 160);
    doc.text(`Comparendo: ${comparendoNum}`, 50, 168);
    doc.text(`Código Verificación: ${verificationCode}`, 247, 160, { align: 'right' });

    // --- PÁGINA 2: VOUCHER DE DESCUENTO ---
    doc.addPage();
    doc.setFillColor(22, 163, 74); // Verde 600
    doc.rect(0, 0, 297, 210, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.text('VOUCHER DE AHORRO 50%', 148.5, 60, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text('ESTE DOCUMENTO ES VÁLIDO PARA DESCUENTO EN SIMIT', 148.5, 75, { align: 'center' });

    doc.setFontSize(14);
    doc.text(`Beneficiario: ${fullName}`, 50, 110);
    doc.text(`Comparendo N°: ${comparendoNum}`, 50, 120);
    doc.text(`Fecha de Expiración: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}`, 50, 130);

    doc.setFontSize(12);
    doc.text('__________________________', 220, 160, { align: 'center' });
    doc.text('Sello de Autorización Virtual', 220, 165, { align: 'center' });

    doc.save(`Certificado_${cedula}.pdf`);
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      alert('¡Enlace copiado al portapapeles!')
    } catch {
      prompt('Copia este enlace:', url)
    }
  }

  if (!certificateUnlocked) {
    return (
      <CourseLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <div className="w-24 h-24 rounded-[2rem] bg-dorado-400/10 border-2 border-dorado-400/20 flex items-center justify-center mb-6">
            <Award size={40} className="text-dorado-400/40" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white mb-3">Certificado no disponible</h2>
          <p className="text-white/50 mb-8 max-w-md">
            Debes completar todos los módulos y aprobar el examen final (mínimo 70%) para obtener tu certificado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/curso')} className="btn-primary px-8 py-4">
              <Home size={18} /> Ir al portal del curso
            </button>
            <button onClick={() => navigate('/curso/examen')} className="btn-outline px-8 py-4">
              <RotateCcw size={18} /> Ir al examen
            </button>
          </div>
        </div>
      </CourseLayout>
    )
  }

  return (
    <CourseLayout>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-card, #certificate-card * { visibility: visible; }
          #certificate-card { position: fixed; inset: 0; width: 100vw; height: 100vh; border-radius: 0 !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 no-print"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dorado-400/10 border border-dorado-400/20 text-dorado-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Award size={12} /> Certificado oficial
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white mb-2">¡Felicitaciones! 🎉</h1>
          <p className="text-white/50">Tu certificado ha sido generado. Descárgalo o compártelo.</p>
        </motion.div>

        {/* Certificate Card */}
        <motion.div
          id="certificate-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          ref={certRef}
          className="relative bg-gris-900 rounded-[3rem] overflow-hidden shadow-2xl border border-dorado-400/20 mb-8"
          style={{ minHeight: 480 }}
        >
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-dorado-400 via-dorado-300 to-dorado-500" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-verde-500 to-verde-400" />
            <div className="absolute top-20 -right-20 w-80 h-80 bg-dorado-400/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 -left-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
            {/* Watermark grid */}
            <div className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
              }}
            />
          </div>

          <div className="relative z-10 p-10 md:p-14">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
              {/* Institutional */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/8 border border-white/15 flex items-center justify-center">
                  <Shield size={28} className="text-dorado-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white/30 uppercase tracking-widest">República de Colombia</div>
                  <div className="text-sm font-bold text-white/80">Secretaría de Movilidad</div>
                  <div className="text-xs text-white/40">Santiago de Cali · Valle del Cauca</div>
                </div>
              </div>

              {/* Verified badge */}
              <div className="flex items-center gap-2 bg-verde-500/15 border border-verde-500/30 rounded-full px-5 py-2.5">
                <CheckCircle size={16} className="text-verde-400" />
                <span className="text-verde-400 text-sm font-bold">Certificado Verificado</span>
              </div>
            </div>

            {/* Main content */}
            <div className="text-center mb-10">
              <p className="text-white/40 text-sm font-semibold uppercase tracking-[0.25em] mb-3">
                Constancia de Aprobación
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight mb-2">
                Curso Pedagógico
              </h2>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-dorado-400">
                de Seguridad Vial
              </h3>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-dorado-400/30" />
              <Award size={20} className="text-dorado-400" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-dorado-400/30" />
            </div>

            {/* Recipient section */}
            <div className="text-center mb-10">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Se certifica que</p>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-1">{fullName}</h3>
              <p className="text-white/50 text-sm mb-4">Cédula de ciudadanía N° <strong className="text-white/80">{cedula}</strong></p>
              <p className="text-white/60 text-base leading-relaxed max-w-2xl mx-auto">
                ha completado satisfactoriamente el <strong className="text-white">Curso Pedagógico de Educación en Seguridad Vial</strong>, en modalidad virtual con asistencia de Inteligencia Artificial, cumpliendo todos los requisitos establecidos por la normativa de tránsito colombiana.
              </p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Fecha de emisión', value: issueDate },
                { label: 'N° Comparendo', value: comparendoNum },
                { label: 'Puntaje obtenido', value: `${examResult?.score || 100}%` },
                { label: 'Código verificación', value: verificationCode },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-center">
                  <div className="text-xs text-white/30 uppercase tracking-wider mb-1">{item.label}</div>
                  <div className={`font-bold text-sm ${i === 3 ? 'text-dorado-400 font-mono text-xs' : 'text-white'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/8 pt-8">
              <div className="text-center sm:text-left">
                <div className="w-40 h-px bg-white/30 mx-auto sm:mx-0 mb-2" />
                <div className="text-white text-sm font-bold">Director(a) de Movilidad</div>
                <div className="text-white/40 text-xs">Secretaría de Movilidad de Cali</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-dorado-400/20 border border-dorado-400/30 flex items-center justify-center mx-auto mb-2">
                  <Shield size={24} className="text-dorado-400" />
                </div>
                <div className="text-dorado-400/60 text-[10px] font-bold uppercase tracking-widest">Sello Oficial</div>
              </div>
              <div className="text-center sm:text-right">
                <div className="w-40 h-px bg-white/30 mx-auto sm:ml-auto mb-2" />
                <div className="text-white text-sm font-bold">Sistema IA-Course</div>
                <div className="text-white/40 text-xs">Plataforma Virtual Oficial</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
          <button
            onClick={handleDownload}
            className="btn-primary px-10 py-4 text-base"
          >
            <Download size={20} /> Descargar PDF
          </button>
          <button
            onClick={handleShare}
            className="btn-outline px-10 py-4 text-base"
          >
            <Share2 size={20} /> Compartir certificado
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-white/50 hover:text-white font-semibold transition-colors text-base"
          >
            <Home size={20} /> Volver al inicio
          </button>
        </div>

        {/* Verification note */}
        <p className="text-center text-white/20 text-xs mt-6 no-print">
          Código de verificación: <span className="font-mono text-dorado-400/60">{verificationCode}</span> · 
          Válido ante todos los organismos de tránsito de Colombia
        </p>
      </div>
    </CourseLayout>
  )
}
