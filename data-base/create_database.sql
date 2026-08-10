


DROP DATABASE IF EXISTS ecommerce_viajes;
CREATE DATABASE ecommerce_viajes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_viajes;

CREATE TABLE usuarios (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    apellido VARCHAR(80) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE destinos (
    destino_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    pais VARCHAR(80) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    descripcion TEXT
);


CREATE TABLE paquetes (
    paquete_id INT AUTO_INCREMENT PRIMARY KEY,
    destino_id INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion_dias INT NOT NULL,
    cupo_maximo INT NOT NULL,
    CONSTRAINT fk_paquetes_destino
        FOREIGN KEY (destino_id) REFERENCES destinos(destino_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE presupuestos (
    presupuesto_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    monto_maximo DECIMAL(10,2) NOT NULL,
    tipo_viajero ENUM('mochilero','pareja','familia','grupo') NOT NULL DEFAULT 'mochilero',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(150),
    CONSTRAINT fk_presupuestos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE reservas (
    reserva_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    paquete_id INT NOT NULL,
    presupuesto_id INT,
    fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
    num_personas INT NOT NULL DEFAULT 1,
    estado ENUM('pendiente','confirmada','cancelada','completada') NOT NULL DEFAULT 'pendiente',
    CONSTRAINT fk_reservas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reservas_paquete
        FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reservas_presupuesto
        FOREIGN KEY (presupuesto_id) REFERENCES presupuestos(presupuesto_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE pagos (
    pago_id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_pago ENUM('tarjeta_credito','tarjeta_debito','transferencia','paypal') NOT NULL,
    estado ENUM('pendiente','aprobado','rechazado') NOT NULL DEFAULT 'pendiente',
    CONSTRAINT fk_pagos_reserva
        FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE resenas (
    resena_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    paquete_id INT NOT NULL,
    calificacion TINYINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resenas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_resenas_paquete
        FOREIGN KEY (paquete_id) REFERENCES paquetes(paquete_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
