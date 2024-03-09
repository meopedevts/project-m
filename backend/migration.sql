SET TIMEZONE TO 'America/Sao_Paulo';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NULL,
    CONSTRAINT users_pk PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_token (
    jwt_token VARCHAR(512) NOT NULL,
    user_id UUID NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NULL,
    CONSTRAINT jwt_token_pk PRIMARY KEY (jwt_token),
    CONSTRAINT fk_id_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL,
    company VARCHAR(256) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT customers_pk PRIMARY KEY (customer_id)
);

CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL,
    title VARCHAR(256) NOT NULL,
    "description" VARCHAR(512),
    customer_id INT,
    dt_initial TIMESTAMP NULL,
    dt_final TIMESTAMP NULL,
    CONSTRAINT projects_pk PRIMARY KEY (project_id),
    CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
