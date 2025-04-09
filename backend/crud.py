from sqlalchemy.orm import Session
from models import ScanReport
from schemas import ScanReportCreate

def create_scan_report(db: Session, report: ScanReportCreate):
    db_report = ScanReport(vm_name=report.vm_name, report=report.report)
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_all_reports(db: Session):
    return db.query(ScanReport).order_by(ScanReport.timestamp.desc()).all()

def get_report_by_id(db: Session, report_id: int):
    return db.query(ScanReport).filter(ScanReport.id == report_id).first()
