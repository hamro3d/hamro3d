import mysql from 'mysql2/promise'

let _pool: mysql.Pool | null = null

export function useDb(): mysql.Pool {
  if (_pool) return _pool

  const config = useRuntimeConfig()

  _pool = mysql.createPool({
    host: config.dbHost as string,
    port: Number(config.dbPort),
    user: config.dbUser as string,
    password: config.dbPassword as string,
    database: config.dbName as string,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

  return _pool
}
