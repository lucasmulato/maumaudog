-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define ENUM types for better data integrity
CREATE TYPE order_source AS ENUM ('LOCAL', 'IFOOD', '99FOOD');
CREATE TYPE order_status AS ENUM ('RECEIVED', 'PREPARING', 'COMPLETED', 'CANCELLED');
CREATE TYPE order_type AS ENUM ('DELIVERY', 'PICKUP');

-- Table for products (your menu)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source order_source NOT NULL,
    source_order_id VARCHAR(255) NOT NULL,
    status order_status NOT NULL DEFAULT 'RECEIVED',
    order_type order_type NOT NULL,
    
    total_price DECIMAL(10, 2) NOT NULL,
    subtotal_price DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    customer_name VARCHAR(255),
    delivery_address TEXT,
    payment_method VARCHAR(50),
    is_paid BOOLEAN NOT NULL DEFAULT false,

    -- The original JSON payload from the source. Great for debugging.
    raw_payload JSONB,

    created_at TIMESTAMPTZ NOT NULL, -- When the customer placed the order
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When our system received it
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure no duplicate orders are inserted from the same source
    UNIQUE(source, source_order_id)
);

-- Table for individual items within an order
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Can be NULL if product is deleted from menu
    
    name VARCHAR(255) NOT NULL, -- Stored to protect against future product name changes
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    notes TEXT, -- For customizations like "no onions"

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX ON orders (status);
CREATE INDEX ON orders (received_at);
CREATE INDEX ON order_items (order_id);

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update 'updated_at' on orders table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Trigger to update 'updated_at' on products table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();