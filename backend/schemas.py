from pydantic import BaseModel
from datetime import datetime

class ScanReportCreate(BaseModel):
    vm_name: str
    report: str

class ScanReport(BaseModel):
    id: int
    vm_name: str
    timestamp: datetime
    report: str

    class Config:
        orm_mode = True
