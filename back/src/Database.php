<?php
declare(strict_types=1);
namespace App;

use RuntimeException;

require_once __DIR__ . '/config.php';

class Database
{
  private \PDO $pdo;
  private string $migrationSql = '';

  public function __construct()
  {
    $this->loadEnvironment();
    $this->loadMigrationSql();
    $this->pdo = $this->connect();
  }

  private function loadEnvironment(): void
  {
    load_dotenv(__DIR__ . '/../.env');
  }

  private function loadMigrationSql(): void
  {
    $migrationPath = __DIR__ . '/../sql/schema.sql';
    if (!file_exists($migrationPath)) {
      throw new RuntimeException("Migration file not found: $migrationPath");
    }
    $this->migrationSql = file_get_contents($migrationPath) ?: '';
  }
 
  private function connect(): \PDO
  {
    try {
      // return $this->createConnection();
      $host = getenv('DB_HOST') ?: '127.0.0.1';
      $port = getenv('DB_PORT') ?: '5432';
      $name = getenv('DB_NAME') ?: 'desis';
      $user = getenv('DB_USER') ?: 'postgres';
      $pass = getenv('DB_PASS') ?: '';
  
      $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $host, $port, $name);
      return new \PDO($dsn, $user, $pass, [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION]);
    } catch (\PDOException $e) {
      throw new RuntimeException('Database connection failed: ' . $e->getMessage());
    }
  }

  public function getConnection(): \PDO
  {
    return $this->pdo;
  }

  public function ensureSchema(): void
  {
    $this->ensureSchemaOn($this->pdo);
  }

  public function ensureSchemaOn(\PDO $pdo): void
  {
    if ($this->migrationSql === '') {
      return;
    }

    $pdo->exec($this->migrationSql);
  }

  public static function create(): self
  {
    return new self();
  }
}

function db_connect(): \PDO
{
  return Database::create()->getConnection();
}