from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
from datetime import datetime

class ScanReport(Base):
    __tablename__ = "scan_reports"

    id = Column(Integer, primary_key=True, index=True)
    vm_name = Column(String(100), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    report = Column(Text)
