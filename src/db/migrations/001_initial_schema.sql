CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    file_url TEXT,
    public_id TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE large_media (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    file_url TEXT,
    public_id TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);