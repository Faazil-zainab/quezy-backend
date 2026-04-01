from __future__ import annotations

from typing import Dict, List

CLINIC_ID_BY_NAME = {
    "Apollo Clinic - Adyar": 1,
    "Apollo Clinic - Velachery": 2,
    "Fortis Medical Center - T Nagar": 3,
    "Kauvery Hospital - Alwarpet": 4,
    "MIOT International - Manapakkam": 5,
    "Global Hospitals - Perumbakkam": 6,
    "SIMS Hospital - Vadapalani": 7,
    "Vijaya Hospital - Vadapalani": 8,
    "Prashanth Hospital - Velachery": 9,
    "Dr. Kamakshi Hospital - Pallikaranai": 10,
    "SRM Hospital - Potheri": 11,
    "Rela Institute - Chromepet": 12,
}

SPECIALIZATION_AVG_TIMES = {
    "General Physician": 8,
    "Dermatologist": 10,
    "Orthopedic": 12,
    "Cardiologist": 14,
    "Pediatrician": 9,
    "Gynecologist": 12,
    "Ophthalmologist": 11,
    "ENT Specialist": 10,
    "Dentist": 11,
    "Psychiatrist": 15,
    "Nephrologist": 13,
    "Endocrinologist": 12,
}

CLINIC_DOCTOR_DIRECTORY: Dict[str, List[Dict[str, str]]] = {
    "Apollo Clinic - Adyar": [
        {"name": "Dr. Arjun Kumar", "specialization": "General Physician"},
        {"name": "Dr. Meera Sharma", "specialization": "General Physician"},
        {"name": "Dr. Rohan Patel", "specialization": "Dermatologist"},
        {"name": "Dr. Vikram Singh", "specialization": "Orthopedic"},
        {"name": "Dr. Ravi Nair", "specialization": "Cardiologist"},
        {"name": "Dr. Priya Nair", "specialization": "Pediatrician"},
        {"name": "Dr. Kavita Joshi", "specialization": "Gynecologist"},
        {"name": "Dr. Sandeep Iyer", "specialization": "Ophthalmologist"},
        {"name": "Dr. Arvind Rao", "specialization": "ENT Specialist"},
        {"name": "Dr. Sameer Khan", "specialization": "Dentist"},
        {"name": "Dr. Manish Tiwari", "specialization": "Psychiatrist"},
        {"name": "Dr. Deepak Kulkarni", "specialization": "Nephrologist"},
        {"name": "Dr. Rohit Sethi", "specialization": "Endocrinologist"},
    ],
    "Apollo Clinic - Velachery": [
        {"name": "Dr. Suresh Babu", "specialization": "General Physician"},
        {"name": "Dr. Sneha Reddy", "specialization": "Dermatologist"},
        {"name": "Dr. Nandini Krishnan", "specialization": "Dermatologist"},
        {"name": "Dr. Rajesh Kumar", "specialization": "Orthopedic"},
        {"name": "Dr. Ajay Verma", "specialization": "Cardiologist"},
        {"name": "Dr. Ankit Das", "specialization": "Pediatrician"},
        {"name": "Dr. Pooja Malhotra", "specialization": "Gynecologist"},
        {"name": "Dr. Nisha Bansal", "specialization": "Ophthalmologist"},
        {"name": "Dr. Ritu Agarwal", "specialization": "ENT Specialist"},
        {"name": "Dr. Alka Gupta", "specialization": "Dentist"},
        {"name": "Dr. Shalini Desai", "specialization": "Psychiatrist"},
        {"name": "Dr. Anjali Menon", "specialization": "Nephrologist"},
        {"name": "Dr. Pankaj Arora", "specialization": "Endocrinologist"},
    ],
    "Fortis Medical Center - T Nagar": [
        {"name": "Dr. Ramesh Babu", "specialization": "General Physician"},
        {"name": "Dr. Divya Suresh", "specialization": "Dermatologist"},
        {"name": "Dr. Sandeep Rao", "specialization": "Orthopedic"},
        {"name": "Dr. Neha Kapoor", "specialization": "Cardiologist"},
        {"name": "Dr. Meenakshi Rajan", "specialization": "Pediatrician"},
        {"name": "Dr. Lakshmi Narayan", "specialization": "Gynecologist"},
        {"name": "Dr. Kiran Reddy", "specialization": "Ophthalmologist"},
        {"name": "Dr. Sunil Mathur", "specialization": "ENT Specialist"},
        {"name": "Dr. Preethi Sharma", "specialization": "Dentist"},
        {"name": "Dr. Vikram Menon", "specialization": "Psychiatrist"},
        {"name": "Dr. Srinivasan Kumar", "specialization": "Nephrologist"},
        {"name": "Dr. Uma Shankar", "specialization": "Endocrinologist"},
    ],
    "Kauvery Hospital - Alwarpet": [
        {"name": "Dr. Balaji Suresh", "specialization": "General Physician"},
        {"name": "Dr. Ananya Sharma", "specialization": "Dermatologist"},
        {"name": "Dr. Rajan Pillai", "specialization": "Orthopedic"},
        {"name": "Dr. Jayaram Pillai", "specialization": "Cardiologist"},
        {"name": "Dr. Radha Krishnan", "specialization": "Pediatrician"},
        {"name": "Dr. Priya Menon", "specialization": "Gynecologist"},
        {"name": "Dr. Roshini Nair", "specialization": "Ophthalmologist"},
        {"name": "Dr. Suresh Menon", "specialization": "ENT Specialist"},
        {"name": "Dr. Kritika Verma", "specialization": "Dentist"},
        {"name": "Dr. Asha Pillai", "specialization": "Psychiatrist"},
        {"name": "Dr. Gokul Raj", "specialization": "Nephrologist"},
        {"name": "Dr. Nirmala Devi", "specialization": "Endocrinologist"},
    ],
    "MIOT International - Manapakkam": [
        {"name": "Dr. Muthu Krishnan", "specialization": "General Physician"},
        {"name": "Dr. Kavitha Rajan", "specialization": "Dermatologist"},
        {"name": "Dr. Rahul Mehta", "specialization": "Orthopedic"},
        {"name": "Dr. Suresh Pillai", "specialization": "Cardiologist"},
        {"name": "Dr. Baby Vasantha", "specialization": "Pediatrician"},
        {"name": "Dr. Sumitha Ravi", "specialization": "Gynecologist"},
        {"name": "Dr. Praveen Kumar", "specialization": "Ophthalmologist"},
        {"name": "Dr. Arvind Rao", "specialization": "ENT Specialist"},
        {"name": "Dr. Gomathi Priya", "specialization": "Dentist"},
        {"name": "Dr. Kannan Suresh", "specialization": "Psychiatrist"},
        {"name": "Dr. Sowmya Rajan", "specialization": "Nephrologist"},
        {"name": "Dr. Natarajan Iyer", "specialization": "Endocrinologist"},
    ],
    "Global Hospitals - Perumbakkam": [
        {"name": "Dr. Naresh Verma", "specialization": "General Physician"},
        {"name": "Dr. Priya Sharma", "specialization": "Dermatologist"},
        {"name": "Dr. Vinod Nair", "specialization": "Orthopedic"},
        {"name": "Dr. Rajan Kumar", "specialization": "Cardiologist"},
        {"name": "Dr. Vasudev Kumar", "specialization": "Pediatrician"},
        {"name": "Dr. Usha Krishnan", "specialization": "Gynecologist"},
        {"name": "Dr. Sathish Kumar", "specialization": "Ophthalmologist"},
        {"name": "Dr. Ramya Suresh", "specialization": "ENT Specialist"},
        {"name": "Dr. Lakshman Rao", "specialization": "Dentist"},
        {"name": "Dr. Nina Sharma", "specialization": "Psychiatrist"},
        {"name": "Dr. Anjali Menon", "specialization": "Nephrologist"},
        {"name": "Dr. Kiran Menon", "specialization": "Endocrinologist"},
    ],
    "SIMS Hospital - Vadapalani": [
        {"name": "Dr. Ganesh Babu", "specialization": "General Physician"},
        {"name": "Dr. Ranjita Kumar", "specialization": "Dermatologist"},
        {"name": "Dr. Vivek Sharma", "specialization": "Orthopedic"},
        {"name": "Dr. Ramesh Rao", "specialization": "Cardiologist"},
        {"name": "Dr. Jayanthi Rajan", "specialization": "Pediatrician"},
        {"name": "Dr. Nithya Ravi", "specialization": "Gynecologist"},
        {"name": "Dr. Abinaya Nair", "specialization": "Ophthalmologist"},
        {"name": "Dr. Mohan Pillai", "specialization": "ENT Specialist"},
        {"name": "Dr. Sameer Khan", "specialization": "Dentist"},
        {"name": "Dr. Deepthi Verma", "specialization": "Psychiatrist"},
        {"name": "Dr. Suresh Raj", "specialization": "Nephrologist"},
        {"name": "Dr. Shyama Ravi", "specialization": "Endocrinologist"},
    ],
    "Vijaya Hospital - Vadapalani": [
        {"name": "Dr. Senthil Kumar", "specialization": "General Physician"},
        {"name": "Dr. Meghna Iyer", "specialization": "Dermatologist"},
        {"name": "Dr. Bala Subramaniam", "specialization": "Orthopedic"},
        {"name": "Dr. Harish Rajan", "specialization": "Cardiologist"},
        {"name": "Dr. Vijayalakshmi", "specialization": "Pediatrician"},
        {"name": "Dr. Sowmya Pillai", "specialization": "Gynecologist"},
        {"name": "Dr. Sandeep Iyer", "specialization": "Ophthalmologist"},
        {"name": "Dr. Ritu Agarwal", "specialization": "ENT Specialist"},
        {"name": "Dr. Alka Gupta", "specialization": "Dentist"},
        {"name": "Dr. Bharat Verma", "specialization": "Psychiatrist"},
        {"name": "Dr. Kala Raman", "specialization": "Nephrologist"},
        {"name": "Dr. Sudha Krishnan", "specialization": "Endocrinologist"},
    ],
    "Prashanth Hospital - Velachery": [
        {"name": "Dr. Prakash Menon", "specialization": "General Physician"},
        {"name": "Dr. Swati Nair", "specialization": "Dermatologist"},
        {"name": "Dr. Gopal Sharma", "specialization": "Orthopedic"},
        {"name": "Dr. Venkat Raman", "specialization": "Cardiologist"},
        {"name": "Dr. Ankit Das", "specialization": "Pediatrician"},
        {"name": "Dr. Kavita Joshi", "specialization": "Gynecologist"},
        {"name": "Dr. Radhika Kumar", "specialization": "Ophthalmologist"},
        {"name": "Dr. Sanjay Suresh", "specialization": "ENT Specialist"},
        {"name": "Dr. Namita Rao", "specialization": "Dentist"},
        {"name": "Dr. Manish Tiwari", "specialization": "Psychiatrist"},
        {"name": "Dr. Bhavana Sharma", "specialization": "Nephrologist"},
        {"name": "Dr. Gupta Krishnan", "specialization": "Endocrinologist"},
    ],
    "Dr. Kamakshi Hospital - Pallikaranai": [
        {"name": "Dr. Madura Pillai", "specialization": "General Physician"},
        {"name": "Dr. Thilaga Rajan", "specialization": "Dermatologist"},
        {"name": "Dr. Raja Gopal", "specialization": "Orthopedic"},
        {"name": "Dr. Vishwas Kumar", "specialization": "Cardiologist"},
        {"name": "Dr. Hema Subramaniam", "specialization": "Pediatrician"},
        {"name": "Dr. Anitha Rao", "specialization": "Gynecologist"},
        {"name": "Dr. Vijay Nair", "specialization": "Ophthalmologist"},
        {"name": "Dr. Lalitha Menon", "specialization": "ENT Specialist"},
        {"name": "Dr. Kamal Raju", "specialization": "Dentist"},
        {"name": "Dr. Shalini Desai", "specialization": "Psychiatrist"},
        {"name": "Dr. Rajeev Kumar", "specialization": "Nephrologist"},
        {"name": "Dr. Rohit Sethi", "specialization": "Endocrinologist"},
    ],
    "SRM Hospital - Potheri": [
        {"name": "Dr. Subramaniam Raj", "specialization": "General Physician"},
        {"name": "Dr. Pavithra Kumar", "specialization": "Dermatologist"},
        {"name": "Dr. Dinesh Babu", "specialization": "Orthopedic"},
        {"name": "Dr. Siva Subramanian", "specialization": "Cardiologist"},
        {"name": "Dr. Padmavathy Rajan", "specialization": "Pediatrician"},
        {"name": "Dr. Saranya Krishnan", "specialization": "Gynecologist"},
        {"name": "Dr. Mahesh Reddy", "specialization": "Ophthalmologist"},
        {"name": "Dr. Vignesh Raman", "specialization": "ENT Specialist"},
        {"name": "Dr. Sindhu Prakash", "specialization": "Dentist"},
        {"name": "Dr. Ramya Pillai", "specialization": "Psychiatrist"},
        {"name": "Dr. Arun Nair", "specialization": "Nephrologist"},
        {"name": "Dr. Suba Lakshmi", "specialization": "Endocrinologist"},
    ],
    "Rela Institute - Chromepet": [
        {"name": "Dr. Vasanth Kumar", "specialization": "General Physician"},
        {"name": "Dr. Nithya Suresh", "specialization": "Dermatologist"},
        {"name": "Dr. Madhan Kumar", "specialization": "Orthopedic"},
        {"name": "Dr. Venkatesan Raj", "specialization": "Cardiologist"},
        {"name": "Dr. Rekha Pillai", "specialization": "Pediatrician"},
        {"name": "Dr. Umarani Krishnan", "specialization": "Gynecologist"},
        {"name": "Dr. Bharathi Nair", "specialization": "Ophthalmologist"},
        {"name": "Dr. Ashok Menon", "specialization": "ENT Specialist"},
        {"name": "Dr. Priya Sundar", "specialization": "Dentist"},
        {"name": "Dr. Shanthi Verma", "specialization": "Psychiatrist"},
        {"name": "Dr. Sreekanth Rajan", "specialization": "Nephrologist"},
        {"name": "Dr. Meena Subramanian", "specialization": "Endocrinologist"},
    ],
}


def normalize_name(value: str) -> str:
    return " ".join(value.strip().lower().split())


DOCTOR_PROFILES: List[Dict[str, int | str]] = []
DOCTOR_LOOKUP_BY_NAME_AND_CLINIC: Dict[tuple[str, str], Dict[str, int | str]] = {}

_next_id = 101
for clinic_name, doctors in CLINIC_DOCTOR_DIRECTORY.items():
    clinic_id = CLINIC_ID_BY_NAME[clinic_name]
    for doctor in doctors:
        profile = {
            "doctor_id": _next_id,
            "doctor_name": doctor["name"],
            "clinic_id": clinic_id,
            "clinic_name": clinic_name,
            "specialization": doctor["specialization"],
            "avg_consultation_time": SPECIALIZATION_AVG_TIMES[doctor["specialization"]],
        }
        DOCTOR_PROFILES.append(profile)
        DOCTOR_LOOKUP_BY_NAME_AND_CLINIC[(normalize_name(doctor["name"]), clinic_name)] = profile
        _next_id += 1


def get_doctor_profile(doctor_name: str, clinic_name: str) -> Dict[str, int | str] | None:
    return DOCTOR_LOOKUP_BY_NAME_AND_CLINIC.get((normalize_name(doctor_name), clinic_name))
