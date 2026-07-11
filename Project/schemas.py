from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TaskBase(BaseModel):
    title: str
    description: str
    status: str = "Pending"
    student_id: int

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    class Config:
        orm_mode = True

class StudentBase(BaseModel):
    name: str
    email: EmailStr
    age: int
    class_name: str
    phone: str

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    tasks: List[Task] = []
    class Config:
        orm_mode = True

class SubjectBase(BaseModel):
    name: str
    teacher: str
    hours: int
    description: str

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    class Config:
        orm_mode = True
