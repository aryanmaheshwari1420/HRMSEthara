const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Get database URL from environment variable
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
    console.error('❌ Error: DATABASE_URL or POSTGRES_URL environment variable is not set');
    console.log('\nPlease set your database connection string:');
    console.log('export DATABASE_URL="your-connection-string"');
    process.exit(1);
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function setupDatabase() {
    try {
        console.log('🔌 Connecting to database...');
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'backend', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('📝 Executing database schema...');
        await pool.query(schema);
        
        console.log('✅ Database schema initialized successfully!');
        console.log('\nTables created:');
        console.log('  - employees');
        console.log('  - attendance');
        
        // Verify tables were created
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        console.log('\n📊 Existing tables in database:');
        tablesResult.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });
        
    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Tip: Make sure your database is accessible and the connection string is correct.');
        }
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();
