from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import auth
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Premium Student Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # يسمح لـ Next.js بالاتصال
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTH ROUTES ---
@app.post("/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pwd = auth.get_password_hash(user.password)
    new_user = models.User(name=user.name, email=user.email, password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me")
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}

# --- STUDENTS ROUTES ---
@app.get("/students", response_model=List[schemas.Student])
def get_students(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Student).all()

@app.post("/students", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_student = models.Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

@app.put("/students/{student_id}", response_model=schemas.Student)
def update_student(student_id: int, student: schemas.StudentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return {"detail": "Student deleted"}

# --- TASKS ROUTES ---
@app.get("/tasks", response_model=List[schemas.Task])
def get_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Task).all()

@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_task = models.Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.dict().items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted"}

# --- SUBJECTS ROUTES ---
@app.get("/subjects", response_model=List[schemas.Subject])
def get_subjects(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Subject).all()

@app.post("/subjects", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_subject = models.Subject(**subject.dict())
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject

@app.put("/subjects/{subject_id}", response_model=schemas.Subject)
def update_subject(subject_id: int, subject: schemas.SubjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    for key, value in subject.dict().items():
        setattr(db_subject, key, value)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(db_subject)
    db.commit()
    return {"detail": "Subject deleted"}
