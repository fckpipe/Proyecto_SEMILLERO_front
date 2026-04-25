/**
 * Centralized mock data for Proyecto_Transito
 * Realistic Colombian data for testing UI/UX
 */

export const MOCK_BRANCHES = [
  { id: 1, name: 'Sede Salomia', address: 'Calle 52 # 1-52', phone: '(602) 4455000', schedule: 'Lun - Vie: 8:00 AM - 5:00 PM', status: 'active' },
  { id: 2, name: 'Sede Aventura Plaza', address: 'Carrera 100 # 15A-61', phone: '(602) 3311000', schedule: 'Lun - Sab: 9:00 AM - 6:00 PM', status: 'active' },
  { id: 3, name: 'Sede Sameco', address: 'Avenida 3N # 70-52', phone: '(602) 6602020', schedule: 'Lun - Vie: 7:30 AM - 4:30 PM', status: 'active' },
  { id: 4, name: 'Sede Valle del Lili', address: 'Carrera 98 # 18-49', phone: '(602) 4850000', schedule: 'Lun - Vie: 8:00 AM - 5:00 PM', status: 'active' },
  { id: 5, name: 'Sede Cosmocentro', address: 'Calle 5 # 50-103', phone: '(602) 5550000', schedule: 'Lun - Sab: 10:00 AM - 7:00 PM', status: 'inactive' },
];

export const MOCK_APPOINTMENTS = [
  { id: '1016789123', code: 'CAL-2025-00101', citizen: 'Juan David Montoya Pérez', idCard: '1.016.789.123', summons: 'CP-4455-88', date: '2025-03-20', time: '08:00 AM', branch: 'Sede Salomia', channel: 'Chatbot', status: 'Confirmada' },
  { id: '1144002345', code: 'CAL-2025-00102', citizen: 'María Alejandra Gómez Restrepo', idCard: '1.144.002.345', summons: 'CP-1234-56', date: '2025-03-20', time: '09:30 AM', branch: 'Sede Aventura Plaza', channel: 'Correo', status: 'Pendiente' },
  { id: '1067123999', code: 'CAL-2025-00103', citizen: 'Carlos Andrés Rodríguez', idCard: '1.067.123.999', summons: 'CP-9988-77', date: '2025-03-21', time: '11:00 AM', branch: 'Sede Sameco', channel: 'Chatbot', status: 'Confirmada' },
  { id: '31987654', code: 'CAL-2025-00104', citizen: 'Ana Lucía Ortiz Beltrán', idCard: '31.987.654', summons: 'CP-5566-44', date: '2025-03-21', time: '02:00 PM', branch: 'Sede Salomia', channel: 'Correo', status: 'Cancelada' },
  { id: '1151234567', code: 'CAL-2025-00105', citizen: 'Sebastián Caicedo López', idCard: '1.151.234.567', summons: 'CP-7744-11', date: '2025-03-22', time: '08:30 AM', branch: 'Sede Valle del Lili', channel: 'Chatbot', status: 'Completada' },
  { id: '1010111222', code: 'CAL-2025-00106', citizen: 'Valentina Martínez', idCard: '1.010.111.222', summons: 'CP-2233-44', date: '2025-03-22', time: '10:00 AM', branch: 'Sede Aventura Plaza', channel: 'Sistema', status: 'Confirmada' },
  { id: '94555888', code: 'CAL-2025-00107', citizen: 'Luis Felipe Escobar', idCard: '94.555.888', summons: 'CP-3322-11', date: '2025-03-23', time: '11:30 AM', branch: 'Sede Sameco', channel: 'Correo', status: 'No asistió' },
  { id: '1143888777', code: 'CAL-2025-00108', citizen: 'Isabella Córdoba', idCard: '1.143.888.777', summons: 'CP-8877-66', date: '2025-03-23', time: '03:00 PM', branch: 'Sede Salomia', channel: 'Chatbot', status: 'Pendiente' },
  { id: '1112333444', code: 'CAL-2025-00109', citizen: 'Jorge Enrique Ramírez', idCard: '1.112.333.444', summons: 'CP-4455-88', date: '2025-03-24', time: '08:00 AM', branch: 'Sede Salomia', channel: 'Chatbot', status: 'Confirmada' },
  { id: '1016555444', code: 'CAL-2025-00110', citizen: 'Sofía Elena Guerrero', idCard: '1.016.555.444', summons: 'CP-1122-33', date: '2025-03-24', time: '09:00 AM', branch: 'Sede Aventura Plaza', channel: 'Correo', status: 'Confirmada' },
  { id: '1144111222', code: 'CAL-2025-00111', citizen: 'Andrés Felipe Castro', idCard: '1.144.111.222', summons: 'CP-5544-33', date: '2025-03-25', time: '10:30 AM', branch: 'Sede Sameco', channel: 'Chatbot', status: 'Completada' },
  { id: '31555666', code: 'CAL-2025-00112', citizen: 'Carmen Cecilia Díaz', idCard: '31.555.666', summons: 'CP-6677-88', date: '2025-03-25', time: '01:00 PM', branch: 'Sede Valle del Lili', channel: 'Sistema', status: 'Confirmada' },
  { id: '94111222', code: 'CAL-2025-00113', citizen: 'Ricardo Alberto Silva', idCard: '94.111.222', summons: 'CP-9900-11', date: '2025-03-26', time: '08:15 AM', branch: 'Sede Salomia', channel: 'Correo', status: 'Confirmada' },
  { id: '1010222333', code: 'CAL-2025-00114', citizen: 'Natalia Andrea Vargas', idCard: '1.010.222.333', summons: 'CP-2244-66', date: '2025-03-26', time: '11:45 AM', branch: 'Sede Aventura Plaza', channel: 'Chatbot', status: 'Pendiente' },
  { id: '1151666777', code: 'CAL-2025-00115', citizen: 'Miguel Ángel Rojas', idCard: '1.151.666.777', summons: 'CP-7788-99', date: '2025-03-27', time: '09:00 AM', branch: 'Sede Sameco', channel: 'Sistema', status: 'Confirmada' },
  { id: '1067222333', code: 'CAL-2025-00116', citizen: 'Estefanía Marín', idCard: '1.067.222.333', summons: 'CP-1133-55', date: '2025-03-27', time: '02:30 PM', branch: 'Sede Valle del Lili', channel: 'Correo', status: 'Confirmada' },
  { id: '1143222111', code: 'CAL-2025-00117', citizen: 'Daniel Eduardo Pineda', idCard: '1.143.222.111', summons: 'CP-6688-00', date: '2025-03-28', time: '08:00 AM', branch: 'Sede Salomia', channel: 'Chatbot', status: 'Completada' },
  { id: '31333444', code: 'CAL-2025-00118', citizen: 'Lucía Fernanda Holguín', idCard: '31.333.444', summons: 'CP-4466-88', date: '2025-03-28', time: '10:00 AM', branch: 'Sede Aventura Plaza', channel: 'Correo', status: 'Cancelada' },
  { id: '94222333', code: 'CAL-2025-00119', citizen: 'Héctor Fabio Benítez', idCard: '94.222.333', summons: 'CP-3355-77', date: '2025-03-29', time: '11:00 AM', branch: 'Sede Sameco', channel: 'Sistema', status: 'Confirmada' },
  { id: '1112444555', code: 'CAL-2025-00120', citizen: 'Gloria Patricia Suárez', idCard: '1.112.444.555', summons: 'CP-5577-99', date: '2025-03-29', time: '03:15 PM', branch: 'Sede Valle del Lili', channel: 'Chatbot', status: 'Confirmada' },
];

export const MOCK_SCHEDULES = [
  { id: 1, branch: 'Sede Salomia', date: '2025-03-20', startTime: '08:00', endTime: '10:00', maxCapacity: 20, booked: 18, status: 'active' },
  { id: 2, branch: 'Sede Salomia', date: '2025-03-20', startTime: '10:30', endTime: '12:30', maxCapacity: 20, booked: 20, status: 'active' },
  { id: 3, branch: 'Sede Aventura Plaza', date: '2025-03-20', startTime: '09:00', endTime: '11:00', maxCapacity: 15, booked: 5, status: 'active' },
  { id: 4, branch: 'Sede Sameco', date: '2025-03-21', startTime: '08:00', endTime: '10:00', maxCapacity: 25, booked: 10, status: 'active' },
  { id: 5, branch: 'Sede Sameco', date: '2025-03-21', startTime: '10:30', endTime: '12:30', maxCapacity: 25, booked: 25, status: 'active' },
  { id: 6, branch: 'Sede Valle del Lili', date: '2025-03-21', startTime: '14:00', endTime: '16:00', maxCapacity: 20, booked: 4, status: 'active' },
  { id: 7, branch: 'Sede Salomia', date: '2025-03-22', startTime: '08:00', endTime: '10:00', maxCapacity: 20, booked: 2, status: 'inactive' },
];

export const MOCK_LOGS = [
  { id: 'ACT-001', timestamp: '2025-03-16 12:15:22', type: 'Cita agendada', channel: 'Chatbot', description: 'Nueva cita agendada para Juan David Montoya (CAL-2025-00101)', ref: 'CAL-2025-00101' },
  { id: 'ACT-002', timestamp: '2025-03-16 11:45:10', type: 'Cita cancelada', channel: 'Correo', description: 'Usuario Ana Lucía Ortiz solicitó cancelación vía email procesado.', ref: 'CAL-2025-00104' },
  { id: 'ACT-003', timestamp: '2025-03-16 11:00:00', type: 'Recordatorio enviado', channel: 'Sistema', description: 'Envío masivo de recordatorios para citas de mañana completado (142 envíos).', ref: 'SYS-BATCH-90' },
  { id: 'ACT-004', timestamp: '2025-03-16 10:30:15', type: 'Cita completada', channel: 'Sistema', description: 'Atención finalizada para Sebastián Caicedo en sede Valle del Lili.', ref: 'CAL-2025-00105' },
  { id: 'ACT-005', timestamp: '2025-03-16 09:12:44', type: 'Correo procesado', channel: 'Correo', description: 'Intención detectada: nueva_cita. Respuesta enviada con éxito.', ref: 'EML-8821' },
];

export const MOCK_EMAIL_LOGS = [
  { id: 'EML-8821', timestamp: '2025-03-16 09:12:44', sender: 'm.gomez@gmail.com', subject: 'Solicitud cita curso vial', intent: 'nueva_cita', result: 'Procesado', appointment: 'CAL-2025-00102', responseSent: true },
  { id: 'EML-8822', timestamp: '2025-03-16 10:05:12', sender: 'jorge.ramirez@outlook.com', subject: 'Consultar estado de mi cita', intent: 'consulta', result: 'Info Enviada', appointment: 'CAL-2025-00109', responseSent: true },
  { id: 'EML-8823', timestamp: '2025-03-16 11:45:10', sender: 'a.ortiz@email.com', subject: 'Cancelación urgente', intent: 'cancelacion', result: 'Cancelada', appointment: 'CAL-2025-00104', responseSent: true },
  { id: 'EML-8824', timestamp: '2025-03-16 12:30:00', sender: 'spam-bot@test.com', subject: 'Oferta exclusiva para hoy', intent: 'no_reconocido', result: 'Ignorado', appointment: '-', responseSent: false },
];
