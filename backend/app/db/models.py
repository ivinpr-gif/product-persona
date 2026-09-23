from datetime import datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class PersonaRecord(Base):
    __tablename__ = "personas"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    player_name: Mapped[str] = mapped_column(String(255), nullable=False)
    profile_json: Mapped[str] = mapped_column(Text, nullable=False)
    persona_json: Mapped[str] = mapped_column(Text, nullable=False)
    behavior_json: Mapped[str] = mapped_column(Text, nullable=False)
    psychology_json: Mapped[str] = mapped_column(Text, nullable=False)
    insights_json: Mapped[str] = mapped_column(Text, nullable=False)
    recommendations_json: Mapped[str] = mapped_column(Text, nullable=False)
    memory_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SurveyRunRecord(Base):
    __tablename__ = "survey_runs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    survey_title: Mapped[str] = mapped_column(String(255), nullable=False)
    product_domain: Mapped[str] = mapped_column(String(100), nullable=False)
    questions_json: Mapped[str] = mapped_column(Text, nullable=False)
    results_json: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

