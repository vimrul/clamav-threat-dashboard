from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from schemas import ScanReportCreate, ScanReport
from crud import create_scan_report, get_all_reports, get_report_by_id
from fastapi.middleware.cors import CORSMiddleware

# ✅ Step 1: Initialize FastAPI app first
app = FastAPI()

# ✅ Step 2: Then add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Step 3: Create database tables
Base.metadata.create_all(bind=engine)

# ✅ Routes
@app.post("/report", response_model=ScanReport)
def submit_report(report: ScanReportCreate, db: Session = Depends(get_db)):
    return create_scan_report(db, report)

@app.get("/reports", response_model=list[ScanReport])
def list_reports(db: Session = Depends(get_db)):
    return get_all_reports(db)

@app.get("/report/{report_id}", response_model=ScanReport)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
