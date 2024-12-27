import streamlit as st
import requests
import pandas as pd
from pyjiit import Webportal
from pyjiit.default import CAPTCHA
import random
import time
from pyjiit.wrapper import Webportal

# Set page configuration
st.set_page_config(layout="wide")

# Function to log in and get attendance details
def fetch_attendance(userid, passwd):
    try:
        w = Webportal()
        s = w.student_login(userid, passwd, CAPTCHA)
        if not s:
            raise Exception("Login failed due to CAPTCHA or incorrect credentials.")
        
        meta = w.get_attendance_meta()
        if not meta:
            raise Exception("Failed to fetch attendance metadata.")
        header = meta.latest_header()
        sem = meta.latest_semester()
        attendance_data = w.get_attendance(header, sem)
        
        if 'studentattendancelist' not in attendance_data:
            raise Exception("Attendance data format incorrect or unavailable.")
        
        student_attendance = attendance_data['studentattendancelist']
        return student_attendance

    except Exception as e:
        return f"An error occurred: {e}"

def calculate_required_sgpa(target_cgpa, current_cgpa, total_credits, current_semester_credits):
    current_grade_points = current_cgpa * total_credits
    required_grade_points = target_cgpa * (total_credits + current_semester_credits)
    required_sgpa = (required_grade_points - current_grade_points) / current_semester_credits
    return required_sgpa

# Function to fetch CGPA details
def fetch_cgpa(userid, passwd):
    try:
        w = Webportal()
        s = w.student_login(userid, passwd, CAPTCHA)
        if not s:
            raise Exception("Login failed due to CAPTCHA or incorrect credentials.")
        
        meta = w.get_attendance_meta()
        if not meta:
            raise Exception("Failed to fetch attendance metadata.")
        header = meta.latest_header()
        cgpa_data = w.get_cgpa_report(header)
        
        return cgpa_data

    except Exception as e:
        return f"An error occurred: {e}"

# Streamlit UI Layout
st.title("📚 JIIT Student Tracker 🎓")

# Page styling
st.markdown(
    """
    <style>
        body {
            background-color: #f8f9fa;
            font-family: 'Arial', sans-serif;
        }
        h1 {
            color: #333333;
            text-align: center;
            font-size: 2.5em;
            margin-top: 30px;
        }
        .stButton button {
            background-color: #333;
            color: white;
            font-weight: bold;
            border-radius: 8px;
            width: 200px;
            height: 50px;
            font-size: 1.2em;
        }
        .stButton button:hover {
            background-color: #555;
        }
        .stTextInput input {
            border-radius: 8px;
            background-color: #ffffff;
            padding: 12px;
            font-size: 1em;
            border: 1px solid #ccc;
        }
        .stTextInput label {
            color: #333;
        }
        .stExpanderHeader {
            background-color: #333;
            color: white;
        }
        .stAlert {
            background-color: #FFEBEE;
            color: #D32F2F;
            font-weight: bold;
        }
    </style>
    """,
    unsafe_allow_html=True
)

# Section layout: Left (Login Inputs) and Right (Buttons)
col1, col2 = st.columns(2)

# Input fields for Username and Password
with col1:
    username = st.text_input("Enter your User ID", max_chars=20)
with col2:
    password = st.text_input("Enter your Password", type="password", max_chars=20)

# Buttons for fetching attendance and CGPA
with col1:
    attendance_button = st.button("Get Attendance 📝")
with col2:
    cgpa_button = st.button("Get CGPA 📊")

# SGPA Calculation Inputs
st.subheader("📊 SGPA Calculation")
target_cgpa = st.number_input("Enter Target CGPA", min_value=0.0, max_value=10.0, value=7.0, step=0.1)
current_sem_credits = st.number_input("Enter Current Semester Credits", min_value=0, step=1)

# SGPA Calculation Button
calculate_sgpa_button = st.button("Calculate Required SGPA 📈")

# SGPA Calculation Result
if calculate_sgpa_button:
    if target_cgpa and current_sem_credits:
        if username and password:
            cgpa_data = fetch_cgpa(username, password)
            
            if isinstance(cgpa_data, str):
                st.error(cgpa_data)
            else:
                semester_data = cgpa_data.get("semesterList", [])
                if semester_data:
                    total_credits = sum(semester.get('totalcoursecredit', 0) for semester in semester_data)
                    latest_semester = semester_data[-1]
                    overall_cgpa = latest_semester.get("cgpa", 0.0)
                    required_sgpa = calculate_required_sgpa(target_cgpa, overall_cgpa, total_credits, current_sem_credits)
                    st.subheader(f"Required SGPA to achieve Target CGPA {target_cgpa}: {required_sgpa:.2f}")
                else:
                    st.error("No CGPA data found for semesters.")
        else:
            st.error("Please enter both User ID and Password.")

# Fetch Attendance Data
if attendance_button:
    if not username or not password:
        st.error("Please enter both User ID and Password")
    else:
        # Fetch attendance data
        attendance = fetch_attendance(username, password)

        if isinstance(attendance, str):
            st.error(attendance)
        else:
            st.subheader("📚 Attendance Details")
            for subject in attendance:
                with st.expander(f"📚 {subject['subjectcode']}"):
                    if subject.get('LTpercantage'):
                        st.write(f"**Overall Percentage:** {subject['LTpercantage']}%")
                    if subject['Ltotalclass']:
                        st.write(f"**Total Lectures:** {subject['Ltotalclass']}")
                    if subject['Ltotalpres']:
                        st.write(f"**Lectures Attended:** {subject['Ltotalpres']}")
                        st.write(f"**Lectures Missed:** {subject['Ltotalclass'] - subject['Ltotalpres']}")
                    if subject['Ttotalclass']:
                        st.write(f"**Total Tutorials:** {subject['Ttotalclass']}")
                    if subject['Ttotalpres']:
                        st.write(f"**Tutorials Attended:** {subject['Ttotalpres']}")
                        st.write(f"**Tutorials Missed:** {subject['Ttotalclass'] - subject['Ttotalpres']}")
                    if subject['Tpercentage']:
                        st.write(f"**Tutorial Percentage:** {subject['Tpercentage']}%")
                    if subject['Ppercentage']:
                        st.write(f"**Practical Percentage:** {subject['Ppercentage']}%")

            avg_lecture_percentage = pd.DataFrame(attendance)['LTpercantage'].astype(float).mean()
            st.write(f"### Average Lecture Attendance: {avg_lecture_percentage:.2f}%")

# Fetch CGPA Data
if cgpa_button:
    if not username or not password:
        st.error("Please enter both User ID and Password")
    else:
        # Fetch CGPA data
        cgpa = fetch_cgpa(username, password)

        if isinstance(cgpa, str):
            st.error(cgpa)
        else:
            st.subheader("📘 Semester-wise CGPA Details")
            semester_data = cgpa.get("semesterList", [])

            if not semester_data:
                st.error("No CGPA data available for semesters.")
            else:
                for semester in semester_data:
                    with st.expander(f"Semester {semester.get('stynumber', 'N/A')}"):
                        st.write(f"**SGPA:** {semester.get('sgpa', 'N/A')}")
                        st.write(f"**CGPA:** {semester.get('cgpa', 'N/A')}")
                        st.write(f"**Total Course Credit:** {semester.get('totalcoursecredit', 'N/A')}")
                        st.write(f"**Total Earned Credits:** {semester.get('totalearnedcredits', 'N/A')}")
                        st.write(f"**Total Registered Credits:** {semester.get('totalregisteredcredit', 'N/A')}")

                overall_cgpa = cgpa.get("overallCGPA")
                if overall_cgpa:
                    st.markdown(
                        f"""
                        <div style='background-color: #f0f0f0; padding: 10px; border-radius: 8px; text-align: center; font-size: 1.2em; font-weight: bold; color: #333;'>
                            🎓 **Overall CGPA:** {overall_cgpa}
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )
