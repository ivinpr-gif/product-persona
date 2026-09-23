from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    connect_args={
        "check_same_thread": False,
        "timeout": 30.0,
    },
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    database_path = Path(settings.database_url.replace("sqlite:///", "", 1))
    database_path.parent.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)

    # Enable WAL mode for concurrent write safety and performance
    with engine.connect() as conn:
        try:
            conn.execute(text("PRAGMA journal_mode=WAL;"))
            result = conn.execute(text("PRAGMA table_info(personas)")).fetchall()
            columns = [row[1] for row in result]
            if "memory_json" not in columns:
                conn.execute(text("ALTER TABLE personas ADD COLUMN memory_json TEXT DEFAULT '[]'"))
                conn.commit()
        except Exception as exc:
            print(f"Auto-migration check notice: {exc}")

