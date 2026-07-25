

USE ecommerce_viajes;


INSERT INTO usuarios (nombre, apellido, email, telefono) VALUES
('Natalia', 'Guzman', 'natalia.guzman@email.com', '3001112233'),
('Carlos', 'Ramirez', 'carlos.ramirez@email.com', '3012223344'),
('Maria', 'Torres', 'maria.torres@email.com', '3023334455'),
('Andres', 'Lopez', 'andres.lopez@email.com', '3034445566'),
('Valentina', 'Diaz', 'valentina.diaz@email.com', '3045556677');


INSERT INTO destinos (nombre, pais, ciudad, descripcion) VALUES
('Cartagena Colonial', 'Colombia', 'Cartagena', 'Ciudad amurallada con playas y arquitectura colonial'),
('Caño Cristales', 'Colombia', 'La Macarena, Meta', 'Conocido como el río de los siete colores, Caño Cristales es uno de los tesoros naturales más asombrosos de Colombia.'),
('Parque Tayrona', 'Colombia', 'Santa Marta', 'Playas de arena blanca enmarcadas por la selva tropical y la Sierra Nevada.'),
('Guatape', 'Colombia', 'Antioquia', 'Pueblo de casas coloridas con zócalos pintados a mano, junto al embalse de Guatapé.'),
('Valle de Cocora', 'Colombia', 'Salento, Quindío', 'Hogar de la palma de cera, árbol nacional de Colombia y la palmera más alta del mundo.');


INSERT INTO paquetes (destino_id, nombre, descripcion, precio, duracion_dias, cupo_maximo) VALUES
(1, 'Cartagena Todo Incluido', 'Hotel 5 estrellas, tours por la ciudad amurallada y traslados', 1200000.00, 4, 20),
(2, 'Caño Cristales Expedicion', 'Caminata guiada al rio de los cinco colores con transporte desde La Macarena', 1800000.00, 3, 12),
(3, 'Tayrona Naturaleza', 'Camping y hospedaje ecologico dentro del parque, incluye caminatas guiadas', 950000.00, 3, 25),
(4, 'Guatape Colorido', 'Tour por el pueblo, subida a la Piedra del Peñol y paseo en lancha por el embalse', 650000.00, 2, 30),
(5, 'Cocora Aventura', 'Caminata por el valle de palmas de cera y visita a fincas cafeteras de Salento', 780000.00, 2, 20);


INSERT INTO presupuestos (usuario_id, monto_maximo, tipo_viajero, descripcion) VALUES
(1, 1500000.00, 'familia', 'Presupuesto para viaje familiar'),
(2, 2000000.00, 'pareja', 'Presupuesto viaje romantico'),
(3, 1000000.00, 'mochilero', 'Presupuesto viaje de aventura'),
(4, 700000.00, 'grupo', 'Presupuesto plan corto con amigos'),
(5, 800000.00, 'mochilero', 'Presupuesto viaje cultural');


INSERT INTO reservas (usuario_id, paquete_id, presupuesto_id, num_personas, estado) VALUES
(1, 1, 1, 2, 'confirmada'),
(2, 2, 2, 1, 'pendiente'),
(3, 3, 3, 4, 'confirmada'),
(4, 4, 4, 2, 'completada'),
(5, 5, 5, 3, 'cancelada');


INSERT INTO pagos (reserva_id, monto, metodo_pago, estado) VALUES
(1, 2400000.00, 'tarjeta_credito', 'aprobado'),
(2, 1800000.00, 'transferencia', 'pendiente'),
(3, 3800000.00, 'tarjeta_debito', 'aprobado'),
(4, 1300000.00, 'paypal', 'aprobado'),
(5, 2340000.00, 'tarjeta_credito', 'rechazado');


INSERT INTO resenas (usuario_id, paquete_id, calificacion, comentario) VALUES
(1, 1, 5, 'Excelente atencion y hotel impecable'),
(2, 2, 4, 'El rio es espectacular, aunque el acceso es un poco largo'),
(3, 3, 5, 'La playa y la selva juntas son una experiencia unica'),
(4, 4, 5, 'El pueblo es hermoso y la vista desde la piedra vale la pena'),
(5, 5, 4, 'Caminata hermosa, aunque el clima cambia rapido en el valle');
